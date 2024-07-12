<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="导入"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <BasicTable
      rowKey="name"
      :api="dbTable"
      :columns="columns"
      :canResize="false"
      :showIndexColumn="false"
      :useSearchForm="true"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
      :rowSelection="rowSelection"
    />
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { dbTable, importTable } from '/@/api/dev/schema';
  import { BasicTable } from '/@/components/Table';
  import { ref, h } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
    getCheckboxProps: (record) => ({
      disabled: record.disabled == true,
    }),
  };
  const schemaGroupId = ref();
  const columns = ref([
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '表注释',
      dataIndex: 'comment',
      key: 'comment',
    },
  ]);
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'keywords',
      label: '关键字',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ];
  // 注册模态框
  const [registerModal, { changeOkLoading, changeLoading, closeModal }] = useModalInner(
    async (data) => {
      if (typeof data.record === 'object') {
      }
    },
  );
  // 关闭模态框事件
  const handleCancel = () => {};
  // 提交表单
  const handleOk = () => {
    if (checkedKeys.value.length === 0) {
      message.error('请选择要导入的表');
      return;
    }
    Modal.confirm({
      title: () => '请选择模型分组',
      content: () =>
        h(ApiSelect, {
          api: '/dev/schemaGroup/select',
          onChange(e) {
            schemaGroupId.value = e;
          },
          placeholder: '请选择模型分组',
          params: { pageSize: 1000 },
          style: {
            width: '100%',
          },
        }),
      onOk() {
        changeOkLoading(true);
        changeLoading(true);
        importTable({ tableNames: checkedKeys.value, schemaGroupId: schemaGroupId.value })
          .then(() => {
            changeOkLoading(false);
            changeLoading(false);
            // 关闭模态框
            closeModal();
            message.success('导入成功');
            emit('success');
          })
          .catch(() => {
            changeOkLoading(false);
            changeLoading(false);
          });
      },
    });
  };
</script>
