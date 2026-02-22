import request from "./request";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: { avatar: "", userName: "", realName: "" },
  }),
  actions: {
    refreshInfo() {
      // 模拟刷新用户信息
      this.userInfo = { avatar: "", userName: "", realName: "" };
    },
  },
});

/* ================= 登录 / 注册 ================= */

interface LoginData {
  userName: string;
  password: string;
  uuid: string;
  code: string;
}

interface RegisterData {
  userName: string;
  realName: string;
  password: string;
  uuid: string;
  code: string;
}

/* ================= 通用响应 ================= */

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  data: T;
  msg: string;
}

/* ================= 用户信息 ================= */

export interface UserInfo {
  createTime: string;
  updateTime: string;
  userId: number;
  userName: string;
  realName: string;
  avatar: string | null;
  delFlag: string;
  createBy: string;
  updateBy: string;
}

/* ================= 修改密码 ================= */

export interface EditPasswordParams {
  userId: number;
  originalPassword: string;
  password: string;
}

/** 修改密码 */
export function editPassword(data: EditPasswordParams) {
  return request<ApiResponse<null>>({
    url: "/user/psw",
    method: "PUT",
    data,
  });
}



/* ================= 修改用户信息 ================= */

export interface EditUserInfoParams {
  userId: number;
  realName?: string;
  avatar?: string;
}

/** 修改用户信息 */
export function editUserInfo(data: EditUserInfoParams) {
  return request<ApiResponse<null>>({
    url: "/user/info",
    method: "PUT",
    data,
  });
}

/* ================= 接口方法 ================= */

// 用户登录
export function userLogin(data: LoginData) {
  return request<ApiResponse<any>>({
    url: "/user/signIn",
    method: "POST",
    data,
  });
}

// 用户注册
export function userResgiter(data: RegisterData) {
  return request<ApiResponse<any>>({
    url: "/user/register",
    method: "POST",
    data,
  });
}

// 获取当前登录用户信息
export function getUserInfo() {
  return request<ApiResponse<UserInfo>>({
    url: "/user/info",
    method: "GET",
  });
}
