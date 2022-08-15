export interface IUser {
  user: {
    email: string;
    id: string;
  };
  // headers 에서 tokens 추출을 위햔 interface
  headers?: {
    authorization?: string;
    cookie?: string;
  };
}

// @Context 의 형식을 interface 를 이용해 선언
export interface IContext {
  req?: Request & IUser;
  res?: Response;
}
