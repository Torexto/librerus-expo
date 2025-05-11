import {Drawer, Text, useTheme} from "react-native-paper";
import {usePathname, useRouter} from "expo-router";

export default function DrawerContent() {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <Drawer.Section style={{backgroundColor: theme.colors.background, flex: 1, marginBottom: 0}}>
      <Text variant="displaySmall" style={{textAlign: "center"}}>Librerus</Text>
      <Drawer.Item label="Strona główna" active={pathname === "/"} onPress={() => router.replace("/(drawer)")}/>
      <Drawer.Item label="Oceny" active={pathname === "/grades"} onPress={() => router.replace("/(drawer)/grades")}/>
    </Drawer.Section>
  );
}