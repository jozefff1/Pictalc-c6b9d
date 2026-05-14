const tintColorLight = '#5E5CE6';
const tintColorDark = '#FFFFFF';

const Colors = {
  // Primary UI colors
  primary: '#5E5CE6', // Premium Indigo
  secondary: '#FF375F', // Deep Coral
  success: '#32D74B', // Emerald
  warning: '#FF9F0A',
  error: '#FF453A',
  background: '#F2F2F7',
  text: '#1C1C1E',
  border: '#E5E5EA',
  
  // Theme colors
  light: {
    background: '#F2F2F7',
    text: '#1C1C1E',
    tint: tintColorLight,
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.08)',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
  },
  
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    tint: tintColorDark,
    card: '#1C1C1E',
    shadow: 'rgba(255, 255, 255, 0.1)',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
  },
  
  // Premium tactile/glass palette
  premium: {
    // Backgrounds (Gradients are usually better but these are base hexes)
    backgroundMain: '#F4F4F9',
    glassBackground: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    
    // Category / Action Colors (Vivid & Modern)
    needs: '#FF9F0A',      // Vibrant Orange
    actions: '#5E5CE6',    // Deep Indigo
    feelings: '#FF375F',   // Pink/Coral
    people: '#BF5AF2',     // Rich Purple
    places: '#32D74B',     // Emerald Green
    
    // Light Variants for backgrounds
    needsLight: '#FFF0D9',
    actionsLight: '#EBEBFF',
    feelingsLight: '#FFE5EC',
    peopleLight: '#F4E5FA',
    placesLight: '#E5F9E9',
    
    // Text
    textDark: '#1C1C1E',
    textMuted: '#8E8E93',
    textLight: '#FFFFFF',
    
    // Elements
    shadowLight: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowHeavy: 'rgba(0, 0, 0, 0.25)',
    
    // Badges / Gamification
    streak: '#FF453A',
    gold: '#FFD60A',
    silver: '#8E8E93',
    bronze: '#A2845E',
  },
  
  // Kept for backward compatibility while we refactor
  candy: {
    blue: '#5E5CE6',
    blueDark: '#4543BF',
    blueLight: '#EBEBFF',
    orange: '#FF9F0A',
    orangeLight: '#FFF0D9',
    pink: '#FF375F',
    pinkLight: '#FFE5EC',
    purple: '#BF5AF2',
    purpleLight: '#F4E5FA',
    green: '#32D74B',
    greenLight: '#E5F9E9',
    red: '#FF453A',
    textDark: '#1C1C1E',
    textMuted: '#8E8E93',
    textLight: '#FFFFFF',
    textAccent: '#FF375F',
    backgroundLight: '#F4F4F9',
    backgroundPink: '#FFF0F5',
    backgroundMint: '#F0FFF4',
    backgroundLavender: '#F5F0FF',
    shadow: 'rgba(0, 0, 0, 0.1)',
    teal: '#64D2FF',
    mint: '#32D74B',
    lavender: '#BF5AF2',
    coral: '#FF375F',
    goldStar: '#FFD60A',
    silverStar: '#8E8E93',
    bronzeStar: '#A2845E',
    levelButton: '#BF5AF2',
    levelButtonBorder: '#8A3CB3',
    achievementBadge: '#FFD60A',
    streakFire: '#FF453A',
    energyBar: '#32D74B',
  }
};

export default Colors; 