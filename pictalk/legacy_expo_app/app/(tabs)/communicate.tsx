import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

// Custom Tactile Button
const TactileButton = ({ onPress, children, style, disabled = false, scaleDown = 0.9 }: any) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: scaleDown,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (!disabled) {
            if (onPress) onPress();
          }
        }}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// Mock data for categories and icons
const categories = [
  { id: 'needs', name: 'Needs', icon: 'food-apple' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'actions', name: 'Actions', icon: 'run' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'feelings', name: 'Feelings', icon: 'emoticon-happy' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'people', name: 'People', icon: 'account-group' as keyof typeof MaterialCommunityIcons.glyphMap },
  { id: 'places', name: 'Places', icon: 'home' as keyof typeof MaterialCommunityIcons.glyphMap },
];

interface IconItem {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

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
      needs: Colors.premium.needs,
      actions: Colors.premium.actions,
      feelings: Colors.premium.feelings,
      people: Colors.premium.people,
      places: Colors.premium.places,
    };
    return colors[categoryId] || Colors.premium.actions;
  };

  const getCategoryLightColor = (categoryId: string) => {
    const colors: {[key: string]: string} = {
      needs: Colors.premium.needsLight,
      actions: Colors.premium.actionsLight,
      feelings: Colors.premium.feelingsLight,
      people: Colors.premium.peopleLight,
      places: Colors.premium.placesLight,
    };
    return colors[categoryId] || Colors.premium.actionsLight;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.premium.backgroundMain, '#E2E2F0']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Sentence Builder */}
      <View style={styles.sentenceContainerWrapper}>
        <BlurView intensity={80} tint="light" style={styles.sentenceContainer}>
          {sentence.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sentenceScrollContent}
            >
              {sentence.map((item, index) => (
                <TactileButton 
                  key={`${item.id}-${index}`} 
                  onPress={() => removeFromSentence(index)}
                >
                  <View style={[
                    styles.sentenceItem,
                    { backgroundColor: getCategoryLightColor(selectedCategory) }
                  ]}>
                    <MaterialCommunityIcons 
                      name={item.icon} 
                      size={28} 
                      color={getCategoryColor(selectedCategory)} 
                    />
                    <Text style={styles.sentenceItemText}>{item.name}</Text>
                  </View>
                </TactileButton>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySentence}>
              <Text style={styles.emptySentenceText}>
                Tap icons to build your sentence
              </Text>
            </View>
          )}
        </BlurView>
      </View>

      {/* Sentence Actions */}
      <View style={styles.sentenceActions}>
        <TactileButton onPress={clearSentence} disabled={sentence.length === 0}>
          <BlurView intensity={60} tint="light" style={styles.actionIconButton}>
            <MaterialCommunityIcons 
              name="delete-outline" 
              size={26} 
              color={sentence.length === 0 ? Colors.premium.textMuted : Colors.error} 
            />
          </BlurView>
        </TactileButton>
        
        <TactileButton onPress={speakSentence} disabled={sentence.length === 0} style={{ flex: 1, marginHorizontal: 16 }}>
          <LinearGradient
            colors={sentence.length === 0 
              ? ['#E5E5EA', '#E5E5EA'] 
              : speaking 
                ? [Colors.success, '#28A745'] 
                : [Colors.premium.actions, '#7B79E8']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.speakButton, sentence.length === 0 && styles.disabledButton]}
          >
            <MaterialCommunityIcons 
              name={speaking ? "volume-high" : "volume-medium"} 
              size={28} 
              color={sentence.length === 0 ? Colors.premium.textMuted : "#FFF"} 
            />
            <Text style={[styles.speakButtonText, sentence.length === 0 && { color: Colors.premium.textMuted }]}>
              {speaking ? "Speaking..." : "Speak"}
            </Text>
          </LinearGradient>
        </TactileButton>
        
        <TactileButton disabled={sentence.length === 0}>
          <BlurView intensity={60} tint="light" style={styles.actionIconButton}>
            <MaterialCommunityIcons 
              name="content-save-outline" 
              size={26} 
              color={sentence.length === 0 ? Colors.premium.textMuted : Colors.success} 
            />
          </BlurView>
        </TactileButton>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TactileButton
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.id);
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View
              style={[
                styles.categoryButton,
                selectedCategory === category.id && {
                  backgroundColor: getCategoryColor(category.id),
                  borderColor: getCategoryColor(category.id),
                }
              ]}
            >
              <MaterialCommunityIcons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? '#FFF' : getCategoryColor(category.id)} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#FFF' : Colors.premium.textDark },
                  selectedCategory === category.id && { fontWeight: '700' }
                ]}
              >
                {category.name}
              </Text>
            </View>
          </TactileButton>
        ))}
      </ScrollView>

      {/* Icons Grid */}
      <ScrollView style={styles.iconsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.iconsGrid}>
          {iconsData[selectedCategory].map((item) => (
            <View key={item.id} style={styles.iconButtonWrapper}>
              <TactileButton onPress={() => addToSentence(item)} scaleDown={0.92}>
                <View style={styles.iconKey}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F0F0F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.iconKeyInner}
                  >
                    <View 
                      style={[
                        styles.iconCircle,
                        { backgroundColor: getCategoryLightColor(selectedCategory) }
                      ]}
                    >
                      <MaterialCommunityIcons 
                        name={item.icon} 
                        size={38} 
                        color={getCategoryColor(selectedCategory)} 
                      />
                    </View>
                    <Text style={styles.iconText} numberOfLines={1}>{item.name}</Text>
                  </LinearGradient>
                </View>
              </TactileButton>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.premium.backgroundMain,
  },
  sentenceContainerWrapper: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.premium.shadowMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
  },
  sentenceContainer: {
    padding: 16,
    minHeight: 110,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  sentenceScrollContent: {
    paddingRight: 8,
    alignItems: 'center',
  },
  sentenceItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 16,
    width: 76,
    height: 76,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  sentenceItemText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    color: Colors.premium.textDark,
  },
  emptySentence: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySentenceText: {
    color: Colors.premium.textMuted,
    fontSize: 18,
    fontWeight: '500',
  },
  sentenceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionIconButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  speakButton: {
    flexDirection: 'row',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
    shadowColor: Colors.premium.actions,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  speakButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 8,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  iconsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 100,
  },
  iconButtonWrapper: {
    width: '33.33%',
    padding: 8,
  },
  iconKey: {
    backgroundColor: '#D1D1D6', // Shadow layer for the 3D effect
    borderRadius: 20,
    paddingBottom: 6, // Thickness of the "key"
    shadowColor: Colors.premium.shadowHeavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconKeyInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20, // Squircle shape
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.premium.textDark,
    letterSpacing: -0.3,
  },
});