<template>
  <BasicDrawer
    width="60%"
    v-bind="$attrs"
    @register="registerDrawer"
    title="新增单表"
    @close="handleCancel"
    destroyOnClose
    :body-style="{ paddingBottom: '80px' }"
  >
    <div class="drawer-form-wrap">
      <BasicTable
        rowKey="id"
        @register="registerTable"
        :useSearchForm="true"
        :beforeFetch="handleBeforeFetch"
        :showIndexColumn="false"
        :clickToRowSelect="false"
        size="small"
        :scroll="{ y: 240 }"
        :rowSelection="rowSelection"
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
          <TableAction :actions="headActions()" />
        </template>
        <template #isLocked="{ text }">
          <ChangeCode code="yes_no" :value="text" />
        </template>

        <template #deptId="{ text }">
          <ChangeSelect :value="text" :data="{ api: sysDeptTree }" componentName="ApiTree" />
        </template>
      </BasicTable>
      <div class="footer">
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </div>
    </div>
  </BasicDrawer>
  <formAdd @register="registerAddModal" @success="handleSuccess" />
</template>
<script setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listExcludeByShopId, shopAssistantSave } from '/@/api/biz/shopAssistant';
  // import formAdd from '/@/views/sys/user/add.vue';
  import formAdd from '/@/views/biz/staffManagement/staff/add.vue';
  import { useModal } from '/@/components/Modal';
  import ChangeCode from '/@/components/ChangeCode/index.vue';
  import ChangeSelect from '/@/components/ChangeSelect/index.vue';
  import { sysDeptTree } from '/@/api/sys/dept';

  // 声明Emits
  const emit = defineEmits(['success']);

  const shopId = ref();

  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: checkedKeys,
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };
  const columns = [
    // 列定义
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
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
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'keywords',
      label: '关键字',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ];

  const headActions = () => [
    {
      label: '新增',
      type: 'primary',
      size: 'middle',
      icon: 'ant-design:plus-outlined',
      onClick: handleAdd.bind(null),
      auth: ['admin', 'biz:user:save'],
    },
  ];

  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: listExcludeByShopId,
    columns: columns,
  });
  // 注册模态框
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    shopId.value = data.record.id;
  });

  const onClose = () => {
    closeDrawer();
  };

  const onSubmit = () => {
    shopAssistantSave({
      shopId: shopId.value,
      userIds: checkedKeys.value,
      assistantType: 2,
    }).then((res) => {
      console.log(res);
      emit('success');
      onClose();
    });
  };

  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增店铺用户' });
  };

  // 添加、编辑成功回调
  const handleSuccess = () => {
    clearSelectedRowKeys();
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
    return { ...params, shopId: shopId.value };
  };
</script>
<style scoped lang="less">
  .common-form {
    :deep(.ant-row) {
      justify-content: space-between;
    }
  }
  .drawer-form-wrap {
    padding: 12px;
  }
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
    z-index: 1;
  }
</style>
