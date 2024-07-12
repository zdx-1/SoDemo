<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      :rowSelection="rowSelection"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    >
      <!--左上角按钮-->
      <template #tableTitle>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:plus-outlined',
              onClick: handleAdd.bind(null),
              auth: ['admin', 'sys:role:save'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null),
              },
              ifShow: () => {
                return checkedKeys.length > 0;
              },
              auth: ['admin', 'sys:role:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        >
          <template #more>
            <a-button style="margin-left: 8px">
              批量操作
              <DownOutlined />
            </a-button>
          </template>
        </TableAction>
      </template>
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'sys:role:update'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '授权菜单',
              onClick: openAuthSetting.bind(null, record),
              auth: ['admin', 'sys:rbac:saveRoleMenu'], // 根据权限控制是否显示: 无权限，不显示
              disabled: record.roleType != 1, // 仅普通角色有菜单权限
            },
            {
              label: '成员管理',
              onClick: openUserRole.bind(null, record),
              auth: ['admin', 'sys:rbac:userListByRoleId'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'sys:role:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
          :dropDownActions="[]"
        />
      </template> </BasicTable
    ><sysRoleAdd :appCode="appCode" @register="registerAddModal" @success="handleSuccess" />
    <UserRole ref="userRoleRef" />
    <AuthSetting :appCode="appCode" ref="authSettingRef" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { sysRoleDel, sysRolePage } from '/@/api/sys/role';
  import sysRoleAdd from './add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import UserRole from './userRole.vue';
  import AuthSetting from './authSetting.vue';
  const props = defineProps({
    appCode: {
      type: String,
    },
  });
  const userRoleRef = ref();
  const authSettingRef = ref();
  const columns = [
    // 列定义
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '唯一编码',
      dataIndex: 'code',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      width: '10%',
      component: 'ApiDict',
      componentProps: {
        code: 'sys_role_role_type',
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: '10%',
      component: 'ApiDict',
      componentProps: {
        code: 'yes_no',
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
      field: 'm_LIKE_name',
      label: '角色名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入角色名称',
      },
    },
    {
      field: 'm_LIKE_code',
      label: '唯一编码',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入唯一编码',
      },
    },
    {
      field: 'm_EQ_enabled',
      label: '是否启用',
      component: 'ApiDict',
      componentProps: {
        code: 'yes_no',
        placeholder: '请选择是否启用',
      },
      colProps: {
        xl: 6,
        xxl: 6,
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: sysRolePage,
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
  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增角色' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑角色' });
  };
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
      checkedKeys.value = [];
    } else {
      ids.push(...unref(checkedKeys));
    }
    sysRoleDel({
      ids: ids,
    }).then(() => {
      message.success('删除成功');
      clearSelectedRowKeys();
      reload();
    });
  };
  // 添加、编辑成功回调
  const handleSuccess = () => {
    reload();
  };
  // 处理查询请求参数
  const handleBeforeFetch = (params) => {
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] == 9999999999) {
          // 删除全部自定义的值-不提交到后端
          delete params[key];
        }
      });
    }
    return {
      ...params,
      m_EQ_appCode: props.appCode,
    };
  };
  /**
   * 打开成员管理
   * @param {*} record
   */
  const openUserRole = (record) => {
    userRoleRef.value?.show(record);
  };
  /**
   * 打开授权菜单
   * @param {*} record
   */
  const openAuthSetting = (record) => {
    authSettingRef.value?.show(record);
  };
</script>

<style lang="less" scoped></style>
