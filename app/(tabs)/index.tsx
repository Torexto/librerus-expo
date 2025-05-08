import {useEffect, useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {NewGrade, NewSubject, useLibrus} from "@/hooks/useLibrus";
import {Grade} from "@/api";

export default function HomeScreen() {
  const {data, refresh} = useLibrus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh().then(() => {setLoading(false); console.log(data)});
  }, []);

  if (loading || !data) return <Text style={{color: "white"}}>Loading...</Text>;

  return (
    <ScrollView style={{flex: 1}}>
      {Object.values(data?.subjects).map((subject) => (
        <SubjectComponent key={subject.Id} subject={subject}/>
      ))}
    </ScrollView>
  );
}

function SubjectComponent({subject}: { subject: NewSubject }) {
  return (
    <View style={{borderWidth: 1, borderColor: "gray"}}>
      <Text style={{color: "white"}}>{subject.Name}</Text>
      {subject?.grades.map((grade) => (
        <GradeComponent key={grade.Id} grade={grade}/>
      ))}
    </View>
  )
}

function GradeComponent({grade}: { grade: NewGrade }) {
  return (
    <>
      <Text style={{color: "white"}}>{grade.Grade}</Text>
      <Text style={{color: "white"}}>{grade.Comment?.Text ?? ""}</Text>
    </>
  )
}