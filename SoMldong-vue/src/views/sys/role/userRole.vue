<template>
  <BasicDrawer title="角色成员列表" width="60%" @register="register" destroyOnClose>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    >
      <!--左上角按钮-->
      <template #tableTitle>
        <TableAction
          :actions="[
            {
              label: '添加用户',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:plus-outlined',
              onClick: handleAdd.bind(null),
              auth: ['admin', 'sys:rbac:saveUserRole'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
        />
      </template>
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '移除用户',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定移除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'sys:rbac:removeUserRole'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        /> </template
    ></BasicTable>
    <AddUser ref="addUserRef" @reload="reload" />
  </BasicDrawer>
</template>
<script setup>
  import { ref } from 'vue';
  import { useDrawer, BasicDrawer } from '/@/components/Drawer';
  import { userListByRoleId, removeUserRole } from '/@/api/sys/rbac';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { message } from 'ant-design-vue';
  import AddUser from './addUser.vue';
  const currentRecord = ref();
  const addUserRef = ref();
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
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
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
    api: userListByRoleId,
    columns: columns,
  });
  const [register, { openDrawer }] = useDrawer();
  const handleAdd = () => {
    addUserRef.value?.show(currentRecord.value);
  };
  const handleDelete = (record) => {
    removeUserRole([
      {
        userId: record.id,
        roleId: currentRecord.value.id,
      },
    ]).then(() => {
      message.success('删除成功');
      reload();
    });
  };
  const handleBeforeFetch = (params) => {
    return {
      ...params,
      roleId: currentRecord.value.id,
    };
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      openDrawer();
    },
  });
</script>
