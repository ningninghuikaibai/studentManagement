import request from "./request";

/**班级实体
 *ClassItem是对后端返回的一条班级数据的标准定义 
 *
 */
export interface ClassItem {
  classId: number;
  className: string;
  stuCount?: number;
  createTime?: string;
  updateTime?: string;
}

/**分页查询参数 */
export interface ClassesQuery {
  className?: string;
  pageSize?: number;
  pageNum?: number;
}

/**新增班级参数 */
export interface ClassAddDTO {
  className: string;
}

/**修改班级参数 */
export interface ClassUpdateDTO {
  classId: number;
  className: string;
}
/**删除班级参数 */
export interface ClassDeleteDTO {
  classId: number;
}



// 获取班级列表(支持分页/模糊查询)
export function getClasses(params: ClassesQuery) {
  return request({
    url: "/classes/list",
    method: "GET",
    params,
  });
}

// 添加班级
export function addClasses(data: ClassAddDTO) {
  return request({
    url: "/classes",
    method: "POST",
    data,
  });
}

// 删除班级信息
export function deleteClasses(params: ClassDeleteDTO) {
  return request({
    url: `/classes/${params.classId}`,
    method: "DELETE",
  });
}


// 修改班级信息
export function amendClasses(data: ClassUpdateDTO) {
  return request({
    url: "/classes",
    method: "PUT",
    data,
  });
}
