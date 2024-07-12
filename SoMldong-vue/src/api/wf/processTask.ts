import { defHttp } from '/@/utils/http/axios';

/**
 * 获取流程任务详情
 * @param params 查询参数
 * @returns
 */
export function wfProcessTaskDetail(data) {
  return defHttp.post({ url: '/wf/processTask/detail', params: data });
}
/**
 * 分页查询流程待办列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessTaskTodoList(data) {
  return defHttp.post({ url: '/wf/processTask/todoList', params: data });
}
/**
 * 分页查询流程已办列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessTaskDoneList(data) {
  return defHttp.post({ url: '/wf/processTask/doneList', data });
}
/**
 * 处理待办
 * @param params 查询参数
 * @returns
 */
export function wfProcessTaskExecute(data) {
  return defHttp.post({ url: '/wf/processTask/execute', data });
}
/**
 * 获取可跳转的任务节点名称
 * @param params 查询参数
 * @returns
 */
export function jumpAbleTaskNameList(data) {
  return defHttp.post({ url: '/wf/processTask/jumpAbleTaskNameList', data });
}
/**
 * 获取执行候选人
 * @param params 查询参数
 * @returns
 */
export function candidatePage(data) {
  return defHttp.post({ url: '/wf/processTask/candidatePage', data });
}
/**
 * 委托
 * @param params 查询参数
 * @returns
 */
export function surrogate(data) {
  return defHttp.post({ url: '/wf/processTask/surrogate', data });
}
/**
 * 加签
 * @param params 查询参数
 * @returns
 */
export function addCandidate(data) {
  return defHttp.post({ url: '/wf/processTask/addCandidate', data });
}
