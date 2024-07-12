<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    title="操作"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <div class="modal-form-wrap">
      <div class="search-wrap">
        <a-input-search
          v-model:value="searchKeys"
          placeholder="请输入关键字"
          enter-button="搜索"
          allowClear
          @search="onSearch"
        />
      </div>
      <div class="main-tree">
        <a-alert type="info" show-icon>
          <template #message>
            <template v-if="selectedKeys.checked && selectedKeys.checked.length > 0">
              <span>已选中{{ selectedKeys.checked && selectedKeys.checked.length }}条记录</span>
              <a-button type="link" @click="selectedKeys = { checked: [] }" size="small">
                清空
              </a-button>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert>
        <BasicTree
          v-model:checkedKeys="selectedKeys"
          checkable
          :tree-data="searchResult"
          :checkStrictly="true"
          :selectable="false"
          :replaceFields="{
            children: 'children',
            title: 'label',
            key: 'value',
          }"
        >
          <template #title="{ label }">
            <span v-if="label.indexOf(searchKeys) > -1">
              {{ label.substr(0, label.indexOf(searchKeys)) }}
              <span style="color: #f50">{{ searchKeys }}</span>
              {{ label.substr(label.indexOf(searchKeys) + searchKeys.length) }}
            </span>
            <span v-else>{{ label }}</span>
          </template>
        </BasicTree>
      </div>
    </div>
  </BasicModal>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { BasicTree } from '/@/components/Tree/index';

  export default defineComponent({
    components: { BasicModal, BasicTree },
    props: {
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
      showType: [String],
      cacheKey: [String],
      value: [String, Array],
    },
    emits: ['update:value', 'change'],
    setup(props, ctx) {
      const data = ref([]);
      const searchKeys = ref(null);
      const selectedKeys = ref({ checked: [] });
      const searchResult = ref([]);

      // 注册模态框
      const [registerModal, { closeModal }] = useModalInner(async (record) => {
        data.value = cloneDeep(record.data);
        searchResult.value = cloneDeep(record.data);
        selectedKeys.value = { checked: record.value };
      });

      const handleSubmit = () => {
        const checked = selectedKeys.value.checked;
        ctx.emit('update:value', checked);
        ctx.emit('change', checked);
        closeModal();
      };

      const getSearchItem = (allData) => {
        if (!searchKeys.value) {
          searchResult.value = cloneDeep(data.value);
          return;
        }
        searchResult.value = [];
        allData.forEach((item) => {
          if (item.label.indexOf(searchKeys.value) > -1) {
            searchResult.value.push(item);
            return;
          }
          if (Array.isArray(item.children) && item.children.length) {
            getSearchItem(item.children);
          }
        });
      };

      const onSearch = () => {
        getSearchItem(data.value);
      };

      return {
        data,
        registerModal,
        searchKeys,
        selectedKeys,
        handleSubmit,
        onSearch,
        searchResult,
      };
    },
  });
</script>
<style scoped lang="less">
  .common-form {
    :deep(.ant-row) {
      justify-content: space-between;
    }
  }
  .modal-form-wrap {
    padding: 12px;
  }
  .ant-alert {
    margin-top: 5px;
  }
</style>
