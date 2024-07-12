import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询流程定义列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessDefinePage(data) {
  return defHttp.post({ url: '/wf/processDefine/page', params: data });
}
/**
 * 获取流程定义详情
 * @param params 查询参数
 * @returns
 */
export function wfProcessDefineDetail(data) {
  return defHttp.post({ url: '/wf/processDefine/detail', data });
}
/**
 * 删除流程定义
 * @param data 参数
 * @returns
 */
export function wfProcessDefineDel(data) {
  return defHttp.post({ url: '/wf/processDefine/remove', data });
}
/**
 * 删除流程定义
 * @param data 参数
 * @returns
 */
export function wfProcessDefineUpAndDown(data) {
  return defHttp.post({ url: '/wf/processDefine/upAndDown', data });
}
/**
 * 发起流程
 * @param data 参数
 * @returns
 */
export function wfProcessDefineStartAndExecute(data) {
  return defHttp.post({ url: '/wf/processDefine/startAndExecute', data });
}
