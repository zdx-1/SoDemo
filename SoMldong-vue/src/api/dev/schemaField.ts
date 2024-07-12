import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询模型字段列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaFieldPage(data) {
  return defHttp.post({ url: '/dev/schemaField/page', params: data });
}
/**
 * 查询模型字段列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaFieldList(data) {
  return defHttp.post({ url: '/dev/schemaField/list', data });
}
/**
 * 添加模型字段
 * @param data 参数
 * @returns
 */
export function devSchemaFieldAdd(data) {
  return defHttp.post({ url: '/dev/schemaField/save', data });
}
/**
 * 编辑模型字段
 * @param data 参数
 * @returns
 */
export function devSchemaFieldEdit(data) {
  return defHttp.post({ url: '/dev/schemaField/update', data });
}

/**
 * 删除模型字段
 * @param data 参数
 * @returns
 */
export function devSchemaFieldDel(data) {
  return defHttp.post({ url: '/dev/schemaField/remove', data });
}

/**
 * 保存或更新模型字段
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function devSchemaFieldSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return devSchemaFieldEdit(data);
  } else {
    return devSchemaFieldAdd(data);
  }
}
/**
 * 更新模型字段排序
 * @param data 参数
 * @returns
 */
export function schemaFieldUpdateSort(data) {
  return defHttp.post({ url: '/dev/schemaField/updateSort', data });
}
