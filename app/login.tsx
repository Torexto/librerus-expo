import {useState} from 'react';
import {Button, Surface, Text, TextInput} from 'react-native-paper';
import {withCredentials} from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {KeyboardAvoidingView} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const loginHandler = async () => {
    withCredentials(login, pass)
      .then(async () => {
        await AsyncStorage.setItem("login", login);
        await AsyncStorage.setItem("pass", pass);

        router.replace("/(drawer)");
      })
      .catch(e => setError(e.message));
  }

  // @ts-ignore
    return (
    <KeyboardAvoidingView style={{height: "100%"}}>
      <Surface style={{flex: 1, justifyContent: "center", padding: 20, gap: 10}}>
        <TextInput
          label="Login"
          value={login}
          onChangeText={setLogin}
          autoFocus
          mode="outlined"
        />
        <TextInput
          label="Hasło"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          mode="outlined"
        />
        <Button mode="contained" onPress={loginHandler}>
          Zaloguj
        </Button>
        {error ? (
          <Text variant="titleLarge" style={{color: "red", marginTop: 5}}>
            {error}
          </Text>
        ) : null}
      </Surface>
    </KeyboardAvoidingView>
  );
}
