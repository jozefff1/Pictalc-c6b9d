import { useState, useEffect } from 'react';
import { Device, PairedDevice, PairingRequest } from '@/types/pairing';
import { localDB } from '@/services/LocalDatabase';
import { syncService } from '@/services/SyncService';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';
import { nanoid } from 'nanoid';

export function usePairing() {
  const { user } = useAuth();
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [pairedDevices, setPairedDevices] = useState<PairedDevice[]>([]);
  const [pairingRequests, setPairingRequests] = useState<PairingRequest[]>([]);

  // Initialize current device
  useEffect(() => {
    const initDevice = async () => {
      if (!user) return;

      // Try to load existing device
      const devices = await localDB.getDevices();
      let device = devices.find(d => d.userId === user.uid);

      if (!device) {
        // Create new device if none exists
        device = {
          id: nanoid(),
          userId: user.uid,
          name: Platform.OS === 'web' ? 'Web Browser' : `${Platform.OS} Device`,
          role: 'child', // Default role, can be changed later
          platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
          lastActive: new Date(),
          createdAt: new Date()
        };
        await localDB.saveDevice(device);
        syncService.addPendingChange('devices');
      }

      setCurrentDevice(device);
    };

    initDevice();
  }, [user]);

  // Load paired devices
  useEffect(() => {
    const loadPairedDevices = async () => {
      if (!currentDevice) return;
      const paired = await localDB.getPairedDevices();
      setPairedDevices(paired);
    };

    loadPairedDevices();
  }, [currentDevice]);

  // Create pairing request
  const createPairingRequest = async (toUserId: string) => {
    if (!currentDevice) return;

    const request: PairingRequest = {
      id: nanoid(),
      fromDeviceId: currentDevice.id,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save locally first
    await localDB.saveData(`pairing_request_${request.id}`, request);
    syncService.addPendingChange(`pairing_request_${request.id}`);

    return request;
  };

  // Accept pairing request
  const acceptPairingRequest = async (requestId: string, relationship: 'parent' | 'teacher' | 'caregiver') => {
    if (!currentDevice) return;

    const request = await localDB.getData<PairingRequest>(`pairing_request_${requestId}`);
    if (!request || request.status !== 'pending') return;

    // Update request status
    request.status = 'accepted';
    request.updatedAt = new Date();
    await localDB.saveData(`pairing_request_${requestId}`, request);

    // Create paired device record
    const pairedDevice: PairedDevice = {
      id: nanoid(),
      childDeviceId: request.fromDeviceId,
      guardianDeviceId: currentDevice.id,
      relationship,
      createdAt: new Date(),
      lastInteraction: new Date()
    };

    await localDB.savePairedDevice(pairedDevice);
    setPairedDevices(prev => [...prev, pairedDevice]);

    // Mark for sync
    syncService.addPendingChange(`pairing_request_${requestId}`);
    syncService.addPendingChange('paired_devices');
  };

  // Reject pairing request
  const rejectPairingRequest = async (requestId: string) => {
    const request = await localDB.getData<PairingRequest>(`pairing_request_${requestId}`);
    if (!request || request.status !== 'pending') return;

    request.status = 'rejected';
    request.updatedAt = new Date();
    await localDB.saveData(`pairing_request_${requestId}`, request);
    syncService.addPendingChange(`pairing_request_${requestId}`);
  };

  // Update device role
  const updateDeviceRole = async (role: Device['role']) => {
    if (!currentDevice) return;

    const updatedDevice = {
      ...currentDevice,
      role,
      lastActive: new Date()
    };

    await localDB.saveDevice(updatedDevice);
    setCurrentDevice(updatedDevice);
    syncService.addPendingChange('devices');
  };

  // Check if a device is paired
  const isDevicePaired = (deviceId: string) => {
    return pairedDevices.some(
      p => p.childDeviceId === deviceId || p.guardianDeviceId === deviceId
    );
  };

  return {
    currentDevice,
    pairedDevices,
    createPairingRequest,
    acceptPairingRequest,
    rejectPairingRequest,
    updateDeviceRole,
    isDevicePaired
  };
} 