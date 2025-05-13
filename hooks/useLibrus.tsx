import LibrusApi, {Grade, GradeComment, LuckyNumber, Subject, UserInfo, withCredentials} from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createContext, ReactNode, useContext, useState} from "react";

export type Subjects = Record<string, NewSubject>;

export type NewSubject = Subject & { grades: NewGrade[] };
export type NewGrade = Grade & { Comment: GradeComment | null };

export type LibrusData = {
  subjects?: Subjects;
  luckyNumber?: LuckyNumber;
  userInfo?: UserInfo;
}

export type LibrusContextType = {
  data: LibrusData;
  refresh: () => Promise<void>;
}

const LibrusContext = createContext<LibrusContextType | undefined>(undefined);

export const LibrusProvider = ({children}: { children?: ReactNode }) => {
  const [data, setData] = useState<LibrusData>({});

  const refresh = async () => {
    const login = await AsyncStorage.getItem("login");
    const pass = await AsyncStorage.getItem("pass");

    if (!login || !pass) return;

    withCredentials(login, pass)
      .then(fetchData)
      .catch((error) => {
        console.error(error)
        throw error;
      });
  }

  const fetchData = async (api: LibrusApi) => {
    const promisesHandler = [];

    promisesHandler.push(fetchGrades(api));
    promisesHandler.push(fetchLuckyNumber(api));
    promisesHandler.push(fetchUserInfo(api));

    await Promise.all(promisesHandler);
  }

  const fetchUserInfo = async (api: LibrusApi) => {
    const userInfo = await api.getUserInfo();
    console.log(userInfo);
    setData((prev) => ({...prev, userInfo}));
  }

  const fetchLuckyNumber = async (api: LibrusApi) => {
    const luckyNumber = await api.getLuckyNumber();
    console.log(luckyNumber);
    setData((prev) => ({...prev, luckyNumber}));
  }
  const fetchGrades = async (api: LibrusApi) => {
    api
      .getGrades()
      .then(async (grades) => {
          // Group by subject
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

          // Get subject info
          for (const subjectId of Object.keys(gradesGroup)) {
            const promise = api
              .getSubjectInfo(subjectId)
              .then((subjectInfo) => {
                const grades = gradesGroup[parseInt(subjectId)];
                subjects[subjectId] = {
                  ...subjectInfo!,
                  grades: grades.map(grade => ({...grade, Comment: null}))
                }
              });

            subjectsHandler.push(promise);
          }

          await Promise.all(subjectsHandler);

          const gradesHandler = [];

          // Get grade comment
          for (const {grades} of Object.values(subjects)) {
            for (const grade of grades) {
              const commentId = grade.Comments?.at(0)?.Id;
              if (!commentId) continue;
              const promise = api.getGradeComment(commentId).then(comment => {
                grade.Comment = comment
              });
              gradesHandler.push(promise);
            }
          }

          const groupedGrades = [];

          // for (const {grades} of Object.values(subjects)) {
          //   const subjectGroupedGrades = {}
          //   for (const gradeWithComment of grades) {
          //     const grade = {
          //       ...gradeWithComment.grade,
          //       Comment: gradeWithComment.comment
          //     };
          //   }
          // }

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
