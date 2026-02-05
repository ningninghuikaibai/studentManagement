import request from "./request";

// 用户登录
interface loginData{
    userName:string;
    password:string;
    uuid:string;
    code:string
}
export function userLogin(data:loginData){
  return request({
    url: "/user/signIn",
    method: "POST",
    data,
  });
}

// 用户注册
interface resgisterData{
   userName:string;
   realName:string;
    password:string;
    uuid:string;
    code:string
}

export function userResgiter(data:resgisterData){
  return request({
    url: "/user/register",
    method: "POST",
    data,
  });
}
