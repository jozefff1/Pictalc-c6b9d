import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}