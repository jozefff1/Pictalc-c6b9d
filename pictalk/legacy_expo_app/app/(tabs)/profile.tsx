import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Pressable, 
  Switch,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Custom Tactile Button
const TactileButton = ({ onPress, children, style, disabled = false, scaleDown = 0.95 }: any) => {
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

// Mock user data
const userData = {
  name: "Alex Johnson",
  avatar: "https://randomuser.me/api/portraits/children/1.jpg",
  age: 8,
  streak: 7,
  totalSentences: 245,
  level: 5,
  xp: 340,
  nextLevelXp: 500,
  achievements: [
    { id: 1, name: "First Sentence", icon: "trophy", description: "Created your first sentence", completed: true },
    { id: 2, name: "Communication Star", icon: "star", description: "Used the app for 7 days in a row", completed: true },
    { id: 3, name: "Vocabulary Builder", icon: "book", description: "Used 50 different icons", completed: false, progress: 32 },
    { id: 4, name: "Sentence Master", icon: "certificate", description: "Created 100 sentences", completed: false, progress: 78 },
  ],
  recentPhrases: [
    "I want to eat",
    "I feel happy",
    "I want to play outside",
    "I need help"
  ]
};

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(true);

  const progressPercentage = (userData.xp / userData.nextLevelXp) * 100;

  const handleToggle = (setting: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch(setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'textToSpeech':
        setTextToSpeech(value);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.premium.backgroundMain, '#E2E2F0']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[Colors.premium.actions, '#8A88EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TactileButton>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: userData.avatar }} style={styles.avatar} />
                  <View style={styles.editAvatarButton}>
                    <MaterialCommunityIcons name="camera" size={14} color="#FFF" />
                  </View>
                </View>
              </TactileButton>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userAge}>Age: {userData.age}</Text>
                
                <View style={styles.levelContainer}>
                  <Text style={styles.levelText}>Level {userData.level}</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                  </View>
                  <Text style={styles.xpText}>{userData.xp}/{userData.nextLevelXp} XP</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCardWrapper}>
            <BlurView intensity={70} tint="light" style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: Colors.premium.feelingsLight }]}>
                <MaterialCommunityIcons name="fire" size={24} color={Colors.premium.streak} />
              </View>
              <Text style={styles.statValue}>{userData.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </BlurView>
          </View>
          
          <View style={styles.statCardWrapper}>
            <BlurView intensity={70} tint="light" style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: Colors.premium.actionsLight }]}>
                <MaterialCommunityIcons name="message-text" size={24} color={Colors.premium.actions} />
              </View>
              <Text style={styles.statValue}>{userData.totalSentences}</Text>
              <Text style={styles.statLabel}>Sentences</Text>
            </BlurView>
          </View>
        </View>
        
        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TactileButton>
              <Text style={styles.seeAllText}>See All</Text>
            </TactileButton>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsContainer}
          >
            {userData.achievements.map((achievement) => (
              <TactileButton key={achievement.id} style={{ marginRight: 16 }}>
                <BlurView intensity={70} tint="light" style={styles.achievementCard}>
                  <View style={[
                    styles.achievementIconContainer,
                    achievement.completed ? styles.achievementCompleted : styles.achievementIncomplete
                  ]}>
                    <MaterialCommunityIcons 
                      name={achievement.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                      size={28} 
                      color={achievement.completed ? Colors.premium.gold : "#FFF"} 
                    />
                  </View>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription} numberOfLines={2}>{achievement.description}</Text>
                  
                  {!achievement.completed && achievement.progress !== undefined && (
                    <View style={styles.achievementProgressContainer}>
                      <View style={styles.achievementProgressBg}>
                        <View 
                          style={[
                            styles.achievementProgress, 
                            { width: `${(achievement.progress / 100) * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.achievementProgressText}>{achievement.progress}%</Text>
                    </View>
                  )}
                </BlurView>
              </TactileButton>
            ))}
          </ScrollView>
        </View>
        
        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsContainer}>
            <BlurView intensity={70} tint="light" style={styles.settingsInner}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconBg, { backgroundColor: Colors.premium.actionsLight }]}>
                    <MaterialCommunityIcons name="bell" size={20} color={Colors.premium.actions} />
                  </View>
                  <Text style={styles.settingText}>Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={(value) => handleToggle('notifications', value)}
                  trackColor={{ false: '#D1D1D6', true: Colors.premium.actions }}
                  thumbColor="#FFF"
                  ios_backgroundColor="#D1D1D6"
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconBg, { backgroundColor: Colors.premium.peopleLight }]}>
                    <MaterialCommunityIcons name="theme-light-dark" size={20} color={Colors.premium.people} />
                  </View>
                  <Text style={styles.settingText}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={(value) => handleToggle('darkMode', value)}
                  trackColor={{ false: '#D1D1D6', true: Colors.premium.people }}
                  thumbColor="#FFF"
                  ios_backgroundColor="#D1D1D6"
                />
              </View>
              
              <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIconBg, { backgroundColor: Colors.premium.placesLight }]}>
                    <MaterialCommunityIcons name="volume-high" size={20} color={Colors.premium.places} />
                  </View>
                  <Text style={styles.settingText}>Text to Speech</Text>
                </View>
                <Switch
                  value={textToSpeech}
                  onValueChange={(value) => handleToggle('textToSpeech', value)}
                  trackColor={{ false: '#D1D1D6', true: Colors.premium.places }}
                  thumbColor="#FFF"
                  ios_backgroundColor="#D1D1D6"
                />
              </View>
            </BlurView>
          </View>
        </View>
        
        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.settingsContainer}>
            <BlurView intensity={70} tint="light" style={styles.settingsInner}>
              <TactileButton>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <View style={[styles.settingIconBg, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                      <MaterialCommunityIcons name="help-circle" size={20} color={Colors.premium.textMuted} />
                    </View>
                    <Text style={styles.settingText}>Help Center</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.premium.textMuted} />
                </View>
              </TactileButton>
              <TactileButton>
                <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                  <View style={styles.settingInfo}>
                    <View style={[styles.settingIconBg, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                      <MaterialCommunityIcons name="information" size={20} color={Colors.premium.textMuted} />
                    </View>
                    <Text style={styles.settingText}>About Pictalk</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.premium.textMuted} />
                </View>
              </TactileButton>
            </BlurView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.premium.backgroundMain,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 60,
    marginBottom: 24,
  },
  headerGradient: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: Colors.premium.actions,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.premium.actions,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  userAge: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  levelContainer: {
    marginTop: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.premium.gold,
    borderRadius: 3,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCardWrapper: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  statCard: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.premium.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.premium.textMuted,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.premium.textDark,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    color: Colors.premium.actions,
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingRight: 24,
  },
  achievementCard: {
    borderRadius: 20,
    padding: 16,
    width: 150,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
  },
  achievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  achievementCompleted: {
    backgroundColor: Colors.premium.backgroundMain,
    borderWidth: 2,
    borderColor: Colors.premium.gold,
  },
  achievementIncomplete: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.premium.textDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.premium.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementProgressContainer: {
    marginTop: 12,
  },
  achievementProgressBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementProgress: {
    height: '100%',
    backgroundColor: Colors.premium.actions,
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.premium.textMuted,
    textAlign: 'right',
  },
  settingsContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  settingsInner: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.premium.textDark,
    marginLeft: 12,
  },
});