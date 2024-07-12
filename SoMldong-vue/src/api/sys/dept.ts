import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询部门列表
 * @param params 查询参数
 * @returns
 */
export function sysDeptPage(data) {
  return defHttp.post({ url: '/sys/dept/page', params: data });
}
/**
 * 查询部门树
 * @param params 查询参数
 * @returns
 */
export function sysDeptTree(data) {
  return defHttp.post({ url: '/sys/dept/tree', data });
}
/**
 * 添加部门
 * @param data 参数
 * @returns
 */
export function sysDeptAdd(data) {
  return defHttp.post({ url: '/sys/dept/save', data });
}
/**
 * 编辑部门
 * @param data 参数
 * @returns
 */
export function sysDeptEdit(data) {
  return defHttp.post({ url: '/sys/dept/update', data });
}

/**
 * 删除部门
 * @param data 参数
 * @returns
 */
export function sysDeptDel(data) {
  return defHttp.post({ url: '/sys/dept/remove', data });
}

/**
 * 保存或更新部门
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysDeptSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysDeptEdit(data);
  } else {
    return sysDeptAdd(data);
  }
}
