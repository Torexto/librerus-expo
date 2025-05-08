import axios, {AxiosError, AxiosInstance} from "axios";

type Grade = {
  Id: number;
  Lesson: {
    Id: number;
    Url: string;
  };
  Subject: {
    Id: number;
    Url: string;
  };
  Student: {
    Id: number;
    Url: string;
  };
  Category: {
    Id: number;
    Url: string;
  };
  AddedBy: {
    Id: number;
    Url: string;
  };
  Grade: string;
  Date: string;
  AddDate: string;
  Semester: number;
  IsConstituent: boolean;
  IsSemester: boolean;
  IsSemesterProposition: boolean;
  IsFinal: boolean;
  IsFinalProposition: boolean;
  Comments: {
    Id: number;
    Url: string;
  }[];
}

export type Subject = {
  Id: number;
  IsBlockLesson: boolean;
  IsExtracurricular: boolean;
  Name: string;
  No: number;
  Short: string;
};

export type GradeComment = {
  Id: number;
  AddedBy: {
    Id: number;
    Url: string;
  };
  Grade: {
    Id: number;
    Url: string;
  };
  Text: string;
};


class LibrusApi {
  private axios: AxiosInstance;

  constructor(axiosInstance?: AxiosInstance) {
    this.axios = axiosInstance ?? axios.create({
      withCredentials: true,
      headers: {
        "User-Agent": "User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36"
      }
    })
  }

  public async authorize(login: string, pass: string) {
    const data = {
      action: "login", login, pass,
    }

    try {
      await this.axios.get("https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata");
      await this.axios.postForm("https://api.librus.pl/OAuth/Authorization?client_id=46", data);
      await this.axios.get("https://api.librus.pl/OAuth/Authorization/2FA?client_id=46");
    } catch (e) {
      if (e instanceof AxiosError) {
        const message: string = e?.response?.data?.errors?.[0]?.message || 'Unknown error';
        throw new Error(message);
      }
    }

    return this;
  }

  public static async withCredentials(login: string, pass: string) {
    return new LibrusApi().authorize(login, pass);
  }

  public async getLuckyNumber() {
    return this.axios
      .get("https://synergia.librus.pl/gateway/api/2.0/LuckyNumbers")
      .then(res => res.data["LuckyNumber"])
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get lucky number: ${e?.response?.data}`);
      });
  }

  public async getUserInfo() {
    return this.axios
      .get("https://synergia.librus.pl/gateway/api/2.0/Me")
      .then(res => res.data["Me"])
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get user info: ${e?.response?.data}`);
      });
  }

  public async getClassInfo(id: number) {
    return this.axios
      .get(`https://synergia.librus.pl/gateway/api/2.0/Classes/${id}`)
      .then(res => res.data["Class"])
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get class info: ${e?.response?.data}`);
      });
  }

  public async getSchoolInfo() {
    return this.axios
      .get("https://synergia.librus.pl/gateway/api/2.0/Schools")
      .then(res => res.data["School"])
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get school info: ${e?.response?.data}`);
      });
  }

  public async getSchoolYear() {
    return this.axios
      .get("https://synergia.librus.pl/gateway/api/2.0/Auth/SchoolInfo")
      .then(res => res.data["SchoolYear"])
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get school year: ${e?.response?.data}`);
      });
  }

  public async getGrades(): Promise<Grade[]> {
    return this.axios
      .get("https://synergia.librus.pl/gateway/api/2.0/Grades")
      .then(res => (res.data as { Grades: Grade[] }).Grades)
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get grades: ${e?.response?.data}`);
        return [];
      });
  }

  public async getGradeComment(id: number) {
    return this.axios
      .get(`https://synergia.librus.pl/gateway/api/2.0/Grades/Comments/${id}`)
      .then(res => (res.data["Comment"] as GradeComment))
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get grade comment: ${e?.response?.data}`);
        return null;
      });
  }

  public async getSubjectInfo(id: string | number) {
    return this.axios
      .get(`https://synergia.librus.pl/gateway/api/2.0/Subjects/${id}`)
      .then(res => (res.data["Subject"]) as Subject)
      .catch(e => {
        if (e instanceof AxiosError)
          throw new Error(`Failed to get subject info: ${e?.response?.data}`);
        return null;
      });
  }
}

export default LibrusApi;
export const {withCredentials} = LibrusApi;
export type {Grade};