import type { LockInfo } from '/#/store';

import { defineStore } from 'pinia';

import { LOCK_INFO_KEY, CHECK_GITEE_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { useUserStore } from './user';

interface LockState {
  lockInfo: Nullable<LockInfo>;
  checkGitee: Nullable<Boolean>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
    checkGitee: Persistent.getSession<Boolean>(CHECK_GITEE_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo;
    },
    getCheckGitee(): Nullable<Boolean> {
      return this.checkGitee;
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true);
    },
    resetLockInfo() {
      Persistent.removeLocal(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    setCheckGitee(checkGitee: Boolean) {
      this.checkGitee = checkGitee;
      Persistent.setSession(CHECK_GITEE_KEY, checkGitee, true);
    },
    // Unlock
    async unLock(password?: string) {
      const userStore = useUserStore();
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo();
        return true;
      }
      const tryLogin = async () => {
        try {
          const username = userStore.getUserInfo?.username;
          const res = await userStore.login({
            username,
            password: password!,
            goHome: false,
            mode: 'none',
          });
          if (res) {
            this.resetLockInfo();
          }
          return res;
        } catch (error) {
          return false;
        }
      };
      return await tryLogin();
    },
  },
});
