import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询模型分组列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaGroupPage(data) {
  return defHttp.post({ url: '/dev/schemaGroup/page', params: data });
}
/**
 * 查询模型分组列表
 * @param params 查询参数
 * @returns
 */
export function devSchemaGroupList(data) {
  return defHttp.post({ url: '/dev/schemaGroup/list', data });
}
/**
 * 添加模型分组
 * @param data 参数
 * @returns
 */
export function devSchemaGroupAdd(data) {
  return defHttp.post({ url: '/dev/schemaGroup/save', data });
}
/**
 * 编辑模型分组
 * @param data 参数
 * @returns
 */
export function devSchemaGroupEdit(data) {
  return defHttp.post({ url: '/dev/schemaGroup/update', data });
}

/**
 * 删除模型分组
 * @param data 参数
 * @returns
 */
export function devSchemaGroupDel(data) {
  return defHttp.post({ url: '/dev/schemaGroup/remove', data });
}

/**
 * 保存或更新模型分组
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function devSchemaGroupSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return devSchemaGroupEdit(data);
  } else {
    return devSchemaGroupAdd(data);
  }
}
