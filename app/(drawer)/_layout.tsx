import {LibrusProvider} from "@/hooks/useLibrus";
import {Drawer} from "expo-router/drawer";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from "react-native-paper";
import DrawerContent from "@/components/DrawerContent";

export default function Layout() {
  const theme = useTheme();

  return (
    <LibrusProvider>
      <GestureHandlerRootView>
        <Drawer drawerContent={DrawerContent} screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.inverseSurface,
        }}>
          <Drawer.Screen name="index" options={{
            title: "Strona główna"
          }}/>
          <Drawer.Screen name="grades" options={{
            title: "Oceny",
          }}/>
        </Drawer>
      </GestureHandlerRootView>
    </LibrusProvider>
  );
}
