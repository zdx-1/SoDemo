import { defHttp } from '/@/utils/http/axios';
type OptionsItem = { label: string; value: string; disabled?: boolean };

/**
 * 字典
 * @param data 参数
 * @returns
 */
export function sysDictTypeDropDown(data) {
  return defHttp.post<OptionsItem[]>({ url: '/sys/dict/getByDictType', params: data });
}
/**
 * 分页查询字典列表
 * @param params 查询参数
 * @returns
 */
export function sysDictPage(data) {
  return defHttp.post({ url: '/sys/dict/page', params: data });
}
/**
 * 查询字典列表
 * @param params 查询参数
 * @returns
 */
export function sysDictList(data) {
  return defHttp.post({ url: '/sys/dict/list', data });
}
/**
 * 添加字典
 * @param data 参数
 * @returns
 */
export function sysDictAdd(data) {
  return defHttp.post({ url: '/sys/dict/save', data });
}
/**
 * 编辑字典
 * @param data 参数
 * @returns
 */
export function sysDictEdit(data) {
  return defHttp.post({ url: '/sys/dict/update', data });
}

/**
 * 删除字典
 * @param data 参数
 * @returns
 */
export function sysDictDel(data) {
  return defHttp.post({ url: '/sys/dict/remove', data });
}

/**
 * 保存或更新字典
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysDictSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysDictEdit(data);
  } else {
    return sysDictAdd(data);
  }
}
/**
 * 枚举字典列表
 * @param data 参数
 * @returns
 */
export function dictEnumDictList(data) {
  return defHttp.post({ url: '/sys/dict/enumDictList', data });
}
/**
 * 自定义字典列表
 * @param data 参数
 * @returns
 */
export function customDictList(data) {
  return defHttp.post({ url: '/sys/dict/customDictList', data });
}
/**
 * 获取下拉列表
 * @param data
 * @returns
 */
export const selectData = (dictType) => {
  return defHttp.request({
    method: 'post',
    url: '/sys/dict/getByDictType',
    data: { dictType },
  });
};

export const commonGetData = (config) => {
  return defHttp.request(config);
};
