import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Pairing } from '@/types/models';

interface PairingState {
  pairings: Pairing[];
  activePairingRequest: {
    token: string;
    expiresAt: Date;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: PairingState = {
  pairings: [],
  activePairingRequest: null,
  loading: false,
  error: null,
};

const pairingSlice = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    setPairings: (state, action: PayloadAction<Pairing[]>) => {
      state.pairings = action.payload;
    },
    addPairing: (state, action: PayloadAction<Pairing>) => {
      state.pairings.push(action.payload);
    },
    removePairing: (state, action: PayloadAction<string>) => {
      state.pairings = state.pairings.filter(p => p.id !== action.payload);
    },
    setActivePairingRequest: (
      state,
      action: PayloadAction<{ token: string; expiresAt: Date } | null>
    ) => {
      state.activePairingRequest = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setPairings,
  addPairing,
  removePairing,
  setActivePairingRequest,
  setLoading,
  setError,
} = pairingSlice.actions;

export default pairingSlice.reducer;
