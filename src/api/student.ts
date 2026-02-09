import request from "./request";

export interface StudentQuery {
  classId: number;
  stuName?: string;
  stuNum?: string;
  phone?: string;
  pageSize: number;
  pageNum: number;
}
// 获取学生列表(支持分页/模糊查询)
export function getStudentList(params: StudentQuery) {
  return request({
    url: "/student/list",
    method: "GET",
    params,
  });
}
