import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询流程设计列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessDesignPage(data) {
  return defHttp.post({ url: '/wf/processDesign/page', params: data });
}
/**
 * 查询流程设计列表
 * @param params 查询参数
 * @returns
 */
export function wfProcessDesignList(data) {
  return defHttp.post({ url: '/wf/processDesign/list', data });
}
/**
 * 获取流程设计详情
 * @param params 查询参数
 * @returns
 */
export function wfProcessDesignDetail(data) {
  return defHttp.post({ url: '/wf/processDesign/detail', data });
}
/**
 * 添加流程设计
 * @param data 参数
 * @returns
 */
export function wfProcessDesignAdd(data) {
  return defHttp.post({ url: '/wf/processDesign/save', data });
}
/**
 * 编辑流程设计
 * @param data 参数
 * @returns
 */
export function wfProcessDesignEdit(data) {
  return defHttp.post({ url: '/wf/processDesign/update', data });
}

/**
 * 删除流程设计
 * @param data 参数
 * @returns
 */
export function wfProcessDesignDel(data) {
  return defHttp.post({ url: '/wf/processDesign/remove', data });
}

/**
 * 保存或更新流程设计
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function wfProcessDesignSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return wfProcessDesignEdit(data);
  } else {
    return wfProcessDesignAdd(data);
  }
}

/**
 * 更新流程设计定义
 * @param data 参数
 * @returns
 */
export function updateDefine(data) {
  return defHttp.post({ url: '/wf/processDesign/updateDefine', data });
}
/**
 * 部署流程定义
 * @param data 参数
 * @returns
 */
export function wfProcessDesignDeploy(data) {
  return defHttp.post({ url: '/wf/processDesign/deploy', data });
}
/**
 * 重新部署流程定义
 * @param data 参数
 * @returns
 */
export function wfProcessDesignRedeploy(data) {
  return defHttp.post({ url: '/wf/processDesign/redeploy', data });
}
/**
 * 按流程分类给流程设计分组
 * @param data 参数
 * @returns
 */
export function wfProcessDesignListByType(data) {
  return defHttp.post({ url: '/wf/processDesign/listByType', data });
}
