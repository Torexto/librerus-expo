import {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import {withCredentials} from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ThemedText} from "@/components/ThemedText";
import {useRouter} from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    withCredentials(login, pass)
      .then(async () => {
        await AsyncStorage.setItem("login", login);
        await AsyncStorage.setItem("pass", pass);

        router.replace("/(tabs)");
      })
      .catch(e => setError(e.message));
  }

  return (
    <View style={{padding: 20, height: "100%", justifyContent: "center"}}>
      <TextInput
        placeholder="Login"
        placeholderTextColor="white"
        value={login}
        onChangeText={setLogin}
        style={{borderWidth: 1, padding: 10, borderColor: 'gray', color: 'white'}}
        autoFocus
      />
      <TextInput
        placeholder="Hasło"
        placeholderTextColor="white"
        value={pass}
        onChangeText={setPass}
        style={{borderWidth: 1, padding: 10, borderColor: 'gray', color: 'white'}}
        secureTextEntry={true}
      />
      <Button title="Zaloguj" onPress={handleLogin}/>
      <ThemedText>{error}</ThemedText>
    </View>
  );
}