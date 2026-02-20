import request from "./request";

/**
 * 专业实体
 * MajorItem 是对后端返回的一条专业数据的标准定义
 */
export interface MajorItem {
  majorId: number;
  majorName: string;
  createTime?: string;
  updateTime?: string | null;
}

// 获取专业列表（无分页）
export function getMajorList() {
  return request({
    url: "/major/list",
    method: "GET",
  });
}
