import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Icon } from '@/types/models';

interface CommunicationState {
  selectedCategory: string;
  currentIcons: Icon[];
  sentence: Icon[];
  speaking: boolean;
  recentIcons: Icon[];
  favoritePhrases: Array<{
    id: string;
    icons: Icon[];
    sentence: string;
  }>;
  customIcons: Icon[];
}

const initialState: CommunicationState = {
  selectedCategory: 'needs',
  currentIcons: [],
  sentence: [],
  speaking: false,
  recentIcons: [],
  favoritePhrases: [],
  customIcons: [],
};

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setCurrentIcons: (state, action: PayloadAction<Icon[]>) => {
      state.currentIcons = action.payload;
    },
    setCustomIcons: (state, action: PayloadAction<Icon[]>) => {
      state.customIcons = action.payload;
    },
    addIconToSentence: (state, action: PayloadAction<Icon>) => {
      state.sentence.push(action.payload);
      
      // Add to recent icons
      const iconIndex = state.recentIcons.findIndex(i => i.id === action.payload.id);
      if (iconIndex > -1) {
        state.recentIcons.splice(iconIndex, 1);
      }
      state.recentIcons.unshift(action.payload);
      state.recentIcons = state.recentIcons.slice(0, 20);
    },
    removeIconFromSentence: (state, action: PayloadAction<number>) => {
      state.sentence.splice(action.payload, 1);
    },
    clearSentence: (state) => {
      state.sentence = [];
    },
    setSpeaking: (state, action: PayloadAction<boolean>) => {
      state.speaking = action.payload;
    },
    saveFavoritePhrase: (state, action: PayloadAction<{ icons: Icon[]; sentence: string }>) => {
      state.favoritePhrases.push({
        id: Date.now().toString(),
        icons: action.payload.icons,
        sentence: action.payload.sentence,
      });
    },
    removeFavoritePhrase: (state, action: PayloadAction<string>) => {
      state.favoritePhrases = state.favoritePhrases.filter(p => p.id !== action.payload);
    },
    loadFavoritePhrase: (state, action: PayloadAction<string>) => {
      const phrase = state.favoritePhrases.find(p => p.id === action.payload);
      if (phrase) {
        state.sentence = phrase.icons;
      }
    },
    setFavoritePhrases: (
      state,
      action: PayloadAction<Array<{ id: string; icons: Icon[]; sentence: string }>>
    ) => {
      state.favoritePhrases = action.payload;
    },
    // Granular custom icon mutations — no full re-fetch needed
    addCustomIcon: (state, action: PayloadAction<Icon>) => {
      if (!state.customIcons.some((ic) => ic.id === action.payload.id)) {
        state.customIcons.unshift(action.payload);
      }
    },
    updateCustomIcon: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const icon = state.customIcons.find((ic) => ic.id === action.payload.id);
      if (icon) icon.name = action.payload.name.toLowerCase();
    },
    removeCustomIcon: (state, action: PayloadAction<string>) => {
      state.customIcons = state.customIcons.filter((ic) => ic.id !== action.payload);
    },
    reorderSentenceIcons: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return;
      const [moved] = state.sentence.splice(fromIndex, 1);
      state.sentence.splice(toIndex, 0, moved);
    },
  },
});

export const {
  setSelectedCategory,
  setCurrentIcons,
  addIconToSentence,
  removeIconFromSentence,
  clearSentence,
  setSpeaking,
  saveFavoritePhrase,
  removeFavoritePhrase,
  loadFavoritePhrase,
  setCustomIcons,
  setFavoritePhrases,
  addCustomIcon,
  updateCustomIcon,
  removeCustomIcon,
  reorderSentenceIcons,
} = communicationSlice.actions;

export default communicationSlice.reducer;
