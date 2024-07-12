<template>
  <BasicModal title="选择用户" width="60%" @register="register" @ok="handleOk">
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      :rowSelection="rowSelection"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    />
  </BasicModal>
</template>
<script setup>
  import { ref, unref } from 'vue';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { userListExcludeRoleId } from '/@/api/sys/rbac';
  import { BasicTable, useTable } from '/@/components/Table';
  import { saveUserRole } from '/@/api/sys/rbac';
  import { message } from 'ant-design-vue';
  const emits = defineEmits(['reload']);
  const currentRecord = ref();
  const columns = [
    // 列定义
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '手机号码',
      dataIndex: 'mobilePhone',
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_LIKE_userName',
      label: '用户名',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
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
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      field: 'm_LIKE_mobilePhone',
      label: '手机号码',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入手机号码',
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload }] = useTable({
    api: userListExcludeRoleId,
    columns: columns,
  });
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };
  const [register, { openModal }] = useModal();
  const handleBeforeFetch = (params) => {
    return {
      ...params,
      roleId: currentRecord.value.id,
    };
  };
  const handleOk = () => {
    return new Promise((resolve, reject) => {
      const userRole = unref(checkedKeys).map((item) => {
        return {
          userId: item,
          roleId: unref(currentRecord).id,
        };
      });
      saveUserRole(userRole)
        .then(() => {
          resolve({
            closeMobal: false,
          });
          reload();
          emits('reload');
          message.success('添加成功');
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      openModal();
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-table-body) {
    height: 420px !important;
  }
</style>
