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
  <Modal @register="registerAddModal" @success="handChange" v-bind="$attrs" />
</template>
<script>
  import { defineComponent, ref, watch } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import Modal from './modal.vue';
  import { shopSelect } from '/@/api/biz/shop';

  export default defineComponent({
    components: { PlusOutlined, Modal },
    props: {
      placeholder: {
        type: String,
        default: '请选择',
      },
      params: [Object],
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
        openModal(true, { data: data.value, value: props.value });
        setModalProps({ title: props.placeholder });
      };

      const data = ref([]);
      const formateValue = ref([]);

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
        if (curValue.value) {
          let names = [];
          let valArr = [];

          if (Array.isArray(curValue.value)) {
            valArr = [...curValue.value];
          } else {
            valArr = curValue.value.split(',');
          }

          valArr.forEach((item) => {
            names.push(changeValue(item, data.value));
          });
          formateValue.value = names;
        }
      };

      const getDataByApi = async () => {
        const includeIds = [...curValue.value];
        const res = await shopSelect({
          ...props.params,
          pageSize: 10000,
          pageNum: 0,
          includeIds,
          labelKey: 'shopName',
          includeType: 2,
        });
        data.value = res;
        handleChangeCode();
      };

      watch(
        () => props.value,
        (val) => {
          curValue.value = [];
          if (Array.isArray(val)) {
            curValue.value = val;
          } else if (val) {
            curValue.value = val.split(',');
          }
          getDataByApi();
          if (Array.isArray(data.value) && data.value.length) {
            handleChangeCode();
          }
        },
        { immediate: true },
      );

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
