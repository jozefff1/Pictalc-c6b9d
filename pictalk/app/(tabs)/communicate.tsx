import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

// Mock data for categories and icons
const categories = [
  { id: 'needs', name: 'Needs', icon: 'food-apple' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'actions', name: 'Actions', icon: 'run' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'feelings', name: 'Feelings', icon: 'emoticon-happy' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'people', name: 'People', icon: 'account-group' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'places', name: 'Places', icon: 'home' as keyof typeof MaterialCommunityIcons.glyphMap },
];

// Define the type for icon items
interface IconItem {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

// Define the type for icons data
interface IconsData {
  [category: string]: IconItem[];
}

const iconsData: IconsData = {
  needs: [
    { id: 'eat', name: 'Eat', icon: 'food' },
    { id: 'drink', name: 'Drink', icon: 'cup-water' },
    { id: 'toilet', name: 'Toilet', icon: 'toilet' },
    { id: 'sleep', name: 'Sleep', icon: 'sleep' },
    { id: 'medicine', name: 'Medicine', icon: 'pill' },
    { id: 'help', name: 'Help', icon: 'help-circle' },
  ],
  actions: [
    { id: 'play', name: 'Play', icon: 'gamepad-variant' },
    { id: 'walk', name: 'Walk', icon: 'walk' },
    { id: 'read', name: 'Read', icon: 'book-open-variant' },
    { id: 'draw', name: 'Draw', icon: 'pencil' },
    { id: 'listen', name: 'Listen', icon: 'ear-hearing' },
    { id: 'watch', name: 'Watch', icon: 'television' },
  ],
  feelings: [
    { id: 'happy', name: 'Happy', icon: 'emoticon-happy' },
    { id: 'sad', name: 'Sad', icon: 'emoticon-sad' },
    { id: 'angry', name: 'Angry', icon: 'emoticon-angry' },
    { id: 'tired', name: 'Tired', icon: 'emoticon-neutral' },
    { id: 'scared', name: 'Scared', icon: 'emoticon-frown' },
    { id: 'excited', name: 'Excited', icon: 'emoticon-excited' },
  ],
  people: [
    { id: 'mom', name: 'Mom', icon: 'human-female' },
    { id: 'dad', name: 'Dad', icon: 'human-male' },
    { id: 'friend', name: 'Friend', icon: 'account' },
    { id: 'teacher', name: 'Teacher', icon: 'school' },
    { id: 'doctor', name: 'Doctor', icon: 'doctor' },
    { id: 'family', name: 'Family', icon: 'account-group' },
  ],
  places: [
    { id: 'home', name: 'Home', icon: 'home' },
    { id: 'school', name: 'School', icon: 'school' },
    { id: 'park', name: 'Park', icon: 'tree' },
    { id: 'store', name: 'Store', icon: 'store' },
    { id: 'hospital', name: 'Hospital', icon: 'hospital-building' },
    { id: 'restaurant', name: 'Restaurant', icon: 'silverware-fork-knife' },
  ],
};

export default function CommunicateScreen() {
  const [selectedCategory, setSelectedCategory] = useState('needs');
  const [sentence, setSentence] = useState<IconItem[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollX = new Animated.Value(0);
  const { width } = Dimensions.get('window');

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      try {
        if (style in Haptics.NotificationFeedbackType) {
          await Haptics.notificationAsync(style as Haptics.NotificationFeedbackType);
        } else {
          await Haptics.impactAsync(style as Haptics.ImpactFeedbackStyle);
        }
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  const speakSentence = () => {
    if (sentence.length === 0) return;
    
    const text = sentence.map(item => item.name).join(' ');
    setSpeaking(true);
    triggerHaptic(Haptics.NotificationFeedbackType.Success);
    
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  };

  const addToSentence = (item: IconItem) => {
    setSentence([...sentence, item]);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeFromSentence = (index: number) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  };

  const clearSentence = () => {
    setSentence([]);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const getCategoryColor = (categoryId: string) => {
    const colors: {[key: string]: string} = {
      needs: Colors.candy.orange,
      actions: Colors.candy.blue,
      feelings: Colors.candy.pink,
      people: Colors.candy.purple,
      places: Colors.candy.green,
    };
    return colors[categoryId] || Colors.candy.blue;
  };

  const getCategoryLightColor = (categoryId: string) => {
    const colors: {[key: string]: string} = {
      needs: Colors.candy.orangeLight,
      actions: Colors.candy.blueLight,
      feelings: Colors.candy.pinkLight,
      people: Colors.candy.purpleLight,
      places: Colors.candy.greenLight,
    };
    return colors[categoryId] || Colors.candy.blueLight;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sentence Builder */}
      <View style={styles.sentenceContainer}>
        {sentence.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sentenceScrollContent}
          >
            {sentence.map((item, index) => (
              <Pressable 
                key={`${item.id}-${index}`} 
                style={[
                  styles.sentenceItem,
                  { backgroundColor: getCategoryLightColor(selectedCategory) }
                ]}
                onPress={() => removeFromSentence(index)}
              >
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={32} 
                  color={getCategoryColor(selectedCategory)} 
                />
                <Text style={styles.sentenceItemText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptySentence}>
            <Text style={styles.emptySentenceText}>
              Select icons to build your sentence
            </Text>
          </View>
        )}
      </View>

      {/* Sentence Actions */}
      <View style={styles.sentenceActions}>
        <Pressable 
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearSentence}
          disabled={sentence.length === 0}
        >
          <MaterialCommunityIcons 
            name="delete" 
            size={24} 
            color={sentence.length === 0 ? Colors.candy.textMuted : Colors.candy.red} 
          />
        </Pressable>
        
        <Pressable 
          style={[
            styles.actionButton, 
            styles.speakButton,
            speaking && styles.speakingButton,
            sentence.length === 0 && styles.disabledButton
          ]}
          onPress={speakSentence}
          disabled={sentence.length === 0}
        >
          <MaterialCommunityIcons 
            name={speaking ? "volume-high" : "volume-medium"} 
            size={28} 
            color={sentence.length === 0 ? Colors.candy.textMuted : "#FFF"} 
          />
          <Text style={styles.speakButtonText}>
            {speaking ? "Speaking..." : "Speak"}
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.actionButton, styles.saveButton]}
          disabled={sentence.length === 0}
        >
          <MaterialCommunityIcons 
            name="content-save" 
            size={24} 
            color={sentence.length === 0 ? Colors.candy.textMuted : Colors.candy.green} 
          />
        </Pressable>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && {
                backgroundColor: getCategoryLightColor(category.id),
                borderColor: getCategoryColor(category.id),
              }
            ]}
            onPress={() => {
              setSelectedCategory(category.id);
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <MaterialCommunityIcons 
              name={category.icon} 
              size={24} 
              color={getCategoryColor(category.id)} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && {
                  color: getCategoryColor(category.id),
                  fontWeight: '600'
                }
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Icons Grid */}
      <ScrollView style={styles.iconsContainer}>
        <View style={styles.iconsGrid}>
          {iconsData[selectedCategory].map((item) => (
            <Pressable
              key={item.id}
              style={styles.iconButton}
              onPress={() => addToSentence(item)}
            >
              <View 
                style={[
                  styles.iconCircle,
                  { backgroundColor: getCategoryLightColor(selectedCategory) }
                ]}
              >
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={36} 
                  color={getCategoryColor(selectedCategory)} 
                />
              </View>
              <Text style={styles.iconText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.candy.backgroundLight,
  },
  sentenceContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    minHeight: 100,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sentenceScrollContent: {
    paddingRight: 8,
    alignItems: 'center',
  },
  sentenceItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    width: 80,
    height: 80,
  },
  sentenceItemText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  emptySentence: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  emptySentenceText: {
    color: Colors.candy.textMuted,
    fontSize: 16,
  },
  sentenceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
  },
  clearButton: {
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  speakButton: {
    backgroundColor: Colors.candy.blue,
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: Colors.candy.blueDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  speakingButton: {
    backgroundColor: Colors.candy.green,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
  },
  speakButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    maxHeight: 60,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.candy.textDark,
  },
  iconsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.candy.textDark,
  },
  form: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.candy.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});