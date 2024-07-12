import { defHttp } from '/@/utils/http/axios';

/**
 * 角色菜单列表(id,name,parentId格式)
 * @param data
 * @returns
 */
export const roleMenuList = (data: { roleId: string | number }): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/roleMenuList', params: data });
};
/**
 * 角色菜单树
 * @param data
 * @returns
 */
export const roleMenuTree = (data: { roleId: string | number }): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/roleMenuTree', params: data });
};
/**
 * 根据角色ID获取菜单ID集合
 * @param data
 * @returns
 */
export const roleMenuIds = (data: { roleId: string | number; appCode?: string }): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/roleMenuIds', params: data });
};
/**
 * 保存角色菜单关系
 * @param data
 * @returns
 */
export const saveRoleMenu = (data: any): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/saveRoleMenu', params: data });
};
/**
 * 通用角色ID获取用户列表
 * @param data
 * @returns
 */
export const userListByRoleId = (data: any): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/userListByRoleId', params: data });
};
/**
 * 获取用户列表-排除指定角色
 * @param data
 * @returns
 */
export const userListExcludeRoleId = (data: any): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/userListExcludeRoleId', params: data });
};
/**
 * 添加用户角色关系
 * @param data
 * @returns
 */
export const saveUserRole = (data: any): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/saveUserRole', params: data });
};
/**
 * 删除用户角色关系
 * @param data
 * @returns
 */
export const removeUserRole = (data: any): Promise<any> => {
  return defHttp.post<any>({ url: '/sys/rbac/removeUserRole', params: data });
};
