import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {!user ? (
        // Not logged in - Show auth options
        <View style={styles.authContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Pictalk</Text>
            <Text style={styles.subtitle}>
              Connect, communicate, and share with your loved ones
            </Text>
          </View>

          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/auth/sign-in')}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/auth/sign-up')}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Logged in - Show dashboard
        <>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.title}>Alex!</Text>
            <Text style={styles.subtitle}>Let's start communicating!</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Pressable style={styles.statCard}>
              <LinearGradient
                colors={[Colors.candy.orange, Colors.candy.red]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakIconBg}
              >
                <MaterialCommunityIcons name="fire" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Pressable>
            
            <Pressable style={styles.statCard}>
              <LinearGradient
                colors={[Colors.candy.blue, Colors.candy.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakIconBg}
              >
                <MaterialCommunityIcons name="message-text" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Sentences Today</Text>
            </Pressable>
          </View>

          <View style={styles.dailyGoals}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <View style={styles.goalCard}>
              <View style={styles.goalInfo}>
                <View style={[styles.iconBg, { backgroundColor: Colors.candy.greenLight }]}>
                  <MaterialCommunityIcons name="message-plus" size={24} color={Colors.candy.green} />
                </View>
                <Text style={styles.goalText}>Create 5 sentences</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressBar, { width: '80%', backgroundColor: Colors.candy.green }]} />
                </View>
                <Text style={styles.progressText}>4/5</Text>
              </View>
            </View>
            
            <View style={styles.goalCard}>
              <View style={styles.goalInfo}>
                <View style={[styles.iconBg, { backgroundColor: Colors.candy.purpleLight }]}>
                  <MaterialCommunityIcons name="book-open-variant" size={24} color={Colors.candy.purple} />
                </View>
                <Text style={styles.goalText}>Learn 3 new icons</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressBar, { width: '33%', backgroundColor: Colors.candy.purple }]} />
                </View>
                <Text style={styles.progressText}>1/3</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <Link href="/communicate" asChild>
                <Pressable style={styles.actionCard}>
                  <LinearGradient
                    colors={[Colors.candy.blue, Colors.candy.teal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionIconBg}
                  >
                    <MaterialCommunityIcons name="message-text-outline" size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.actionText}>New Sentence</Text>
                </Pressable>
              </Link>
              
              <Pressable style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.candy.purple, Colors.candy.pink]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionIconBg}
                >
                  <MaterialCommunityIcons name="history" size={28} color="#FFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Recent Phrases</Text>
              </Pressable>
              
              <Pressable style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.candy.green, Colors.candy.mint]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionIconBg}
                >
                  <MaterialCommunityIcons name="star-outline" size={28} color="#FFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Favorites</Text>
              </Pressable>
              
              <Pressable style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.candy.orange, Colors.candy.orange]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionIconBg}
                >
                  <MaterialCommunityIcons name="school" size={28} color="#FFF" />
                </LinearGradient>
                <Text style={styles.actionText}>Learn Icons</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.candy.blue,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  authButtons: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: Colors.candy.blue,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.candy.blue,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: Colors.candy.blue,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.candy.textMuted,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 25,
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
  streakIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.candy.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.candy.textMuted,
  },
  dailyGoals: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.candy.textDark,
    marginBottom: 15,
  },
  goalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.candy.textDark,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.candy.textMuted,
    width: 35,
    textAlign: 'right',
  },
  quickActions: {
    paddingHorizontal: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  actionCard: {
    width: '50%',
    padding: 5,
  },
  actionIconBg: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.candy.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.candy.textDark,
    textAlign: 'center',
  },
});