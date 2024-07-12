import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询角色列表
 * @param params 查询参数
 * @returns
 */
export function sysRolePage(data) {
  return defHttp.post({ url: '/sys/role/page', params: data });
}
/**
 * 查询角色列表
 * @param params 查询参数
 * @returns
 */
export function sysRoleList(data) {
  return defHttp.post({ url: '/sys/role/list', data });
}
/**
 * 添加角色
 * @param data 参数
 * @returns
 */
export function sysRoleAdd(data) {
  return defHttp.post({ url: '/sys/role/save', data });
}
/**
 * 编辑角色
 * @param data 参数
 * @returns
 */
export function sysRoleEdit(data) {
  return defHttp.post({ url: '/sys/role/update', data });
}

/**
 * 删除角色
 * @param data 参数
 * @returns
 */
export function sysRoleDel(data) {
  return defHttp.post({ url: '/sys/role/remove', data });
}

/**
 * 保存或更新角色
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysRoleSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysRoleEdit(data);
  } else {
    return sysRoleAdd(data);
  }
}
/**
 * 角色列表下拉
 * @param params 查询参数
 * @returns
 */
export function sysRoleSelect(data) {
  return defHttp.post({ url: '/sys/role/select', data });
}
