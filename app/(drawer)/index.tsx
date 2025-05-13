import {Button, Surface, Text} from "react-native-paper";
import {useLibrus} from "@/hooks/useLibrus";

export default function HomeScreen() {
  const {data, refresh} = useLibrus();

  return <Surface style={{flex: 1}}>
    <Button onPress={refresh}>Refresh</Button>
    <Text>{data.luckyNumber?.LuckyNumber} {data.luckyNumber?.LuckyNumberDay}</Text>
    <Text>{data.userInfo?.User?.FirstName} {data.userInfo?.User?.LastName}</Text>
  </Surface>
}