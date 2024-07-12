<template>
  <span v-if="type == 'view'">
    <span v-if="showType == 'tags'" class="tags-wrap">
      <template v-if="Array.isArray(formateValue) && formateValue.length">
        <a-tag :color="colors[index]" v-for="(item, index) in formateValue" :key="item">{{
          item
        }}</a-tag>
      </template>
      <span v-else>-</span>
    </span>
    <span v-else>{{ formateValue || '-' }}</span>
  </span>
  <a-select
    :options="data"
    placeholder="请选择"
    v-bind="$attrs"
    @change="handChange"
    v-model:value="curValue"
    v-else-if="type == 'aSelect'"
    class="s-select"
  />
  <div v-else>
    <a-tree-select
      placeholder="请选择"
      :tree-data="handleDisabledParent(data)"
      v-bind="$attrs"
      @change="handChange"
      v-model:value="curValue"
    />
  </div>
</template>
<script>
  import { defineComponent, ref, watch } from 'vue';
  import { isFunction } from '/@/utils/is';
  import { useCodeEnumStore } from '/@/store/modules/codeEmun';

  export default defineComponent({
    props: {
      api: [String, Function],
      type: [String],
      replaceFields: {
        type: [Object],
        default: () => ({
          label: 'name',
          children: 'children',
          value: 'id',
        }),
      },
      params: [Object],
      appendOptions: [Array],
      colors: {
        type: [Array],
        default: () => [
          '#FF7D00',
          '#00B42A',
          '#0094FF',
          '#08979c',
          '#f50',
          '#2db7f5',
          '#d46b08',
          '#108ee9',
          '#55acee',
          '#cf1322',
          '#cd201f',
          '#3b5999',
        ],
      },
      showType: [String],
      cacheKey: [String],
      value: [String, Array],
      disabledParent: Boolean,
    },
    emits: ['update:value', 'change'],
    setup(props, ctx) {
      const data = ref([]);
      const curValue = ref(null);
      const formateValue = ref(null);
      const emunStore = useCodeEnumStore();
      let emum = null;
      let curCacheKey = 'PageList_';

      const buildOptions = (arr, noAppend) => {
        let allOptions = [];
        let formateData = arr.map((item) => ({
          label: item[props.replaceFields.label],
          value: item[props.replaceFields.value],
          children: Array.isArray(item[props.replaceFields.children])
            ? buildOptions(item[props.replaceFields.children], true)
            : [],
        }));
        if (Array.isArray(props.appendOptions) && props.appendOptions.length && !noAppend) {
          allOptions.push(...props.appendOptions);
        }
        allOptions.push(...formateData);
        return allOptions;
      };

      const changeValue = (id, data) => {
        let label = id;

        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.value == id) {
              label = item.label;
            }
            if (label == id) {
              if (Array.isArray(item.children) && item.children.length) {
                label = changeValue(id, item.children);
              }
            }
          });
        }
        return label;
      };

      const handleChangeCode = () => {
        let emumList = data.value;
        if (props.cacheKey) {
          emumList = emunStore.getCodeEnum[curCacheKey];
          data.value = emumList;
        }

        if (curValue.value) {
          let names = [];
          let valArr = [];

          if (Array.isArray(curValue.value)) {
            valArr = [...curValue.value];
          } else {
            valArr = curValue.value.split(',');
          }

          valArr.forEach((item) => {
            names.push(changeValue(item, emumList));
          });
          if (props.showType == 'tags') {
            formateValue.value = names;
          } else {
            formateValue.value = names.join('，');
          }
        } else {
          formateValue.value = '';
        }
      };

      const saveToStore = (res) => {
        if (!props.cacheKey) return;
        // 存store
        const single = {
          code: curCacheKey,
          list: res,
        };
        emunStore.setCodeEnum(single);
      };

      const getDataByApi = async () => {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        const res = await api({ ...props.params, pageSize: 10000, pageNum: 0 });

        if (Array.isArray(res) && res.length) {
          data.value = buildOptions(res);
        } else {
          if (Array.isArray(res.rows) && res.rows.length) {
            data.value = buildOptions(res.rows);
          } else {
            data.value = [];
            props.cacheKey && emunStore.removeLockCode(curCacheKey);
          }
        }

        saveToStore(data.value);
        handleChangeCode();
      };

      const buildDisabledParent = (dataList) => {
        if (!dataList) return dataList;
        return dataList.map((item) => {
          if (Array.isArray(item.children) && item.children.length) {
            return {
              ...item,
              disabled: true,
              children: buildDisabledParent(item.children),
            };
          } else {
            return item;
          }
        });
      };

      const handleDisabledParent = (dataList) => {
        if (props.disabledParent) {
          return buildDisabledParent(dataList);
        }
        return dataList;
      };

      const fetch = async () => {
        // 如果父级有设置才存
        if (props.cacheKey) {
          emum = emunStore.getCodeEnum;
          const lock = emunStore.getLockCode;
          if (lock.indexOf(curCacheKey) == -1) {
            // 给组件store加锁，控制同时请求
            emunStore.setLockCode(curCacheKey);
            // 请求接口，获取枚举值
            getDataByApi();
          }
          // 如果存在枚举就直接转换
          if (emum[curCacheKey]) {
            data.value = emum[curCacheKey];
            handleChangeCode();
          }
        } else {
          getDataByApi();
        }
      };

      // 监听store变化，接口回调后存入store将触发这个监听，对数据进行转换
      const subscribe = emunStore.$subscribe(
        (mutation, state) => {
          /*
      * mutation主要包含三个属性值：
      *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
      *   storeId：是当前store的id
      *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
      *         “direct” ：通过 action 变化的
                ”patch object“ ：通过 $patch 传递对象的方式改变的
                “patch function” ：通过 $patch 传递函数的方式改变的
      *
      * */
          // 我们就可以在此处监听store中值的变化，当变化为某个值的时候，去做一些业务操作之类的
          // console.log('mutation', mutation);
          // console.log('state', state);
          if (state.codeEnum[curCacheKey]) {
            handleChangeCode();
            // 有值转换后，停止订阅
            subscribe(); //调用上方声明的变量值，示例（subscribe），即可以停止订阅
          }
        },
        { detached: false },
      );

      watch(
        () => props.value,
        (val) => {
          if (val == -1) {
            curValue.value = '';
          } else {
            curValue.value = val;
          }

          handleChangeCode();

          if (props.cacheKey) {
            curCacheKey += props.cacheKey;
          }
          fetch();
        },
        { immediate: true },
      );

      // onMounted(() => {
      //   if (props.cacheKey) {
      //     curCacheKey += props.cacheKey;
      //   }
      //   fetch();
      // });
      // watch(
      //   () => props.params,
      //   () => {
      //     if (props.cacheKey) {
      //       curCacheKey += props.cacheKey;
      //     }
      //     fetch();
      //   },
      //   {
      //     immediate: true,
      //   },
      // );

      const handChange = (e) => {
        let resValue = '';
        if (props.type == 'aSelect' && ctx.attrs.maxTagCount == 1) {
          if (Array.isArray(e) && e.length) {
            resValue = e[e.length - 1];
          }
        } else {
          resValue = e;
        }
        ctx.emit('update:value', resValue);
        ctx.emit('change', resValue);
      };

      return {
        data,
        handChange,
        curValue,
        formateValue,
        handleDisabledParent,
      };
    },
  });
</script>
<style lang="less" scoped>
  .tags-wrap {
    .ant-tag {
      margin: 5px;
    }
  }
</style>
