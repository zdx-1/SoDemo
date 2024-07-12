import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询流程实例列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstancePage(data) {
  return defHttp.post({ url: '/wf/processInstance/page', params: data });
}
/**
 * 获取流程实例详情
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceDetail(data) {
  return defHttp.post({ url: '/wf/processInstance/detail', data });
}
/**
 * 发起流程
 * @param data 参数
 * @returns
 */
export function wfProcessInstanceStartAndExecute(data) {
  return defHttp.post({ url: '/wf/processInstance/startAndExecute', data });
}
/**
 * 获取流程实例高亮数据
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceHighLight(data) {
  return defHttp.post({ url: '/wf/processInstance/highLight', data });
}
/**
 * 获取流程审批记录
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceApprovalRecord(data) {
  return defHttp.post({ url: '/wf/processInstance/approvalRecord', data });
}
/**
 * 撤回流程
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceWithdraw(data) {
  return defHttp.post({ url: '/wf/processInstance/withdraw', data });
}
/**
 * 抄送列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceCcPage(data) {
  return defHttp.post({ url: '/wf/processInstance/ccList', data });
}
/**
 * 获取流程参与人回显文本数据
 * @param params 查询参数
 * @returns
 */
export function wfProcessInstanceGetAssigneeTextData(data) {
  return defHttp.post({ url: '/wf/processInstance/getAssigneeTextData', data });
}
