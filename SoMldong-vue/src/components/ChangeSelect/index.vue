<template>
  <span class="change-select" :title="showValue">{{ showValue || '-' }}</span>
</template>
<script>
  import { defineComponent, ref, watch, unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { useCodeEnumStore } from '/@/store/modules/codeEmun';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { parseJsonStr } from '/@/utils/commonUtils.js';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    props: {
      value: {
        type: [String, Object, String],
      },
      componentName: {
        type: String,
      }, // 调用的组件名
      data: {
        type: Object,
      },
      type: {
        type: [String, Number],
      },
      componentPropsJsonStr: [Object, String],
    },
    setup(props) {
      const showValue = ref('');
      const emunStore = useCodeEnumStore();
      const componentPropsJson = ref({ apiParams: null });
      // 请求唯一码
      let code = '';
      // 数据转换
      const valueToLabel = (value, data, replaceField) => {
        let newLabel = [];
        if (Array.isArray(data)) {
          data.forEach((item) => {
            value.forEach((single) => {
              if (single == item[replaceField.value]) {
                newLabel.push(item[replaceField.label]);
              } else if (Array.isArray(item.children)) {
                newLabel.push(...valueToLabel([single], item.children, replaceField));
              }
            });
          });
        }
        return newLabel;
      };

      // 字典等数据转换
      const exChangeCode = async (value, component, params, type) => {
        const emum = emunStore.getCodeEnum;
        const lock = emunStore.getLockCode;

        if (typeof params === 'object') {
          // -1 转空值
          if (value == -1 || value == '-' || value == null || value == 'undefined') {
            showValue.value = null;
            return;
          }
          if (component != 'Dict' && params.api && typeof value != 'undefined' && value != null) {
            let includeIds = value.split(',');
            let apiParams = {};
            if (
              unref(componentPropsJson).apiParams &&
              typeof unref(componentPropsJson).apiParams == 'object'
            ) {
              apiParams = unref(componentPropsJson).apiParams || {};
            }
            const data = { includeIds, ...params, includeType: type, ...apiParams };
            delete data.api;
            delete data._t;
            const postData = { url: params.api, data };
            code = 'm_' + encryptByMd5(JSON.stringify(postData));
            let res = [];
            if (lock.indexOf(code) == -1) {
              // 给组件store加锁，控制同时请求
              emunStore.setLockCode(code);
              // 请求接口，获取枚举值
              try {
                if (isFunction(params.api)) {
                  res = await params.api(data);
                } else {
                  res = await defHttp.post(postData);
                }

                const single = {
                  code: code,
                  list: res,
                };
                emunStore.setCodeEnum(single);
              } catch (error) {
                console.log('error', error);
                emunStore.removeLockCode(code);
              }
            }
            // 如果存在枚举就直接转换
            if (emum[code]) {
              res = emunStore.getCodeEnum[code];
            }
            let newLabel = '';
            // 下拉类型处理
            if (
              params.api == '/common/select' ||
              component == 'ApiSelect' ||
              component == 'ApiRadioGroup' ||
              component == 'ApiCheckboxGroup'
            ) {
              newLabel = valueToLabel(includeIds, res, { label: 'label', value: 'value' }).join(
                ',',
              );
            }
            // 树形处理
            if (
              params.api == '/biz/subjectCategory/tree' ||
              component == 'ApiTreeSelect' ||
              component == 'ApiCascader' ||
              component == 'ApiTree'
            ) {
              newLabel = valueToLabel(includeIds, res, { label: 'name', value: 'id' }).join('、');
            }
            showValue.value = newLabel || value;
          }
        }
      };

      // 监听store变化，接口回调后存入store将触发这个监听，对数据进行转换
      const subscribe = emunStore.$subscribe(
        (mutation, state) => {
          if (state.codeEnum[code]) {
            exChangeCode(props.value, props.componentName, props.data, props.type);
            // 有值转换后，停止订阅
            subscribe(); //调用上方声明的变量值，示例（subscribe），即可以停止订阅
          }
        },
        { detached: false },
      );
      watch(
        () => props.componentPropsJsonStr,
        () => {
          componentPropsJson.value = parseJsonStr(props.componentPropsJsonStr);
        },
        { immediate: true },
      );

      watch(
        () => props.value,
        () => {
          exChangeCode(props.value, props.componentName, props.data, props.type);
        },
        { immediate: true },
      );
      return {
        showValue,
      };
    },
  });
</script>
<style lang="less" scoped>
  .change-select {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
