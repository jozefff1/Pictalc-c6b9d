import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserPreferences } from '@/types/models';

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  theme: 'light' | 'dark' | 'auto';
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  notifications: NotificationState[];
  preferences: Partial<UserPreferences> | null;
}

const initialState: UIState = {
  theme: 'auto',
  isOnline: true,
  isSyncing: false,
  lastSyncAt: null,
  notifications: [],
  preferences: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
      if (!action.payload) {
        state.lastSyncAt = new Date();
      }
    },
    addNotification: (state, action: PayloadAction<NotificationState>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  setTheme,
  setOnlineStatus,
  setSyncing,
  addNotification,
  removeNotification,
  setPreferences,
} = uiSlice.actions;

export default uiSlice.reducer;
