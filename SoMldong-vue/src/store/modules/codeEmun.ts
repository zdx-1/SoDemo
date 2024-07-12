import { defineStore } from 'pinia';

export const useCodeEnumStore = defineStore({
  id: 'code-enum',
  state: () => ({
    codeEnum: {},
    lock: [],
  }),
  getters: {
    getCodeEnum() {
      return this.codeEnum;
    },
    getLockCode() {
      return this.lock;
    },
  },
  actions: {
    setCodeEnum(single) {
      this.codeEnum[single.code] = single.list;
    },
    setLockCode(code) {
      this.lock.push(code);
    },
    removeLockCode(code) {
      const index = this.lock.indexOf(code);
      if (index != -1) {
        this.lock.splice(index, 1);
      }
    },
  },
});
