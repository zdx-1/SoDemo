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
              auth: ['admin', 'dev:schema:save'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '导入',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:import-outlined',
              onClick: handleImportTable.bind(null),
              auth: ['admin', 'dev:schema:importTable'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'dev:schema:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              label: '元数据',
              onClick: handleOpenJsonCode.bind(null, record),
              auth: ['admin', 'dev:schema:getByTableName'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '模型字段',
              onClick: handleOpenSchemaFieldWrap.bind(null, record),
              auth: ['admin', 'dev:schemaField:page'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'dev:schema:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '预览表单',
              onClick: handlePreviewForm.bind(null, record),
              auth: ['admin', 'dev:schema:getByTableName'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'dev:schema:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><DevSchemaAdd @register="registerAddModal" @success="handleSuccess" /><ImportDbTable
      @register="registerImportTableModal"
      @success="handleSuccess"
    />
    <CodeJson @register="registerCodeJsonModal" />
    <SchemaFieldWrap @register="registerSchemaFieldWrapDrawer" />
    <PreviewForm @register="registerPreviewFormModal" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { devSchemaDel, devSchemaPage } from '/@/api/dev/schema';
  import DevSchemaAdd from './add.vue';
  import ImportDbTable from './importDbTable.vue';
  import CodeJson from './codeJson.vue';
  import SchemaFieldWrap from './schemaFieldWrap.vue';
  import PreviewForm from './previewForm.vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  /* eslint-disable */
  const columns = [
    // 列定义
    {
      title: '所属分组',
      dataIndex: 'schemaGroupId',
      component: 'ApiSelect',
      componentProps: {
        api: "/dev/schemaGroup/select",
      },
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '表注释',
      dataIndex: 'remark',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '表类型',
      dataIndex: 'tableType',
      component: 'ApiDict',
      componentProps: {
        code: "dev_schema_table_type",
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
      field: 'm_LIKE_tableName',
      label: '表名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入表名称'
      },
    },
    {
      field: 'm_LIKE_remark',
      label: '表注释',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入表注释'
      },
    },
    {
      field: 'm_IN_tableType',
      label: '表类型',
      component: 'ApiDict',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        code: "dev_schema_table_type",
        placeholder: '请输入表类型',
        mode: 'tags'
      },
    },
  ];
  /* eslint-disable */
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: devSchemaPage,
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
    setModalProps({ title: '新增数据模型' });
  };
  const [registerImportTableModal, { openModal: openImportTable }] = useModal();
  const [ registerCodeJsonModal, { openModal : openCodeJson }] = useModal();
  const [ registerSchemaFieldWrapDrawer, { openDrawer : openSchemaFieldWrapDrawer }] = useDrawer();
  const [ registerPreviewFormModal, { openModal : openPreviewForm }] = useModal();

  // 打开导入表弹窗
  const handleImportTable = (record) => {
    openImportTable(true, {
      record,
    });
  };
   // 打开元数据弹窗
   const handleOpenJsonCode = (record) => {
    openCodeJson(true, {
      record,
    });
  };
  // 打开预览表单
  const handlePreviewForm = (record) =>{
    openPreviewForm(true, {
      record
    })
  }
  // 打开模型字段管理
  const handleOpenSchemaFieldWrap = (record) => {
    openSchemaFieldWrapDrawer(true, {
      record,
    });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑数据模型' });
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
    devSchemaDel({
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
    
    return {
      ...params,
      orderBy: 'sort asc'
    };
  };
</script>

<style lang="less" scoped></style>
