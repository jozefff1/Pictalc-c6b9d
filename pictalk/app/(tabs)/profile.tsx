import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Pressable, 
  Switch,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';

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
  const [voiceSpeed, setVoiceSpeed] = useState(1);

  const progressPercentage = (userData.xp / userData.nextLevelXp) * 100;
  const { width } = Dimensions.get('window');

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  const handleToggle = (setting: string, value: boolean) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <LinearGradient
        colors={[Colors.candy.blue, Colors.candy.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.editAvatarButton}>
              <MaterialCommunityIcons name="pencil" size={16} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userAge}>Age: {userData.age}</Text>
            
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Level {userData.level}</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[styles.progressBar, { width: `${progressPercentage}%` }]} 
                />
              </View>
              <Text style={styles.xpText}>{userData.xp}/{userData.nextLevelXp} XP</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="fire" size={24} color={Colors.candy.streakFire} />
          <Text style={styles.statValue}>{userData.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="message-text-outline" size={24} color={Colors.candy.blue} />
          <Text style={styles.statValue}>{userData.totalSentences}</Text>
          <Text style={styles.statLabel}>Total Sentences</Text>
        </View>
      </View>
      
      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
        >
          {userData.achievements.map((achievement) => (
            <Pressable key={achievement.id} style={styles.achievementCard}>
              <View style={[
                styles.achievementIconContainer,
                achievement.completed ? styles.achievementCompleted : styles.achievementIncomplete
              ]}>
                <MaterialCommunityIcons 
                  name={achievement.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                  size={28} 
                  color={achievement.completed ? Colors.candy.goldStar : "#FFF"} 
                />
              </View>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              
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
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      {/* Recent Phrases */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Phrases</Text>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        
        <View style={styles.phrasesContainer}>
          {userData.recentPhrases.map((phrase, index) => (
            <Pressable key={index} style={styles.phraseCard}>
              <MaterialCommunityIcons name="message-text" size={20} color={Colors.candy.blue} />
              <Text style={styles.phraseText}>{phrase}</Text>
              <MaterialCommunityIcons name="volume-medium" size={20} color={Colors.candy.textMuted} />
            </Pressable>
          ))}
        </View>
      </View>
      
      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="bell" size={24} color={Colors.candy.blue} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => handleToggle('notifications', value)}
              trackColor={{ false: '#E0E0E0', true: Colors.candy.blueLight }}
              thumbColor={notifications ? Colors.candy.blue : '#FFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="theme-light-dark" size={24} color={Colors.candy.purple} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => handleToggle('darkMode', value)}
              trackColor={{ false: '#E0E0E0', true: Colors.candy.purpleLight }}
              thumbColor={darkMode ? Colors.candy.purple : '#FFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="volume-high" size={24} color={Colors.candy.green} />
              <Text style={styles.settingText}>Text to Speech</Text>
            </View>
            <Switch
              value={textToSpeech}
              onValueChange={(value) => handleToggle('textToSpeech', value)}
              trackColor={{ false: '#E0E0E0', true: Colors.candy.greenLight }}
              thumbColor={textToSpeech ? Colors.candy.green : '#FFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>
      </View>
      
      {/* Help & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        
        <View style={styles.supportContainer}>
          <Pressable style={styles.supportButton}>
            <MaterialCommunityIcons name="help-circle" size={24} color={Colors.candy.blue} />
            <Text style={styles.supportButtonText}>Help Center</Text>
          </Pressable>
          
          <Pressable style={styles.supportButton}>
            <MaterialCommunityIcons name="email" size={24} color={Colors.candy.purple} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </Pressable>
          
          <Pressable style={styles.supportButton}>
            <MaterialCommunityIcons name="information" size={24} color={Colors.candy.orange} />
            <Text style={styles.supportButtonText}>About Pictalk</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.candy.backgroundLight,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 40,
    marginBottom: -20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.candy.blue,
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 12,
  },
  levelContainer: {
    marginTop: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.candy.orange,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.candy.textDark,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.candy.textMuted,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.candy.textDark,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.candy.blue,
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  achievementCompleted: {
    backgroundColor: Colors.candy.orange,
  },
  achievementIncomplete: {
    backgroundColor: Colors.candy.blueLight,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.candy.textDark,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.candy.textMuted,
    marginBottom: 8,
  },
  achievementProgressContainer: {
    marginTop: 8,
  },
  achievementProgressBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementProgress: {
    height: '100%',
    backgroundColor: Colors.candy.blue,
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 12,
    color: Colors.candy.textMuted,
    textAlign: 'right',
  },
  phrasesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  phraseText: {
    flex: 1,
    fontSize: 16,
    color: Colors.candy.textDark,
    marginHorizontal: 12,
  },
  settingsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: Colors.candy.textDark,
    marginLeft: 12,
  },
  supportContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  supportButtonText: {
    fontSize: 16,
    color: Colors.candy.textDark,
    marginLeft: 12,
  },
});