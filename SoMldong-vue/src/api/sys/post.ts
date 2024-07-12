import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询岗位列表
 * @param params 查询参数
 * @returns
 */
export function sysPostPage(data) {
  return defHttp.post({ url: '/sys/post/page', params: data });
}
/**
 * 查询岗位列表
 * @param params 查询参数
 * @returns
 */
export function sysPostList(data) {
  return defHttp.post({ url: '/sys/post/list', data });
}
/**
 * 添加岗位
 * @param data 参数
 * @returns
 */
export function sysPostAdd(data) {
  return defHttp.post({ url: '/sys/post/save', data });
}
/**
 * 编辑岗位
 * @param data 参数
 * @returns
 */
export function sysPostEdit(data) {
  return defHttp.post({ url: '/sys/post/update', data });
}

/**
 * 删除岗位
 * @param data 参数
 * @returns
 */
export function sysPostDel(data) {
  return defHttp.post({ url: '/sys/post/remove', data });
}

/**
 * 保存或更新岗位
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysPostSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysPostEdit(data);
  } else {
    return sysPostAdd(data);
  }
}
/**
 * 查询岗位下拉列表
 * @param params 查询参数
 * @returns
 */
export function sysPostSelect(data) {
  return defHttp.post({ url: '/sys/post/select', data });
}
