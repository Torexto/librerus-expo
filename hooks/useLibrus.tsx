import {createContext, ReactNode, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LibrusApi, {Grade, GradeComment, Subject, withCredentials} from "@/api";

export type GradeWithComment = {
  grade: Grade,
  comment: GradeComment | null
}

export type SubjectWithGrades = {
  grades: GradeWithComment[];
  subject: Subject;
}

export type Subjects = Record<string, SubjectWithGrades>;

export type LibrusData = {
  subjects: Subjects;
}

export type LibrusContextType = {
  data: LibrusData | undefined;
  refresh: () => Promise<void>;
}

const LibrusContext = createContext<LibrusContextType | undefined>(undefined);

export const LibrusProvider = ({children}: { children: ReactNode }) => {
  const [data, setData] = useState<LibrusData>();

  const refresh = async () => {
    const login = await AsyncStorage.getItem("login");
    const pass = await AsyncStorage.getItem("pass");

    if (!login || !pass) return;

    withCredentials(login, pass)
      .then(fetchData)
      .catch(console.error);
  }

  const fetchData = async (api: LibrusApi) => {
    const promisesHandler = [];

    promisesHandler.push(fetchGrades(api));

    await Promise.all(promisesHandler);
  }

  const fetchGrades = async (api: LibrusApi) => {
    api
      .getGrades()
      .then(async (grades) => {
          const gradesGroup = grades.reduce((groups, grade) => {
            const subjectId = grade.Subject.Id;
            if (!groups[subjectId]) {
              groups[subjectId] = [];
            }
            groups[subjectId].push(grade);
            return groups;
          }, {} as Record<number, Grade[]>);

          const subjects: Subjects = {};

          const subjectsHandler = [];

          for (const subjectId of Object.keys(gradesGroup)) {
            const promise = api.getSubjectInfo(subjectId)
              .then((subject) => {
                  subjects[subjectId] = {
                    grades: gradesGroup[parseInt(subjectId)].map(grade => {
                      return {grade, comment: null}
                    }),
                    subject: subject!,
                  };
                }
              )
            ;
            subjectsHandler.push(promise);
          }

          await Promise.all(subjectsHandler);

          const gradesHandler = [];

          for (const {grades} of Object.values(subjects)) {
            for (const gradeWithComment of grades) {
              const commentId = gradeWithComment.grade.Comments?.at(0)?.Id;
              if (!commentId) continue;
              const promise = api.getGradeComment(commentId).then(comment => {
                gradeWithComment.comment = comment
              });
              gradesHandler.push(promise);
            }
          }

          await Promise.all(gradesHandler);

          setData((prev) => ({...prev, subjects}))
        }
      )
      .catch(console.error);
  }

  return (
    <LibrusContext.Provider value={{data, refresh}}>
      {children}
    </LibrusContext.Provider>
  );
}

export const useLibrus = () => {
  const context = useContext(LibrusContext);
  if (!context) throw new Error('useLibrus must be used within a LibrusProvider');
  return context;
}
