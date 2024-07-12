import { defHttp } from '/@/utils/http/axios';
/**
 * 分页查询字典项列表
 * @param params 查询参数
 * @returns
 */
export function sysDictItemPage(data) {
  return defHttp.post({ url: '/sys/dictItem/page', params: data });
}
/**
 * 查询字典项列表
 * @param params 查询参数
 * @returns
 */
export function sysDictItemList(data) {
  return defHttp.post({ url: '/sys/dictItem/list', data });
}
/**
 * 添加字典项
 * @param data 参数
 * @returns
 */
export function sysDictItemAdd(data) {
  return defHttp.post({ url: '/sys/dictItem/save', data });
}
/**
 * 编辑字典项
 * @param data 参数
 * @returns
 */
export function sysDictItemEdit(data) {
  return defHttp.post({ url: '/sys/dictItem/update', data });
}

/**
 * 删除字典项
 * @param data 参数
 * @returns
 */
export function sysDictItemDel(data) {
  return defHttp.post({ url: '/sys/dictItem/remove', data });
}

/**
 * 保存或更新字典项
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysDictItemSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysDictItemEdit(data);
  } else {
    return sysDictItemAdd(data);
  }
}
