<template>
  <div class="select-tags-wrap">
    <a-tag
      closable
      class="select-tag"
      v-for="(item, index) in formateValue"
      :key="item"
      @close="handleRemoveTag(index)"
    >
      {{ item }}
    </a-tag>

    <a-tag class="select-tag select-tag-btn" @click="handleOpenSelect">
      <plus-outlined /> {{ placeholder }}
    </a-tag>
  </div>
  <Modal @register="registerAddModal" @change="handChange" v-bind="$attrs" />
</template>
<script>
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import { useCodeEnumStore } from '/@/store/modules/codeEmun';
  import Modal from './modal.vue';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    components: { PlusOutlined, Modal },
    props: {
      placeholder: {
        type: String,
        default: '请选择',
      },
      api: [String, Function],
      type: [String],
      replaceFields: {
        type: [Object],
        default: () => ({
          label: 'label',
          children: 'children',
          value: 'value',
        }),
      },
      params: [Object],
      cacheKey: [String],
      value: [String, Array],
    },
    emits: ['update:value', 'change'],
    setup(props, ctx) {
      const curValue = ref([]);

      const [registerAddModal, { openModal, setModalProps }] = useModal();
      const handleRemoveTag = (index) => {
        curValue.value.splice(index, 1);
        handChange(curValue.value);
      };

      const handleOpenSelect = () => {
        openModal(true, { data, value: props.value });
        setModalProps({ title: props.placeholder });
      };

      const data = ref([]);
      const formateValue = ref([]);
      const emunStore = useCodeEnumStore();
      let emum = null;
      let curCacheKey = 'PageList_';

      const buildOptions = (arr) => {
        return arr.map((item) => ({
          label: item[props.replaceFields.label],
          value: item[props.replaceFields.value],
          children: Array.isArray(item[props.replaceFields.children])
            ? buildOptions(item[props.replaceFields.children])
            : [],
        }));
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
          formateValue.value = names;
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
          if (state.codeEnum[curCacheKey]) {
            handleChangeCode();
            subscribe();
          }
        },
        { detached: false },
      );

      watch(
        () => props.value,
        (val) => {
          curValue.value = [];
          if (Array.isArray(val)) {
            curValue.value = val;
          } else if (val) {
            curValue.value = val.split(',');
          }
          if (Array.isArray(data.value) && data.value.length) {
            handleChangeCode();
          }
        },
        { immediate: true },
      );

      onMounted(() => {
        if (props.cacheKey) {
          curCacheKey += props.cacheKey;
        }
        fetch();
      });

      const handChange = (e) => {
        ctx.emit('update:value', e);
        ctx.emit('change', e);
      };

      return {
        data,
        handChange,
        curValue,
        formateValue,

        handleRemoveTag,
        registerAddModal,
        handleOpenSelect,
      };
      // watch(
      //   () => props.value,
      //   () => {
      //     curValue.value = props.value;
      //     if (Array.isArray(props.value) || !props.value) {
      //       curValue.value = props.value;
      //     } else {
      //       curValue.value = props.value.split(',');
      //     }

      //     console.log('curValue',curValue.value)
      //   },
      //   {
      //     immediate: true,
      //     deep: true,
      //   },
      // );

      // return {
      //   handleRemoveTag,
      //   registerAddModal,
      //   handleOpenSelect,
      //   curValue,
      // };
    },
  });
</script>
<style lang="less" scoped>
  .select-tags-wrap {
    display: inline-block;
    width: 100%;
    min-height: 40px;
    position: relative;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    .select-tag {
      margin: 5px 0 5px 5px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;

      background: #f5f5f5;
      border: 1px solid #f0f0f0;
      border-radius: 2px;
      cursor: default;
      transition: font-size 0.3s, line-height 0.3s, height 0.3s;
    }

    .select-tag-btn {
      background: #fff;
      border: 1px dashed #0958d9;
      color: #0958d9;
      padding: 0 8px;
      cursor: pointer;
    }
  }
</style>
