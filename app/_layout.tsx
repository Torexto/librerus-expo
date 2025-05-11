import {Stack, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-gesture-handler';

import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import {useColorScheme} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    (async () => {
      const login = await AsyncStorage.getItem("login");
      const pass = await AsyncStorage.getItem("pass");
      if (!login || !pass) {
        router.replace("/login");
        return;
      }

      router.replace("/(drawer)");
    })();
  }, [])

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(drawer)"/>
          <Stack.Screen name="+not-found"/>
          <Stack.Screen name="login"/>
        </Stack>
      </SafeAreaView>
      <StatusBar style="auto" translucent/>
    </PaperProvider>
  );
}
