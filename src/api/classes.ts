import request from "./request";

export interface ClassesQuery {
  className?: string;
  pageSize?: number;
  pageNum?: number;
}
// 获取班级列表(支持分页/模糊查询)
export function getClasses(params: ClassesQuery) {
  return request({
    url: "/classes/list",
    method: "GET",
    params,
  });
}
