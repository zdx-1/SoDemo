import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询用户列表
 * @param params 查询参数
 * @returns
 */
export function visLogPage(data) {
  return defHttp.post({ url: '/sys/visLog/page', params: data });
}
