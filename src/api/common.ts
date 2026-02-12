import request from "./request";

// 获取验证码
export function getCaptcha() {
  return request({
    url: "/captchaImage",
    method: "GET",
  });
}
export interface CaptchaData{
    uuid:string;
    captchaImage:string
}



