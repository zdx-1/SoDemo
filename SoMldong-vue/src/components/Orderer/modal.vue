<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    :footer="null"
    title="新增单表"
    @cancel="handleCancel"
  >
    <div class="modal-form-wrap">
      <BasicTable
        rowKey="id"
        @register="registerTable"
        :beforeFetch="handleBeforeFetch"
        :useSearchForm="true"
        :rowSelection="rowSelection"
        :showIndexColumn="false"
        :clickToRowSelect="false"
        size="small"
        :scroll="{ y: 240 }"
        :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
      >
        <template #headerTop>
          <a-alert type="info" show-icon>
            <template #message>
              <template v-if="checkedKeys.length > 0">
                <span>已选中{{ checkedKeys.length }}条记录</span>
                <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
              </template>
              <template v-else>
                <span>未选中任何项目</span>
              </template>
            </template>
          </a-alert>
        </template>
        <!--左上角按钮-->
        <template #tableTitle>
          <TableAction :actions="headActions()" :dropDownActions="headDropDownActions()">
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
            :actions="tableActions(record)"
            :dropDownActions="tableDropDownActions(record)"
          />
        </template>

        <template #isLocked="{ text }">
          <ChangeCode code="yes_no" :value="text" />
        </template>

        <template #assistantType="{ text }">
          <ChangeCode code="biz_shop_assistant_type" :value="text" />
        </template>

        <template #deptId="{ text }">
          <ChangeSelect :value="text" :data="{ api: sysDeptTree }" componentName="ApiTree" />
        </template>
      </BasicTable>
      <formAdd @register="registerAddModal" @success="handleSuccess" />
    </div>
  </BasicModal>
  <Drawer @register="registerAddDrawer" @success="handleSuccess" />
</template>
<script setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { shopAssistantRemove, listByShopId, updateAssistantType } from '/@/api/biz/shopAssistant';
  import formAdd from '/@/views/biz/staffManagement/staff/add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import ChangeCode from '/@/components/ChangeCode/index.vue';
  import ChangeSelect from '/@/components/ChangeSelect/index.vue';
  import { sysDeptTree } from '/@/api/sys/dept';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const curData = ref(null);

  // 注册模态框
  const [registerModal] = useModalInner(async (data) => {
    curData.value = data.record;
  });

  const [registerAddDrawer, { openDrawer, setDrawerProps }] = useDrawer();

  const columns = [
    // 列定义
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '员工类型',
      dataIndex: 'assistantType',
      slots: { customRender: 'assistantType' },
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
    },
    {
      title: '是否锁定',
      dataIndex: 'isLocked',
      slots: { customRender: 'isLocked' },
    },
    {
      title: '所属部门',
      dataIndex: 'deptId',
      slots: { customRender: 'deptId' },
    },
    {
      // flag: 'ACTION',
      fixed: 'right',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];

  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: listByShopId,
    columns: columns,
  });
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'keywords',
      label: '姓名/手机号',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入姓名/手机号',
      },
    },
  ];

  const headActions = () => [
    {
      label: '选择员工',
      type: 'primary',
      size: 'middle',
      icon: 'ant-design:plus-outlined',
      onClick: handleAddUser.bind(null),
      auth: ['admin', 'biz:shopAssistant:save'],
    },
  ];
  const headDropDownActions = () => [
    {
      label: '删除',
      icon: 'ant-design:delete-outlined',
      popConfirm: {
        title: '确定删除吗？',
        confirm: handleDelete.bind(null),
      },
      ifShow: () => {
        return checkedKeys.value.length > 0;
      },
      auth: ['admin', 'biz:shopAssistant:remove'], // 根据权限控制是否显示: 有权限，会显示
    },
  ];
  const tableActions = (record) => [
    {
      label: record.assistantType == 3 ? '取消订货人' : '设置订货人',
      onClick: handleSetAssistantType.bind(null, record),
      auth: ['admin', 'biz:shopAssistant:updateAssistantType'],
    },
  ];
  const tableDropDownActions = (record) => [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
      auth: ['admin', 'sys:user:update'],
    },
    {
      label: '删除',
      icon: 'ant-design:delete-outlined',
      popConfirm: {
        title: '确定删除吗？',
        confirm: handleDelete.bind(null, record),
      },
      auth: ['admin', 'biz:shopAssistant:remove'],
    },
  ];

  // // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: checkedKeys,
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };
  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 选择员工
  const handleAddUser = () => {
    openDrawer(true, {
      record: curData.value,
    });
    setDrawerProps({ title: '选择员工' });
  };
  // 设置为订货人
  const handleSetAssistantType = (record) => {
    updateAssistantType({
      shopId: curData.value.id,
      userId: record.id,
      assistantType: record.assistantType == 3 ? 2 : 3,
    }).then(() => {
      reload();
      emit('success');
    });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑店铺用户' });
  };
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    ids.push(...unref(checkedKeys));
    shopAssistantRemove({
      shopId: curData.value.id,
      userIds: ids,
    }).then(() => {
      clearSelectedRowKeys();
      message.success('删除成功');
      reload();
    });
  };

  const handleSuccess = () => {
    reload();
    emit('success');
  };
  // 关闭
  const handleCancel = () => {};

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
    return { ...params, shopId: curData.value.id, searchKeys: 'realName,mobilePhone' };
  };
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
</style>
