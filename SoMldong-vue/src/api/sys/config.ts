import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询系统配置列表
 * @param params 查询参数
 * @returns
 */
export function sysConfigPage(data) {
  return defHttp.post({ url: '/sys/config/page', params: data });
}
/**
 * 查询系统配置列表
 * @param params 查询参数
 * @returns
 */
export function sysConfigList(data) {
  return defHttp.post({ url: '/sys/config/list', data });
}
/**
 * 添加系统配置
 * @param data 参数
 * @returns
 */
export function sysConfigAdd(data) {
  return defHttp.post({ url: '/sys/config/save', data });
}
/**
 * 编辑系统配置
 * @param data 参数
 * @returns
 */
export function sysConfigEdit(data) {
  return defHttp.post({ url: '/sys/config/update', data });
}

/**
 * 删除系统配置
 * @param data 参数
 * @returns
 */
export function sysConfigDel(data) {
  return defHttp.post({ url: '/sys/config/remove', data });
}

/**
 * 保存或更新系统配置
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysConfigSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysConfigEdit(data);
  } else {
    return sysConfigAdd(data);
  }
}
