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
}

const initialState: CommunicationState = {
  selectedCategory: 'needs',
  currentIcons: [],
  sentence: [],
  speaking: false,
  recentIcons: [],
  favoritePhrases: [],
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
} = communicationSlice.actions;

export default communicationSlice.reducer;
