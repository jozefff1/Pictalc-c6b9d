import { configureStore } from '@reduxjs/toolkit';
import communicationReducer from './slices/communicationSlice';
import pairingReducer from './slices/pairingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    communication: communicationReducer,
    pairing: pairingReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['communication/setCurrentIcons'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
