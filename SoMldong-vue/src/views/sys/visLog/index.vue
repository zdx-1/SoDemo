<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    />
  </PageWrapper>
</template>

<script setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { visLogPage } from '/@/api/sys/visLog';
  const columns = [
    // 列定义
    {
      title: '登录账号',
      dataIndex: 'account',
    },
    {
      title: '访问类型',
      dataIndex: 'name',
    },
    {
      title: '是否成功',
      dataIndex: 'success',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '成功',
            value: 'Y',
          },
          {
            label: '失败',
            value: 'N',
          },
        ],
      },
    },
    {
      title: '备注',
      dataIndex: 'message',
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '访问时间',
      dataIndex: 'visTime',
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_EQ_account',
      label: '登录账号',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入登录账号',
      },
    },
    {
      field: 'm_EQ_visType',
      label: '访问类型',
      component: 'ApiDict',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        code: 'sys_vis_log_vis_type',
        placeholder: '请选择访问类型',
      },
    },
    {
      field: 'm_EQ_success',
      label: '是否成功',
      component: 'Select',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        options: [
          {
            label: '成功',
            value: 'Y',
          },
          {
            label: '失败',
            value: 'N',
          },
        ],
      },
    },
  ];
  // 注册表格
  const [registerTable, {}] = useTable({
    api: visLogPage,
    columns: columns,
  });
</script>

<style lang="less" scoped></style>
