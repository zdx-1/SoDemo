/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userName: string;
  password: string;
  uuid?: string;
  code?: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  uuid: string;
  userId: string | number;
  token: string;
  refreshToken: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  perms: string[]; // 权限标识
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  isPlayer?: number | boolean;
  ext?: any;
}
