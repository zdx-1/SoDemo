<template>
  <BasicModal
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="用户列表"
    :canFullscreen="false"
    :defaultFullscreen="true"
    @ok="handleOk"
  >
    <a-row>
      <a-col :span="12">
        <a-card>
          <template #title>选择用户</template>
          <BasicTable
            rowKey="value"
            :showIndexColumn="false"
            :rowSelection="rowSelection"
            :beforeFetch="handleBeforeFetch"
            @register="registerTable"
            :immediate="false"
            :useSearchForm="true"
            :formConfig="{ labelWidth: 60, schemas: searchFormSchemas }"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <template #title>已选用户</template>
          <BasicTable
            rowKey="value"
            :showIndexColumn="false"
            :columns="selectColumns"
            :dataSource="selectDataSource"
          >
            <!--操作项-->
            <template #action="{ record }">
              <TableAction
                :stopButtonPropagation="true"
                :actions="[
                  {
                    label: '删除',
                    onClick: handleDelete.bind(null, record),
                  },
                ]"
              />
            </template>
          </BasicTable>
        </a-card>
      </a-col>
    </a-row>
  </BasicModal>
</template>
<script setup>
  import { ref, watch, nextTick } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { sysUserSelect } from '/@/api/sys/user';
  const [registerModal, modalAction] = useModal();
  const mValue = ref();
  const currentRecord = ref({});
  const props = defineProps({
    value: {
      type: [String, Number, Array],
    },
    formValues: {
      type: Object,
    },
  });
  const emits = defineEmits(['update:value', 'change', 'ok']);
  const columns = [
    {
      title: '用户名',
      key: 'userName',
      dataIndex: ['ext', 'userName'],
    },
    {
      title: '姓名',
      key: 'realName',
      dataIndex: ['ext', 'realName'],
    },
    {
      title: '所属部门',
      dataIndex: ['ext', 'deptId'],
      component: 'ApiSelect',
      componentProps: {
        api: '/sys/dept/select',
      },
    },
  ];
  const selectColumns = [
    {
      title: '用户名',
      key: 'userName',
      dataIndex: ['ext', 'userName'],
    },
    {
      title: '姓名',
      key: 'realName',
      dataIndex: ['ext', 'realName'],
    },
    {
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      width: '60px',
      slots: { customRender: 'action' },
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_LIKE_userName',
      label: '用户名',
      component: 'Input',
      colProps: {
        xl: 8,
        xxl: 8,
      },
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      field: 'm_LIKE_realName',
      label: '姓名',
      component: 'Input',
      colProps: {
        xl: 8,
        xxl: 8,
      },
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
  ];
  const [registerTable, { getDataSource, deleteSelectRowByKey, reload, clearSelectedRowKeys }] =
    useTable({
      api: sysUserSelect,
      columns,
    });
  // 已选用户
  const selectDataSource = ref([]);
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys, rows) => {
      checkedKeys.value = keys;
      // 原始数据源
      const userDataSource = getDataSource();
      const userAllIds = userDataSource.map((item) => item.value);
      rows.forEach((row) => {
        const index = selectDataSource.value.findIndex((item) => item.value == row.value);
        if (index == -1) {
          selectDataSource.value.push(row);
        }
      });
      // 删除不在左边列表的值
      selectDataSource.value = selectDataSource.value.filter((item) => {
        if (keys.includes(item.value)) {
          return true;
        } else {
          if (!userAllIds.includes(item.value)) {
            return true;
          }
        }
        return false;
      });
    },
  };

  watch(
    () => mValue.value,
    () => {
      emits('update:value', mValue.value);
      emits('change', mValue.value);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.value,
    () => {},
    {
      deep: true,
    },
  );
  const handleBeforeFetch = (params) => {
    return {
      ...params,
      extFieldNames: 'userName,realName,deptId',
      m_NE_id: currentRecord.value?.ext?.u_userId,
    };
  };
  const handleDelete = (record) => {
    selectDataSource.value = selectDataSource.value.filter((item) => {
      return record.value != item.value;
    });
    deleteSelectRowByKey(record.value);
  };
  const handleOk = () => {
    mValue.value = selectDataSource.value.map((item) => item.value);
    emits('ok', mValue.value);
  };
  defineExpose({
    ...modalAction,
    show(record) {
      currentRecord.value = record;
      modalAction.openModal();
      nextTick(() => {
        selectDataSource.value = [];
        clearSelectedRowKeys();
        reload();
      });
    },
    closeModal() {
      // 关闭前清空一下数据
      selectDataSource.value = [];
      clearSelectedRowKeys();
      modalAction.closeModal();
    },
  });
</script>
