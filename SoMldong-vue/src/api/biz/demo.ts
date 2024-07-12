import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询演示列表
 * @param data 查询参数
 * @returns
 */
export function demoPage(data) {
  return defHttp.post({ url: '/biz/demo/page', data });
}
/**
 * 演示详情
 * @param data 查询参数
 * @returns
 */
export function demoDetail(data) {
  return defHttp.post({ url: '/biz/demo/detail', data });
}
/**
 * 添加演示
 * @param data 参数
 * @returns
 */
export function demoAdd(data) {
  return defHttp.post({ url: '/biz/demo/save', data });
}
/**
 * 编辑演示
 * @param data 参数
 * @returns
 */
export function demoEdit(data) {
  return defHttp.post({ url: '/biz/demo/update', data });
}

/**
 * 删除演示
 * @param data 参数
 * @returns
 */
export function demoDel(data) {
  return defHttp.post({ url: '/biz/demo/remove', data });
}
/**
 * 构造演示导出url
 * @param data 参数
 * @returns
 */
export function demoGenerateExportUrl(data) {
  return defHttp.post({ url: '/biz/demo/generateExportUrl', data });
}
/**
 * 保存或更新演示
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function demoSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return demoEdit(data);
  } else {
    return demoAdd(data);
  }
}
/**
 * 测试POST接口
 * @param data 参数
 * @returns
 */
export function bizDemoTestPost(data) {
  return defHttp.post({ url: '/biz/demo/testPost', data: data });
}
/**
 * 测试GET接口
 * @param data 参数
 * @returns
 */
export function bizDemoTestGet(data) {
  return defHttp.get({ url: '/biz/demo/testGet', params: data });
}
