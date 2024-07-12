<template>
  <BasicModal
    width="60%"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    :title="type == 'custom' ? '自定义字典' : '枚举字典'"
    :fullScreen="false"
    :footer="null"
  >
    <a-form :model="formData" :labelCol="{ flex: '80px' }" :wrapperCol="{ span: 12 }">
      <a-form-item label="关键字">
        <a-input v-model:value="formData.keywords" placeholder="请输入字典名称、字典值">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <BasicTable
      rowKey="dictKey"
      @register="registerTable"
      :showIndexColumn="false"
      :inset="true"
      :canResize="false"
    >
      <template #expandedRowRender="{ record }">
        <template v-for="item in record.items" :key="item.dictItemKey">
          <a-row v-if="item.dictItemKey == item.dictItemValue">
            <a-col :span="12">{{ item.name }}</a-col>
            <a-col :span="12">{{ item.dictItemKey }}</a-col>
          </a-row>
          <a-row v-else>
            <a-col :span="8">{{ item.name }}</a-col>
            <a-col :span="8">{{ item.dictItemKey }}</a-col>
            <a-col :span="8">{{ item.dictItemValue }}</a-col>
          </a-row>
          <a-divider :plain="true" />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup>
  import { reactive, ref, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { dictEnumDictList, customDictList } from '/@/api/sys/dict';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { SearchOutlined } from '@ant-design/icons-vue';
  const type = ref('enum');
  let tableData = ref([]);
  const formData = reactive({ keywords: '' });
  let copyTableData = [];
  const requestData = (data) => {
    return new Promise((resolve, reject) => {
      const apiFun = type.value == 'custom' ? customDictList : dictEnumDictList;
      apiFun(data)
        .then((res) => {
          tableData.value = res;
          copyTableData = res;
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
  watch(
    () => formData.keywords,
    (n) => {
      if (n) {
        tableData.value = copyTableData.filter((item) => {
          return item.name.indexOf(n) !== -1 || item.dictKey.indexOf(n) !== -1;
        });
      } else {
        tableData.value = copyTableData;
      }
    },
  );
  const columns = [
    // 列定义
    {
      title: '字典名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '字典值',
      dataIndex: 'dictKey',
      align: 'left',
    },
  ];
  // 注册表格
  const [registerTable, {}] = useTable({
    dataSource: tableData,
    columns: columns,
  });
  // 注册模态框
  const [registerModal, { openModal }] = useModal();
  const show = (mType) => {
    type.value = mType || 'enum';
    requestData({});
    openModal(true);
  };
  defineExpose({ show });
</script>
<style scoped>
  :deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }
</style>
