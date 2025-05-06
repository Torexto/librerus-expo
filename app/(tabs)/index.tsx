import {useEffect, useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {GradeWithComment, SubjectWithGrades, useLibrus} from "@/hooks/useLibrus";

export default function HomeScreen() {
  const {data, refresh} = useLibrus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh().then(() => {setLoading(false); console.log(data)});
  }, []);

  if (loading || !data) return <Text style={{color: "white"}}>Loading...</Text>;

  return (
    <ScrollView style={{flex: 1}}>
      {Object.values(data?.subjects).map((subjectWithGrades) => (
        <SubjectComponent key={subjectWithGrades.subject.Id} subjectWithGrades={subjectWithGrades}/>
      ))}
    </ScrollView>
  );
}

function SubjectComponent({subjectWithGrades}: { subjectWithGrades: SubjectWithGrades }) {
  return (
    <View style={{borderWidth: 1, borderColor: "gray"}}>
      <Text style={{color: "white"}}>{subjectWithGrades.subject.Name}</Text>
      {subjectWithGrades?.grades.map((gradeWithComment) => (
        <GradeComponent key={gradeWithComment.grade.Id} gradeWithComment={gradeWithComment}/>
      ))}
    </View>
  )
}

function GradeComponent({gradeWithComment}: { gradeWithComment: GradeWithComment }) {
  return (
    <>
      <Text style={{color: "white"}}>{gradeWithComment.grade.Grade}</Text>
      <Text style={{color: "white"}}>{gradeWithComment.comment?.Text ?? ""}</Text>
    </>
  )
}