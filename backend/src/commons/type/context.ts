export interface IUser {
  user: {
    email: string;
    id: string;
  };
}

// @Context 의 형식을 interface 를 이용해 선언
export interface IContext {
  req?: Request & IUser;
  res?: Response;
}
