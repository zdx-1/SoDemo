import { defineStore } from 'pinia';
import { defHttp } from '/@/utils/http/axios';
interface SchemaState {
  cache: any;
}
export const useSchemaStore = defineStore('app-schema', {
  // 推荐使用 完整类型推断的箭头函数
  state: (): SchemaState => {
    return {
      cache: {},
    };
  },
  actions: {
    /**
     * 请求数据
     * @param code
     */
    requestData(code: any) {
      return new Promise((resolve) => {
        const res = this.cache[code];
        if (res) {
          resolve(res);
          return;
        }
        this.cache[code] = [];
        defHttp
          .get({
            url: '/dev/schema/getByTableName',
            params: {
              tableName: code,
            },
          })
          .then((res) => {
            this.cache[code] = res;
          })
          .catch(() => {
            delete this.cache[code];
          })
          .finally(() => {
            resolve(this.cache[code]);
          });
      });
    },
  },
  getters: {
    /**
     * 获取数据
     * @returns
     */
    getSchema(): Function {
      return (code: any) => {
        return this.cache[code];
      };
    },
  },
});
