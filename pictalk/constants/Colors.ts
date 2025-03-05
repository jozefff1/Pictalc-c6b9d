const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const Colors = {
  // Primary UI colors
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  text: '#000000',
  border: '#C6C6C8',
  
  // Theme colors
  light: {
    background: '#FFFFFF',
    text: '#000000',
    tint: tintColorLight,
    card: '#F2F2F7',
    shadow: 'rgba(0, 0, 0, 0.1)',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    tint: tintColorDark,
    card: '#1C1C1E',
    shadow: 'rgba(255, 255, 255, 0.1)',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  
  // Candy Crush inspired palette
  candy: {
    // Main colors
    blue: '#4A90E2',
    blueDark: '#357ABD',
    blueLight: '#E8F2FF',
    orange: '#FF9500',
    orangeLight: '#FFF3E0',
    pink: '#FF2D55',
    pinkLight: '#FFE5EB',
    purple: '#9B51E0',
    purpleLight: '#F3E5F5',
    green: '#34C759',
    greenLight: '#E8F5E9',
    red: '#FF3B30',
    
    // Text colors
    textDark: '#1A1A1A',
    textMuted: '#8E8E93',
    textLight: '#FFFFFF',
    textAccent: '#FF3B8B',
    
    // Background colors
    backgroundLight: '#F2F2F7',
    backgroundPink: '#FFF0F5',
    backgroundMint: '#F0FFF4',
    backgroundLavender: '#F5F0FF',
    
    // Shadow
    shadow: '#000',
    
    // Special colors
    teal: '#5AC8D8',
    mint: '#00D6A2',
    lavender: '#B5A8FF',
    coral: '#FF7D54',
    
    // UI accents
    goldStar: '#FFD700',
    silverStar: '#C0C0C0',
    bronzeStar: '#CD7F32',
    
    // Game elements
    levelButton: '#FF85C2',
    levelButtonBorder: '#FF4D94',
    achievementBadge: '#FFD700',
    streakFire: '#FF5722',
    energyBar: '#00E676',
  },
  
  // Category colors (for communication icons)
  categories: {
    needs: '#FF9D4D',    // Orange
    actions: '#5AC8FA',  // Blue
    feelings: '#FF6B8B', // Pink
    people: '#BF5AF2',   // Purple
    places: '#4CD964',   // Green
    things: '#FFDE59',   // Yellow
  }
};

export default Colors; 