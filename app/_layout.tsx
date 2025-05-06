import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      const login = await AsyncStorage.getItem("login");
      const pass = await AsyncStorage.getItem("pass");
      if (!login || !pass) {
        router.replace("/login");
        return;
      }

      router.replace("/(tabs)");
    })();
  }, [])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found"/>
        <Stack.Screen name="login" options={{headerShown: false}}/>
      </Stack>
      <StatusBar style="auto"/>
    </ThemeProvider>
  );
}
