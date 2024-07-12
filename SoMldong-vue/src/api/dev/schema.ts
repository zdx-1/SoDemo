import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询数据模型列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaPage(data) {
  return defHttp.post({ url: '/dev/schema/page', params: data });
}
/**
 * 查询数据模型列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaList(data) {
  return defHttp.post({ url: '/dev/schema/list', data });
}
/**
 * 添加数据模型
 * @param data 参数
 * @returns
 */
export function devSchemaAdd(data) {
  return defHttp.post({ url: '/dev/schema/save', data });
}
/**
 * 编辑数据模型
 * @param data 参数
 * @returns
 */
export function devSchemaEdit(data) {
  return defHttp.post({ url: '/dev/schema/update', data });
}
/**
 * 数据模型详情
 * @param data 参数
 * @returns
 */
export function devSchemaDetail(data) {
  return defHttp.post({ url: '/dev/schema/detail', data });
}
/**
 * 删除数据模型
 * @param data 参数
 * @returns
 */
export function devSchemaDel(data) {
  return defHttp.post({ url: '/dev/schema/remove', data });
}

/**
 * 保存或更新数据模型
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function devSchemaSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return devSchemaEdit(data);
  } else {
    return devSchemaAdd(data);
  }
}
/**
 * 获取数据库表
 * @param data 参数
 * @returns
 */
export function dbTable(data) {
  return defHttp.post({ url: '/dev/schema/dbTable', data });
}
/**
 * 导入数据库表
 * @param data 参数
 * @returns
 */
export function importTable(data) {
  return defHttp.post({ url: '/dev/schema/importTable', data });
}
/**
 * 获取元数据
 * @param params 参数
 * @returns
 */
export function getByTableName(params) {
  return defHttp.get({ url: '/dev/schema/getByTableName', params });
}
/**
 * 更新列表字段keys
 * @param data 参数
 * @returns
 */
export function updateListKeys(data) {
  return defHttp.post({ url: '/dev/schema/updateListKeys', data });
}
/**
 * 更新搜索字段keys
 * @param data 参数
 * @returns
 */
export function updateSearchFormKeys(data) {
  return defHttp.post({ url: '/dev/schema/updateSearchFormKeys', data });
}
