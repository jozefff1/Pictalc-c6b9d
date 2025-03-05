import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, PairedDevice, PairingRequest } from '@/types/pairing';

// Keys for different data types
const KEYS = {
  DEVICES: '@pictalk/devices',
  PAIRED_DEVICES: '@pictalk/paired_devices',
  PAIRING_REQUESTS: '@pictalk/pairing_requests',
  MESSAGES: '@pictalk/messages',
  SYNC_TIMESTAMP: '@pictalk/last_sync',
  USER_SETTINGS: '@pictalk/user_settings',
};

class LocalDatabase {
  // Store data locally
  async saveData<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data locally:', error);
      throw error;
    }
  }

  // Retrieve data from local storage
  async getData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data locally:', error);
      throw error;
    }
  }

  // Device Management
  async saveDevice(device: Device): Promise<void> {
    const devices = await this.getDevices();
    const updatedDevices = [...(devices || [])];
    const existingIndex = updatedDevices.findIndex(d => d.id === device.id);
    
    if (existingIndex >= 0) {
      updatedDevices[existingIndex] = device;
    } else {
      updatedDevices.push(device);
    }
    
    await this.saveData(KEYS.DEVICES, updatedDevices);
  }

  async getDevices(): Promise<Device[]> {
    return (await this.getData<Device[]>(KEYS.DEVICES)) || [];
  }

  // Paired Devices Management
  async savePairedDevice(pairedDevice: PairedDevice): Promise<void> {
    const pairedDevices = await this.getPairedDevices();
    const updated = [...(pairedDevices || [])];
    const existingIndex = updated.findIndex(p => p.id === pairedDevice.id);
    
    if (existingIndex >= 0) {
      updated[existingIndex] = pairedDevice;
    } else {
      updated.push(pairedDevice);
    }
    
    await this.saveData(KEYS.PAIRED_DEVICES, updated);
  }

  async getPairedDevices(): Promise<PairedDevice[]> {
    return (await this.getData<PairedDevice[]>(KEYS.PAIRED_DEVICES)) || [];
  }

  // Messages Management
  async saveMessage(message: any): Promise<void> {
    const messages = await this.getMessages();
    const updated = [...(messages || [])];
    const existingIndex = updated.findIndex(m => m.id === message.id);
    
    if (existingIndex >= 0) {
      updated[existingIndex] = message;
    } else {
      updated.push(message);
    }
    
    await this.saveData(KEYS.MESSAGES, updated);
  }

  async getMessages(): Promise<any[]> {
    return (await this.getData<any[]>(KEYS.MESSAGES)) || [];
  }

  // Sync Management
  async updateSyncTimestamp(): Promise<void> {
    await this.saveData(KEYS.SYNC_TIMESTAMP, new Date().toISOString());
  }

  async getLastSyncTimestamp(): Promise<string | null> {
    return await this.getData(KEYS.SYNC_TIMESTAMP);
  }

  // Clear all data (useful for logout)
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing local data:', error);
      throw error;
    }
  }
}

export const localDB = new LocalDatabase(); 