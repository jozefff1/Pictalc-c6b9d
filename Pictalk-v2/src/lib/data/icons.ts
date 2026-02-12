/**
 * Icon Database for AAC Communication
 * Uses emoji symbols for pilot demo (will migrate to ARASAAC in Phase 2)
 */
import type { Icon, IconCategory } from '@/types/models';

export const ICON_DATABASE: Icon[] = [
  // NEEDS Category
  { id: 'eat', name: 'Eat', category: 'needs', symbol: '🍽️', color: '#FF9D4D', imageUrl: undefined },
  { id: 'drink', name: 'Drink', category: 'needs', symbol: '🥤', color: '#FF9D4D', imageUrl: undefined },
  { id: 'water', name: 'Water', category: 'needs', symbol: '💧', color: '#FF9D4D', imageUrl: undefined },
  { id: 'toilet', name: 'Toilet', category: 'needs', symbol: '🚽', color: '#FF9D4D', imageUrl: undefined },
  { id: 'sleep', name: 'Sleep', category: 'needs', symbol: '😴', color: '#FF9D4D', imageUrl: undefined },
  { id: 'help', name: 'Help', category: 'needs', symbol: '🆘', color: '#FF9D4D', imageUrl: undefined },
  { id: 'medicine', name: 'Medicine', category: 'needs', symbol: '💊', color: '#FF9D4D', imageUrl: undefined },
  { id: 'hungry', name: 'Hungry', category: 'needs', symbol: '🍴', color: '#FF9D4D', imageUrl: undefined },
  { id: 'thirsty', name: 'Thirsty', category: 'needs', symbol: '🚰', color: '#FF9D4D', imageUrl: undefined },
  { id: 'pain', name: 'Pain', category: 'needs', symbol: '🤕', color: '#FF9D4D', imageUrl: undefined },
  { id: 'hot', name: 'Hot', category: 'needs', symbol: '🥵', color: '#FF9D4D', imageUrl: undefined },
  { id: 'cold', name: 'Cold', category: 'needs', symbol: '🥶', color: '#FF9D4D', imageUrl: undefined },

  // ACTIONS Category
  { id: 'play', name: 'Play', category: 'actions', symbol: '🎮', color: '#5AC8FA', imageUrl: undefined },
  { id: 'walk', name: 'Walk', category: 'actions', symbol: '🚶', color: '#5AC8FA', imageUrl: undefined },
  { id: 'run', name: 'Run', category: 'actions', symbol: '🏃', color: '#5AC8FA', imageUrl: undefined },
  { id: 'sit', name: 'Sit', category: 'actions', symbol: '🪑', color: '#5AC8FA', imageUrl: undefined },
  { id: 'stand', name: 'Stand', category: 'actions', symbol: '🧍', color: '#5AC8FA', imageUrl: undefined },
  { id: 'read', name: 'Read', category: 'actions', symbol: '📖', color: '#5AC8FA', imageUrl: undefined },
  { id: 'write', name: 'Write', category: 'actions', symbol: '✍️', color: '#5AC8FA', imageUrl: undefined },
  { id: 'draw', name: 'Draw', category: 'actions', symbol: '🎨', color: '#5AC8FA', imageUrl: undefined },
  { id: 'listen', name: 'Listen', category: 'actions', symbol: '👂', color: '#5AC8FA', imageUrl: undefined },
  { id: 'watch', name: 'Watch', category: 'actions', symbol: '📺', color: '#5AC8FA', imageUrl: undefined },
  { id: 'talk', name: 'Talk', category: 'actions', symbol: '💬', color: '#5AC8FA', imageUrl: undefined },
  { id: 'sing', name: 'Sing', category: 'actions', symbol: '🎤', color: '#5AC8FA', imageUrl: undefined },
  { id: 'dance', name: 'Dance', category: 'actions', symbol: '💃', color: '#5AC8FA', imageUrl: undefined },
  { id: 'jump', name: 'Jump', category: 'actions', symbol: '🦘', color: '#5AC8FA', imageUrl: undefined },

  // FEELINGS Category
  { id: 'happy', name: 'Happy', category: 'feelings', symbol: '😊', color: '#FFD60A', imageUrl: undefined },
  { id: 'sad', name: 'Sad', category: 'feelings', symbol: '😢', color: '#FFD60A', imageUrl: undefined },
  { id: 'angry', name: 'Angry', category: 'feelings', symbol: '😠', color: '#FFD60A', imageUrl: undefined },
  { id: 'scared', name: 'Scared', category: 'feelings', symbol: '😨', color: '#FFD60A', imageUrl: undefined },
  { id: 'excited', name: 'Excited', category: 'feelings', symbol: '🤩', color: '#FFD60A', imageUrl: undefined },
  { id: 'tired', name: 'Tired', category: 'feelings', symbol: '😫', color: '#FFD60A', imageUrl: undefined },
  { id: 'sick', name: 'Sick', category: 'feelings', symbol: '🤒', color: '#FFD60A', imageUrl: undefined },
  { id: 'love', name: 'Love', category: 'feelings', symbol: '❤️', color: '#FFD60A', imageUrl: undefined },
  { id: 'worried', name: 'Worried', category: 'feelings', symbol: '😟', color: '#FFD60A', imageUrl: undefined },
  { id: 'calm', name: 'Calm', category: 'feelings', symbol: '😌', color: '#FFD60A', imageUrl: undefined },
  { id: 'proud', name: 'Proud', category: 'feelings', symbol: '🤗', color: '#FFD60A', imageUrl: undefined },
  { id: 'surprised', name: 'Surprised', category: 'feelings', symbol: '😲', color: '#FFD60A', imageUrl: undefined },

  // PEOPLE Category
  { id: 'mom', name: 'Mom', category: 'people', symbol: '👩', color: '#FF6482', imageUrl: undefined },
  { id: 'dad', name: 'Dad', category: 'people', symbol: '👨', color: '#FF6482', imageUrl: undefined },
  { id: 'sister', name: 'Sister', category: 'people', symbol: '👧', color: '#FF6482', imageUrl: undefined },
  { id: 'brother', name: 'Brother', category: 'people', symbol: '👦', color: '#FF6482', imageUrl: undefined },
  { id: 'grandma', name: 'Grandma', category: 'people', symbol: '👵', color: '#FF6482', imageUrl: undefined },
  { id: 'grandpa', name: 'Grandpa', category: 'people', symbol: '👴', color: '#FF6482', imageUrl: undefined },
  { id: 'friend', name: 'Friend', category: 'people', symbol: '👫', color: '#FF6482', imageUrl: undefined },
  { id: 'teacher', name: 'Teacher', category: 'people', symbol: '👩‍🏫', color: '#FF6482', imageUrl: undefined },
  { id: 'doctor', name: 'Doctor', category: 'people', symbol: '👨‍⚕️', color: '#FF6482', imageUrl: undefined },
  { id: 'baby', name: 'Baby', category: 'people', symbol: '👶', color: '#FF6482', imageUrl: undefined },
  { id: 'family', name: 'Family', category: 'people', symbol: '👨‍👩‍👧‍👦', color: '#FF6482', imageUrl: undefined },
  { id: 'me', name: 'Me', category: 'people', symbol: '👤', color: '#FF6482', imageUrl: undefined },

  // PLACES Category
  { id: 'home', name: 'Home', category: 'places', symbol: '🏠', color: '#32D74B', imageUrl: undefined },
  { id: 'school', name: 'School', category: 'places', symbol: '🏫', color: '#32D74B', imageUrl: undefined },
  { id: 'park', name: 'Park', category: 'places', symbol: '🌳', color: '#32D74B', imageUrl: undefined },
  { id: 'hospital', name: 'Hospital', category: 'places', symbol: '🏥', color: '#32D74B', imageUrl: undefined },
  { id: 'store', name: 'Store', category: 'places', symbol: '🏪', color: '#32D74B', imageUrl: undefined },
  { id: 'restaurant', name: 'Restaurant', category: 'places', symbol: '🍴', color: '#32D74B', imageUrl: undefined },
  { id: 'playground', name: 'Playground', category: 'places', symbol: '🛝', color: '#32D74B', imageUrl: undefined },
  { id: 'beach', name: 'Beach', category: 'places', symbol: '🏖️', color: '#32D74B', imageUrl: undefined },
  { id: 'car', name: 'Car', category: 'places', symbol: '🚗', color: '#32D74B', imageUrl: undefined },
  { id: 'bed', name: 'Bed', category: 'places', symbol: '🛏️', color: '#32D74B', imageUrl: undefined },
  { id: 'bathroom', name: 'Bathroom', category: 'places', symbol: '🚿', color: '#32D74B', imageUrl: undefined },
  { id: 'kitchen', name: 'Kitchen', category: 'places', symbol: '🍳', color: '#32D74B', imageUrl: undefined },

  // CUSTOM Category (food/common items)
  { id: 'apple', name: 'Apple', category: 'custom', symbol: '🍎', color: '#BF5AF2', imageUrl: undefined },
  { id: 'banana', name: 'Banana', category: 'custom', symbol: '🍌', color: '#BF5AF2', imageUrl: undefined },
  { id: 'pizza', name: 'Pizza', category: 'custom', symbol: '🍕', color: '#BF5AF2', imageUrl: undefined },
  { id: 'juice', name: 'Juice', category: 'custom', symbol: '🧃', color: '#BF5AF2', imageUrl: undefined },
  { id: 'milk', name: 'Milk', category: 'custom', symbol: '🥛', color: '#BF5AF2', imageUrl: undefined },
  { id: 'cookie', name: 'Cookie', category: 'custom', symbol: '🍪', color: '#BF5AF2', imageUrl: undefined },
  { id: 'toy', name: 'Toy', category: 'custom', symbol: '🧸', color: '#BF5AF2', imageUrl: undefined },
  { id: 'book', name: 'Book', category: 'custom', symbol: '📚', color: '#BF5AF2', imageUrl: undefined },
  { id: 'ball', name: 'Ball', category: 'custom', symbol: '⚽', color: '#BF5AF2', imageUrl: undefined },
  { id: 'phone', name: 'Phone', category: 'custom', symbol: '📱', color: '#BF5AF2', imageUrl: undefined },
  { id: 'music', name: 'Music', category: 'custom', symbol: '🎵', color: '#BF5AF2', imageUrl: undefined },
  { id: 'yes', name: 'Yes', category: 'custom', symbol: '✅', color: '#BF5AF2', imageUrl: undefined },
  { id: 'no', name: 'No', category: 'custom', symbol: '❌', color: '#BF5AF2', imageUrl: undefined },
  { id: 'please', name: 'Please', category: 'custom', symbol: '🙏', color: '#BF5AF2', imageUrl: undefined },
  { id: 'thankyou', name: 'Thank You', category: 'custom', symbol: '🙏', color: '#BF5AF2', imageUrl: undefined },
];

// Helper function to get icons by category
export function getIconsByCategory(category: IconCategory): Icon[] {
  return ICON_DATABASE.filter(icon => icon.category === category);
}

// Helper function to get icon by ID
export function getIconById(id: string): Icon | undefined {
  return ICON_DATABASE.find(icon => icon.id === id);
}

// Helper function to search icons by keywords
export function searchIcons(query: string): Icon[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return ICON_DATABASE.filter(icon => {
    return icon.name.toLowerCase().includes(normalizedQuery) ||
           icon.id.toLowerCase().includes(normalizedQuery);
  });
}

// Category metadata
export const CATEGORIES = [
  { id: 'needs' as IconCategory, name: 'Needs', icon: '🍽️', color: '#FF9D4D' },
  { id: 'actions' as IconCategory, name: 'Actions', icon: '🎮', color: '#5AC8FA' },
  { id: 'feelings' as IconCategory, name: 'Feelings', icon: '😊', color: '#FFD60A' },
  { id: 'people' as IconCategory, name: 'People', icon: '👨‍👩‍👧‍👦', color: '#FF6482' },
  { id: 'places' as IconCategory, name: 'Places', icon: '🏠', color: '#32D74B' },
  { id: 'custom' as IconCategory, name: 'More', icon: '⭐', color: '#BF5AF2' },
];
