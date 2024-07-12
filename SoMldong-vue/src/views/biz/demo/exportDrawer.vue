<template>
  <BasicDrawer
    width="30%"
    v-bind="$attrs"
    @register="registerDrawer"
    title="导出演示"
    :destroyOnClose="true"
    okText="导出"
    cancelText="取消"
    @ok="handleOk"
    :showFooter="true"
  >
    <SortableTable rowKey="key" @register="registerTable">
      <template #tableTitle>
        <div>导出范围：</div>
        <div>
          <a-radio-group v-model:value="exportScope" size="large">
            <a-radio value="1">全部数据</a-radio>
            <a-radio value="2">当前筛选结果</a-radio>
          </a-radio-group>
        </div>
      </template>
    </SortableTable>
  </BasicDrawer>
</template>
<script setup>
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { SortableTable, useTable } from '/@/components/Table';
  import { tableExportColumns, async } from './schemas';
  import { demoGenerateExportUrl } from '/@/api/biz/demo';
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useTableExportSchema } from '/@/hooks/web/useSchema';
  const searchInfo = ref();
  // 注册模态框
  const [registerDrawer, {}] = useDrawerInner((data) => {
    searchInfo.value = data.searchInfo;
    if (async !== false) {
      useTableExportSchema({
        tableName: 'biz_demo',
        tableRef: tableMethods,
      });
    }
  });
  const exportScope = ref('1');
  // 选中行id集合
  const checkedKeys = ref(tableExportColumns.map((item) => item.key));
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: checkedKeys,
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };
  const [registerTable, tableMethods] = useTable({
    showIndexColumn: false,
    columns: [{ title: '列名', dataIndex: 'name' }],
    dataSource: tableExportColumns,
    rowSelection: rowSelection,
    pagination: false,
  });
  const handleOk = () => {
    if (!checkedKeys.value.length) {
      message.error('请至少选择一个列');
      return;
    }
    demoGenerateExportUrl({
      baseUrl:
        window.location.protocol + '//' + window.location.host + import.meta.env.VITE_GLOB_API_URL,
      excelName: '演示',
      exportScope: exportScope.value,
      excelColumns: tableExportColumns.filter((item) => checkedKeys.value.includes(item.key)),
      ...searchInfo.value,
    }).then((res) => {
      downloadByUrl(res);
    });
  };
</script>
