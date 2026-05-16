/**
 * Icon Database for AAC Communication
 * Uses ARASAAC pictograms (CC BY-NC-SA 4.0) — https://arasaac.org
 * Image URL format: https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */
import type { Icon, IconCategory } from '@/types/models';

export const ICON_DATABASE: Icon[] = [
  // NEEDS Category
  { id: 'eat', name: 'Eat', category: 'needs', symbol: '🍽️', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/6456/6456_500.png' },
  { id: 'drink', name: 'Drink', category: 'needs', symbol: '🥤', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/6061/6061_500.png' },
  { id: 'water', name: 'Water', category: 'needs', symbol: '💧', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/32464/32464_500.png' },
  { id: 'toilet', name: 'Toilet', category: 'needs', symbol: '🚽', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/5921/5921_500.png' },
  { id: 'sleep', name: 'Sleep', category: 'needs', symbol: '😴', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/6479/6479_500.png' },
  { id: 'help', name: 'Help', category: 'needs', symbol: '🆘', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/32648/32648_500.png' },
  { id: 'medicine', name: 'Medicine', category: 'needs', symbol: '💊', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/24933/24933_500.png' },
  { id: 'hungry', name: 'Hungry', category: 'needs', symbol: '🍴', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/35579/35579_500.png' },
  { id: 'thirsty', name: 'Thirsty', category: 'needs', symbol: '🚰', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/7273/7273_500.png' },
  { id: 'pain', name: 'Pain', category: 'needs', symbol: '🤕', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/30620/30620_500.png' },
  { id: 'hot', name: 'Hot', category: 'needs', symbol: '🥵', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/6952/6952_500.png' },
  { id: 'cold', name: 'Cold', category: 'needs', symbol: '🥶', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/35583/35583_500.png' },
  { id: 'want', name: 'Want', category: 'needs', symbol: '🤲', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/32753/32753_500.png' },
  { id: 'need', name: 'Need', category: 'needs', symbol: '🙏', color: '#FF9D4D', imageUrl: 'https://static.arasaac.org/pictograms/7171/7171_500.png' },

  // ACTIONS Category
  { id: 'play', name: 'Play', category: 'actions', symbol: '🎮', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/23392/23392_500.png' },
  { id: 'walk', name: 'Walk', category: 'actions', symbol: '🚶', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/29951/29951_500.png' },
  { id: 'run', name: 'Run', category: 'actions', symbol: '🏃', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6465/6465_500.png' },
  { id: 'sit', name: 'Sit', category: 'actions', symbol: '🪑', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6611/6611_500.png' },
  { id: 'stand', name: 'Stand', category: 'actions', symbol: '🧍', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/13370/13370_500.png' },
  { id: 'read', name: 'Read', category: 'actions', symbol: '📖', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/7141/7141_500.png' },
  { id: 'write', name: 'Write', category: 'actions', symbol: '✍️', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/2380/2380_500.png' },
  { id: 'draw', name: 'Draw', category: 'actions', symbol: '🎨', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/8088/8088_500.png' },
  { id: 'listen', name: 'Listen', category: 'actions', symbol: '👂', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6572/6572_500.png' },
  { id: 'watch', name: 'Watch', category: 'actions', symbol: '📺', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6564/6564_500.png' },
  { id: 'talk', name: 'Talk', category: 'actions', symbol: '💬', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6517/6517_500.png' },
  { id: 'sing', name: 'Sing', category: 'actions', symbol: '🎤', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/6960/6960_500.png' },
  { id: 'dance', name: 'Dance', category: 'actions', symbol: '💃', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/35747/35747_500.png' },
  { id: 'jump', name: 'Jump', category: 'actions', symbol: '🦘', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/39052/39052_500.png' },
  { id: 'do', name: 'Do', category: 'actions', symbol: '💪', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/32751/32751_500.png' },
  { id: 'make', name: 'Make', category: 'actions', symbol: '🛠️', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/32751/32751_500.png' },
  { id: 'wait', name: 'Wait', category: 'actions', symbol: '✋', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/36914/36914_500.png' },
  { id: 'go', name: 'Go', category: 'actions', symbol: '🟢', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/8142/8142_500.png' },
  { id: 'stop', name: 'Stop', category: 'actions', symbol: '🛑', color: '#5AC8FA', imageUrl: 'https://static.arasaac.org/pictograms/7196/7196_500.png' },

  // FEELINGS Category
  { id: 'happy', name: 'Happy', category: 'feelings', symbol: '😊', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35533/35533_500.png' },
  { id: 'sad', name: 'Sad', category: 'feelings', symbol: '😢', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35545/35545_500.png' },
  { id: 'angry', name: 'Angry', category: 'feelings', symbol: '😠', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35539/35539_500.png' },
  { id: 'scared', name: 'Scared', category: 'feelings', symbol: '😨', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35535/35535_500.png' },
  { id: 'excited', name: 'Excited', category: 'feelings', symbol: '🤩', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/39090/39090_500.png' },
  { id: 'tired', name: 'Tired', category: 'feelings', symbol: '😫', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35537/35537_500.png' },
  { id: 'sick', name: 'Sick', category: 'feelings', symbol: '🤒', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/7040/7040_500.png' },
  { id: 'love', name: 'Love', category: 'feelings', symbol: '❤️', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/37721/37721_500.png' },
  { id: 'worried', name: 'Worried', category: 'feelings', symbol: '😟', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/26986/26986_500.png' },
  { id: 'calm', name: 'Calm', category: 'feelings', symbol: '😌', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/31310/31310_500.png' },
  { id: 'proud', name: 'Proud', category: 'feelings', symbol: '🤗', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/31408/31408_500.png' },
  { id: 'surprised', name: 'Surprised', category: 'feelings', symbol: '😲', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/35529/35529_500.png' },
  { id: 'like', name: 'Like', category: 'feelings', symbol: '👍', color: '#FFD60A', imageUrl: 'https://static.arasaac.org/pictograms/37826/37826_500.png' },

  // PEOPLE Category
  { id: 'mom', name: 'Mom', category: 'people', symbol: '👩', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/2458/2458_500.png' },
  { id: 'dad', name: 'Dad', category: 'people', symbol: '👨', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/25298/25298_500.png' },
  { id: 'sister', name: 'Sister', category: 'people', symbol: '👧', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/2422/2422_500.png' },
  { id: 'brother', name: 'Brother', category: 'people', symbol: '👦', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/2423/2423_500.png' },
  { id: 'grandma', name: 'Grandma', category: 'people', symbol: '👵', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/23710/23710_500.png' },
  { id: 'grandpa', name: 'Grandpa', category: 'people', symbol: '👴', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/23718/23718_500.png' },
  { id: 'friend', name: 'Friend', category: 'people', symbol: '👫', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/25790/25790_500.png' },
  { id: 'teacher', name: 'Teacher', category: 'people', symbol: '👩‍🏫', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/6556/6556_500.png' },
  { id: 'doctor', name: 'Doctor', category: 'people', symbol: '👨‍⚕️', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/6561/6561_500.png' },
  { id: 'baby', name: 'Baby', category: 'people', symbol: '👶', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/6060/6060_500.png' },
  { id: 'family', name: 'Family', category: 'people', symbol: '👨‍👩‍👧‍👦', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/38351/38351_500.png' },
  { id: 'me', name: 'Me', category: 'people', symbol: '👤', color: '#FF6482', imageUrl: 'https://static.arasaac.org/pictograms/6632/6632_500.png' },

  // PLACES Category
  { id: 'home', name: 'Home', category: 'places', symbol: '🏠', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/6964/6964_500.png' },
  { id: 'school', name: 'School', category: 'places', symbol: '🏫', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/32446/32446_500.png' },
  { id: 'park', name: 'Park', category: 'places', symbol: '🌳', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/24755/24755_500.png' },
  { id: 'hospital', name: 'Hospital', category: 'places', symbol: '🏥', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/36210/36210_500.png' },
  { id: 'store', name: 'Store', category: 'places', symbol: '🏪', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/35695/35695_500.png' },
  { id: 'restaurant', name: 'Restaurant', category: 'places', symbol: '🍴', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/32408/32408_500.png' },
  { id: 'playground', name: 'Playground', category: 'places', symbol: '🛝', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/33064/33064_500.png' },
  { id: 'beach', name: 'Beach', category: 'places', symbol: '🏖️', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/30518/30518_500.png' },
  { id: 'car', name: 'Car', category: 'places', symbol: '🚗', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/2339/2339_500.png' },
  { id: 'bed', name: 'Bed', category: 'places', symbol: '🛏️', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/25900/25900_500.png' },
  { id: 'bathroom', name: 'Bathroom', category: 'places', symbol: '🚿', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/5921/5921_500.png' },
  { id: 'kitchen', name: 'Kitchen', category: 'places', symbol: '🍳', color: '#32D74B', imageUrl: 'https://static.arasaac.org/pictograms/10752/10752_500.png' },

  // CUSTOM Category (food/common items)
  { id: 'apple', name: 'Apple', category: 'custom', symbol: '🍎', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/2462/2462_500.png' },
  { id: 'banana', name: 'Banana', category: 'custom', symbol: '🍌', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/2530/2530_500.png' },
  { id: 'pizza', name: 'Pizza', category: 'custom', symbol: '🍕', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/2527/2527_500.png' },
  { id: 'juice', name: 'Juice', category: 'custom', symbol: '🧃', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/11461/11461_500.png' },
  { id: 'milk', name: 'Milk', category: 'custom', symbol: '🥛', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/2445/2445_500.png' },
  { id: 'cookie', name: 'Cookie', category: 'custom', symbol: '🍪', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/8312/8312_500.png' },
  { id: 'toy', name: 'Toy', category: 'custom', symbol: '🧸', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/25966/25966_500.png' },
  { id: 'book', name: 'Book', category: 'custom', symbol: '📚', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/36392/36392_500.png' },
  { id: 'ball', name: 'Ball', category: 'custom', symbol: '⚽', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/3241/3241_500.png' },
  { id: 'phone', name: 'Phone', category: 'custom', symbol: '📱', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/26479/26479_500.png' },
  { id: 'music', name: 'Music', category: 'custom', symbol: '🎵', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/24791/24791_500.png' },
  { id: 'yes', name: 'Yes', category: 'custom', symbol: '✅', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/5584/5584_500.png' },
  { id: 'no', name: 'No', category: 'custom', symbol: '❌', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/5526/5526_500.png' },
  { id: 'please', name: 'Please', category: 'custom', symbol: '🙏', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/8195/8195_500.png' },
  { id: 'thankyou', name: 'Thank You', category: 'custom', symbol: '🙏', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/8129/8129_500.png' },
  { id: 'more', name: 'More', category: 'custom', symbol: '➕', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/32753/32753_500.png' },
  { id: 'all', name: 'All Done', category: 'custom', symbol: '👐', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/28429/28429_500.png' },
  { id: 'now', name: 'Now', category: 'custom', symbol: '👇', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/32747/32747_500.png' },
  { id: 'later', name: 'Later', category: 'custom', symbol: '⏭️', color: '#BF5AF2', imageUrl: 'https://static.arasaac.org/pictograms/32749/32749_500.png' },
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
