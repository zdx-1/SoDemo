<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="searchFormSchemas.length > 0"
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
              auth: ['admin', 'biz:demo:save'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '导出',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:export-outlined',
              onClick: handleExport.bind(null),
              auth: ['admin', 'biz:demo:export'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'biz:demo:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              label: '详情',
              onClick: handleDetail.bind(null, record),
              auth: ['admin', 'biz:demo:detail'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'biz:demo:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'biz:demo:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><DemoAdd @register="registerAddModal" @success="handleSuccess" /><DemoDetail
      @register="registerDetailModal"
    /><DemoExportDrawer @register="registerExportDrawer" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { demoDel, demoPage } from '/@/api/biz/demo';
  import DemoAdd from './add.vue';
  import DemoDetail from './detail.vue';
  import DemoExportDrawer from './exportDrawer.vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { tableColumns as columns, searchFormSchemas, async } from './schemas';
  import { useTableSchema } from '/@/hooks/web/useSchema';
  import './components/view/index';
  // 注册表格
  const [registerTable, tableMethods] = useTable({
    api: demoPage,
    columns: columns,
  });
  if (async !== false) {
    useTableSchema({
      tableName: 'biz_demo',
      tableRef: tableMethods,
    });
  }
  const { reload, clearSelectedRowKeys } = tableMethods;
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
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerExportDrawer, { openDrawer: openExportDrawer }] = useDrawer();
  /* eslint-disable */
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
      },
    });
    setModalProps({ title: '新增演示' });
  };
  /* eslint-disable */
  // 打开详情表单
  const handleDetail = (record) => {
    openDetailModal(true, {
      record,
    });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑演示' });
  };
  // 导出处理
  const handleExport = () => {
    openExportDrawer(true, {
      searchInfo: tableMethods?.getForm()?.getFieldsValue(),
    })
  }
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
      checkedKeys.value = [];
    } else {
      ids.push(...unref(checkedKeys));
    }
    demoDel({
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
    };
  };
</script>

<style lang="less" scoped></style>
