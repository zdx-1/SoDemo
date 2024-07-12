import { defineStore } from 'pinia';
import { defHttp } from '/@/utils/http/axios';
interface DictState {
  cache: any;
}
export const useDictStore = defineStore('app-dict', {
  // 推荐使用 完整类型推断的箭头函数
  state: (): DictState => {
    return {
      cache: {},
    };
  },
  actions: {
    /**
     * 请求数据
     * @param code
     * @param dataType
     */
    requestData(code: any, dataType: String | undefined) {
      return new Promise((resolve) => {
        const res = this.cache[code];
        if (res) {
          resolve(res);
          return;
        }
        this.cache[code] = [];
        defHttp
          .post({
            url: '/sys/dict/getByDictType',
            params: {
              dictType: code,
            },
          })
          .then((res) => {
            this.cache[code] = res.map((item: any) => {
              let v = item.value;
              if (dataType === 'Number' || dataType === undefined) {
                v = Number(item.value);
              } else if (dataType === 'String') {
                v = String(item.value);
              }
              return {
                value: v,
                label: item.label,
              };
            });
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
    getDictData(): Function {
      return (code: any) => {
        return this.cache[code];
      };
    },
  },
});
