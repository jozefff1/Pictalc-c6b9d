import { db } from '@/config/firebase';
import { localDB } from './LocalDatabase';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { Device, PairedDevice } from '@/types/pairing';

class SyncService {
  private isOnline: boolean = false;
  private syncInProgress: boolean = false;
  private pendingChanges: Set<string> = new Set();

  constructor() {
    // Initialize network listener
    NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came online, trigger a sync
      if (wasOffline && this.isOnline) {
        this.syncData();
      }
    });
  }

  // Add changes to pending queue
  addPendingChange(key: string): void {
    this.pendingChanges.add(key);
    this.attemptSync();
  }

  // Attempt to sync if conditions are right
  private async attemptSync(): Promise<void> {
    if (this.isOnline && !this.syncInProgress && this.pendingChanges.size > 0) {
      await this.syncData();
    }
  }

  // Main sync function
  private async syncData(): Promise<void> {
    if (this.syncInProgress) return;

    try {
      this.syncInProgress = true;
      
      // Get last sync timestamp
      const lastSync = await localDB.getLastSyncTimestamp();
      const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);

      // Sync devices
      await this.syncDevices(lastSyncDate);
      
      // Sync paired devices
      await this.syncPairedDevices(lastSyncDate);
      
      // Sync messages
      await this.syncMessages(lastSyncDate);

      // Update sync timestamp
      await localDB.updateSyncTimestamp();
      
      // Clear pending changes
      this.pendingChanges.clear();

    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync devices with Firestore
  private async syncDevices(lastSync: Date): Promise<void> {
    // Get local devices that were updated since last sync
    const localDevices = await localDB.getDevices();
    
    // Get remote devices that were updated since last sync
    const devicesRef = collection(db, 'devices');
    const q = query(devicesRef, where('lastActive', '>', lastSync));
    const snapshot = await getDocs(q);

    // Update remote with local changes
    for (const device of localDevices) {
      const deviceRef = doc(db, 'devices', device.id);
      await setDoc(deviceRef, {
        ...device,
        lastActive: Timestamp.fromDate(device.lastActive),
        createdAt: Timestamp.fromDate(device.createdAt)
      }, { merge: true });
    }

    // Update local with remote changes
    snapshot.forEach(async (doc) => {
      const deviceData = doc.data() as Device;
      await localDB.saveDevice(deviceData);
    });
  }

  // Sync paired devices with Firestore
  private async syncPairedDevices(lastSync: Date): Promise<void> {
    const localPaired = await localDB.getPairedDevices();
    
    const pairedRef = collection(db, 'paired_devices');
    const q = query(pairedRef, where('lastInteraction', '>', lastSync));
    const snapshot = await getDocs(q);

    // Update remote with local changes
    for (const paired of localPaired) {
      const pairedRef = doc(db, 'paired_devices', paired.id);
      await setDoc(pairedRef, {
        ...paired,
        lastInteraction: Timestamp.fromDate(paired.lastInteraction),
        createdAt: Timestamp.fromDate(paired.createdAt)
      }, { merge: true });
    }

    // Update local with remote changes
    snapshot.forEach(async (doc) => {
      const pairedData = doc.data() as PairedDevice;
      await localDB.savePairedDevice(pairedData);
    });
  }

  // Sync messages with Firestore
  private async syncMessages(lastSync: Date): Promise<void> {
    const localMessages = await localDB.getMessages();
    
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('timestamp', '>', lastSync));
    const snapshot = await getDocs(q);

    // Update remote with local changes
    for (const message of localMessages) {
      const messageRef = doc(db, 'messages', message.id);
      await setDoc(messageRef, message, { merge: true });
    }

    // Update local with remote changes
    snapshot.forEach(async (doc) => {
      const messageData = doc.data();
      await localDB.saveMessage(messageData);
    });
  }

  // Force a sync (can be called manually)
  async forceSyncData(): Promise<void> {
    if (this.isOnline) {
      await this.syncData();
    }
  }
}

export const syncService = new SyncService(); 