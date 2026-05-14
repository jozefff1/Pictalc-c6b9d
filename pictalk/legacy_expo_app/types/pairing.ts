export type DeviceRole = 'child' | 'parent' | 'teacher' | 'caregiver';

export interface Device {
  id: string;
  userId: string;
  name: string;
  role: DeviceRole;
  platform: 'web' | 'ios' | 'android';
  lastActive: Date;
  createdAt: Date;
}

export interface PairingRequest {
  id: string;
  fromDeviceId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface PairedDevice {
  id: string;
  childDeviceId: string;
  guardianDeviceId: string;
  relationship: 'parent' | 'teacher' | 'caregiver';
  createdAt: Date;
  lastInteraction: Date;
} 