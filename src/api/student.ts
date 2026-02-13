import request from "./request";

/**分页查询参数 */
export interface StudentQuery {
  classId: number;
  stuName?: string;
  stuNum?: string;
  phone?: string;
  pageSize: number;
  pageNum: number;
}

/**添加学生参数 */
export interface StudentAddDTO {
  classId: number;
  stuName: string;
  stuNum: string;
  phone: string;
  sex: string;
  majorId: number;
  age: number;
}

/**删除学生参数 */
export interface StudentDeleteDTO {
  stuId:string
}

/**修改学生参数 */
export interface StudentUpdateDTO {
  stuId: number;
  stuName: string;
  classId: number;
  stuNum: string;
  phone: string;
  sex: string;
  majorId: number;
  age: number;
}

// 获取学生列表(支持分页/模糊查询)
export function getStudentList(params: StudentQuery) {
  return request({
    url: "/student/list",
    method: "GET",
    params,
  });
}

// 添加学生信息
export function addStudent(data: StudentAddDTO) {
  return request({
    url: "/student",
    method: "POST",
    data,
  });
}
// 删除学生信息
export function deleteStudent(params: StudentDeleteDTO) {
  return request({
    url: `/student/${params.stuId}`,
    method: "DELETE",
  });
}
// 修改学生信息
export function amendStudent(data: StudentUpdateDTO) {
  return request({
    url: "/student",
    method: "PUT",
    data,
  });
}
