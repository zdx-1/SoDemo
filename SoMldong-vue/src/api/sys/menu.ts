import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList, params: { _m: '1' } });
};
/**
 * 分页查询菜单列表
 * @param params 查询参数
 * @returns
 */
export function sysMenuPage(data) {
  return defHttp.post({ url: '/sys/menu/page', params: data });
}
/**
 * 查询菜单树
 * @param params 查询参数
 * @returns
 */
export function sysMenuTree(data) {
  return defHttp.post({ url: '/sys/menu/tree', data });
}
/**
 * 查询菜单列表
 * @param params 查询参数
 * @returns
 */
export function sysMenuList(data) {
  return defHttp.post({ url: '/sys/menu/list', data });
}
/**
 * 添加菜单
 * @param data 参数
 * @returns
 */
export function sysMenuAdd(data) {
  return defHttp.post({ url: '/sys/menu/save', data });
}
/**
 * 编辑菜单
 * @param data 参数
 * @returns
 */
export function sysMenuEdit(data) {
  return defHttp.post({ url: '/sys/menu/update', data });
}

/**
 * 删除菜单
 * @param data 参数
 * @returns
 */
export function sysMenuDel(data) {
  return defHttp.post({ url: '/sys/menu/remove', data });
}

/**
 * 保存或更新菜单
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysMenuSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysMenuEdit(data);
  } else {
    return sysMenuAdd(data);
  }
}
/**
 * 同步前端路由
 * @param data
 * @returns
 */
export const menuSyncRoute = (data: any): Promise<any> => {
  return defHttp.post<any>({
    url: '/sys/menu/syncRoute',
    params: data,
    headers: {
      appCode: (import.meta.env.VITE_APP_CODE || 'platform').toString(),
    },
  });
};
/**
 * 应用列表
 * @param data 参数
 * @returns
 */
export function sysMenuAppList(data) {
  return defHttp.post({ url: '/sys/menu/appList', data });
}
