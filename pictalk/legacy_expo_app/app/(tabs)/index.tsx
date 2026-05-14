import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

// Custom Tactile Button
const TactileButton = ({ onPress, children, style, disabled = false }: any) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.95,
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
        style={{ flex: 1 }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.premium.backgroundMain, '#E2E2F0', '#F4F4F9']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {!user ? (
          <View style={styles.authContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Pictalk</Text>
              <Text style={styles.subtitle}>
                Connect, communicate, and share with your loved ones
              </Text>
            </View>

            <View style={styles.authButtons}>
              <TactileButton onPress={() => router.push('/auth/sign-in')}>
                <LinearGradient
                  colors={[Colors.premium.actions, '#7B79E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryButton}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TactileButton>

              <TactileButton onPress={() => router.push('/auth/sign-up')} style={styles.secondaryButtonWrapper}>
                <BlurView intensity={60} tint="light" style={styles.secondaryButton}>
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
                </BlurView>
              </TactileButton>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.dashboardHeader}>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.title}>Alex!</Text>
              </View>
              <View style={styles.headerAvatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={28} color={Colors.premium.actions} />
              </View>
            </View>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <TactileButton style={styles.statCardWrapper}>
                <BlurView intensity={70} tint="light" style={styles.statCard}>
                  <View style={[styles.iconBg, { backgroundColor: Colors.premium.feelingsLight }]}>
                    <MaterialCommunityIcons name="fire" size={24} color={Colors.premium.streak} />
                  </View>
                  <View>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                  </View>
                </BlurView>
              </TactileButton>
              
              <TactileButton style={styles.statCardWrapper}>
                <BlurView intensity={70} tint="light" style={styles.statCard}>
                  <View style={[styles.iconBg, { backgroundColor: Colors.premium.actionsLight }]}>
                    <MaterialCommunityIcons name="message-text" size={24} color={Colors.premium.actions} />
                  </View>
                  <View>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Sentences Today</Text>
                  </View>
                </BlurView>
              </TactileButton>
            </View>

            {/* Daily Goals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Goals</Text>
              
              <TactileButton>
                <BlurView intensity={80} tint="light" style={styles.goalCard}>
                  <View style={styles.goalInfo}>
                    <View style={[styles.goalIconBg, { backgroundColor: Colors.premium.placesLight }]}>
                      <MaterialCommunityIcons name="message-plus" size={24} color={Colors.premium.places} />
                    </View>
                    <Text style={styles.goalText}>Create 5 sentences</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                      <LinearGradient
                        colors={[Colors.premium.places, '#4FE866']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBar, { width: '80%' }]}
                      />
                    </View>
                    <Text style={styles.progressText}>4/5</Text>
                  </View>
                </BlurView>
              </TactileButton>
              
              <TactileButton>
                <BlurView intensity={80} tint="light" style={[styles.goalCard, { marginTop: 12 }]}>
                  <View style={styles.goalInfo}>
                    <View style={[styles.goalIconBg, { backgroundColor: Colors.premium.peopleLight }]}>
                      <MaterialCommunityIcons name="book-open-variant" size={24} color={Colors.premium.people} />
                    </View>
                    <Text style={styles.goalText}>Learn 3 new icons</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                      <LinearGradient
                        colors={[Colors.premium.people, '#D48DF2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBar, { width: '33%' }]}
                      />
                    </View>
                    <Text style={styles.progressText}>1/3</Text>
                  </View>
                </BlurView>
              </TactileButton>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <Link href="/communicate" asChild>
                  <Pressable style={styles.actionCardWrapper}>
                    <TactileButton>
                      <BlurView intensity={70} tint="light" style={styles.actionCard}>
                        <LinearGradient
                          colors={[Colors.premium.actions, '#7B79E8']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.actionIconBg}
                        >
                          <MaterialCommunityIcons name="message-text-outline" size={28} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.actionText}>New Sentence</Text>
                      </BlurView>
                    </TactileButton>
                  </Pressable>
                </Link>
                
                <View style={styles.actionCardWrapper}>
                  <TactileButton>
                    <BlurView intensity={70} tint="light" style={styles.actionCard}>
                      <LinearGradient
                        colors={[Colors.premium.feelings, '#FF6B8B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionIconBg}
                      >
                        <MaterialCommunityIcons name="history" size={28} color="#FFF" />
                      </LinearGradient>
                      <Text style={styles.actionText}>Recent</Text>
                    </BlurView>
                  </TactileButton>
                </View>
                
                <View style={styles.actionCardWrapper}>
                  <TactileButton>
                    <BlurView intensity={70} tint="light" style={styles.actionCard}>
                      <LinearGradient
                        colors={[Colors.premium.places, '#4FE866']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionIconBg}
                      >
                        <MaterialCommunityIcons name="star-outline" size={28} color="#FFF" />
                      </LinearGradient>
                      <Text style={styles.actionText}>Favorites</Text>
                    </BlurView>
                  </TactileButton>
                </View>
                
                <View style={styles.actionCardWrapper}>
                  <TactileButton>
                    <BlurView intensity={70} tint="light" style={styles.actionCard}>
                      <LinearGradient
                        colors={[Colors.premium.needs, '#FFB74D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionIconBg}
                      >
                        <MaterialCommunityIcons name="school" size={28} color="#FFF" />
                      </LinearGradient>
                      <Text style={styles.actionText}>Learn</Text>
                    </BlurView>
                  </TactileButton>
                </View>
              </View>
            </View>
          </>
        )}
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    minHeight: Dimensions.get('window').height * 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.premium.actions,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.premium.textMuted,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  authButtons: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.premium.actions,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
  },
  secondaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryButtonText: {
    color: Colors.premium.actions,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.premium.textMuted,
    marginBottom: 4,
  },
  headerAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
    shadowColor: Colors.premium.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
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
  },
  statCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.premium.textDark,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.premium.textMuted,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.premium.textDark,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  goalCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.premium.textDark,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.premium.textMuted,
    width: 40,
    textAlign: 'right',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionCardWrapper: {
    width: '50%',
    padding: 8,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: Colors.premium.glassBorder,
  },
  actionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.premium.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.premium.textDark,
    textAlign: 'center',
  },
});