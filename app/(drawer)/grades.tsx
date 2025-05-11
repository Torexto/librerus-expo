import {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {Button, List, Surface, Text} from "react-native-paper";
import {NewGrade, NewSubject, useLibrus} from "@/hooks/useLibrus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";

export default function GradesScreen() {
  const {data, refresh} = useLibrus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("login");
    await AsyncStorage.removeItem("pass");

    router.replace("/login");
  }

  if (loading || !data) return <Text>Loading...</Text>;

  return (
    <Surface style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <Button onPress={logoutHandler}>Logout</Button>
        {Object.values(data?.subjects).map((subject) => (
          <SubjectComponent key={subject.Id} subject={subject}/>
        ))}
      </ScrollView>
    </Surface>
  );
}

function SubjectComponent({subject}: { subject: NewSubject }) {
  return (
    <View style={{borderBottomWidth: 1, borderColor: "#444"}}>
      <List.Accordion title={subject.Name}>
        <List.Accordion title="Semestr 1">
          {subject?.grades.map((grade) => (
            grade.Semester === 1 ? <GradeComponent key={grade.Id} grade={grade}/> : null
          ))}
        </List.Accordion>
        <List.Accordion title="Semestr 2">
          {subject?.grades.map((grade) => (
            grade.Semester === 2 ? <GradeComponent key={grade.Id} grade={grade}/> : null
          ))}
        </List.Accordion>
      </List.Accordion>
    </View>
  )
}

function GradeComponent({grade}: { grade: NewGrade }) {
  return (
    <View style={{display: "flex", flexDirection: "row", gap: 10}}>
      {grade.IsSemesterProposition ? <Text>Proponowana na semestr: </Text> : null}
      {grade.IsSemester ? <Text>Semestralna: </Text> : null}
      {grade.IsFinalProposition ? <Text>Proponowana końcowa: </Text> : null}
      {grade.IsFinal ? <Text>Końcowa: </Text> : null}
      <Text>{grade.Grade}</Text>
      <Text>{grade.Comment?.Text ?? ""}</Text>
    </View>
  )
}