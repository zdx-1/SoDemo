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
              auth: ['admin', 'dev:schemaGroup:save'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'dev:schemaGroup:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              auth: ['admin', 'dev:schemaGroup:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'dev:schemaGroup:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><devSchemaGroupAdd @register="registerAddModal" @success="handleSuccess"
  /></PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { devSchemaGroupDel, devSchemaGroupPage } from '/@/api/dev/schemaGroup';
  import devSchemaGroupAdd from './add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  /* eslint-disable */
  const columns = [
    // 列定义
    {
      title: '分组名称',
      dataIndex: 'name',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '唯一编码',
      dataIndex: 'code',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      component: 'IconPicker',
      componentProps: {
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      component: 'Input',
      componentProps: {
        type: "number",
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      component: 'InputTextArea',
      componentProps: {
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      component: 'Input',
      componentProps: {
      },
    },
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  /* eslint-disable */
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_LIKE_name',
      label: '分组名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
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
      },
    },
  ];
  /* eslint-disable */
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: devSchemaGroupPage,
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
    setModalProps({ title: '新增模型分组' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑模型分组' });
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
    devSchemaGroupDel({
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
    return params;
  };
</script>

<style lang="less" scoped></style>
