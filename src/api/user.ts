import request from "./request";


interface loginData{
    userName:string;
    password:string;
    uuid:string;
    code:string
}

// 用户登录
export function userLogin(data:loginData){
  return request({
    url: "/user/signIn",
    method: "POST",
    data,
  });
}


interface resgisterData{
   userName:string;
   realName:string;
    password:string;
    uuid:string;
    code:string
}
// 用户注册
export function userResgiter(data:resgisterData){
  return request({
    url: "/user/register",
    method: "POST",
    data,
  });
}
