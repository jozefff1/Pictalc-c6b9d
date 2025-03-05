import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.candy.blue,
        tabBarInactiveTintColor: Colors.candy.textMuted,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: Colors.candy.backgroundLight,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerRight: () => (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/auth/sign-in')}
            >
              <MaterialCommunityIcons
                name="login"
                size={28}
                color={Colors.candy.blue}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/auth/sign-up')}
            >
              <MaterialCommunityIcons
                name="account-plus"
                size={28}
                color={Colors.candy.blue}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="home" 
                size={focused ? 28 : 24} 
                color={color} 
              />
              {focused && <View style={[styles.indicator, { backgroundColor: Colors.candy.blue }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="communicate"
        options={{
          title: "Communicate",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="message-text" 
                size={focused ? 28 : 24} 
                color={color} 
              />
              {focused && <View style={[styles.indicator, { backgroundColor: Colors.candy.blue }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="account" 
                size={focused ? 28 : 24} 
                color={color} 
              />
              {focused && <View style={[styles.indicator, { backgroundColor: Colors.candy.blue }]} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 30,
  },
  indicator: {
    position: 'absolute',
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingTop: 8,
  },
  headerButton: {
    padding: 8,
    marginLeft: 12,
  },
});
