import request from "./request";

/**获取验证码参数 */
export interface CaptchaData{
    uuid:string;
    captchaImage:string
}
// 获取验证码
export function getCaptcha() {
  return request({
    url: "/captchaImage",
    method: "GET",
  });
}

/**获取性别字典值参数 */
export interface DictItem {
  dictLabel: string
  dictValue: string
  dictType: string
  dictSort?: number
}

// 获取性别字典值
export function getDictByType(dictType: string) {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: "GET",
  })
}


