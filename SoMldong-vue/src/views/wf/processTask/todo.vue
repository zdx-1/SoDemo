<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      :rowSelection="null"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    >
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '办理',
              onClick: handleExecute.bind(null, record),
              auth: ['admin', 'wf:processTask:execute'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '委托',
              onClick: handleSurrogate.bind(null, record),
              auth: ['admin', 'wf:processTask:surrogate'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
        />
      </template>
    </BasicTable>
    <Detail @register="registerDetailDrawer" @success="handleSuccess" type="todo" />
    <Surrogate ref="surrogateRef" />
  </PageWrapper>
</template>

<script setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { wfProcessTaskTodoList } from '/@/api/wf/processTask';
  import Detail from './detail.vue';
  import Surrogate from './surrogate.vue';
  import { ref } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  const surrogateRef = ref();
  const columns = [
    // 列定义
    {
      title: '标题', // 系统自动生成
      dataIndex: ['instanceExt', 'autoGenTitle'],
    },
    {
      title: '摘要', // 表单提交的字段
      dataIndex: ['instanceExt', 'f_title'],
    },
    {
      title: '节点名称',
      dataIndex: 'displayName',
    },
    {
      title: '发起人',
      dataIndex: ['instanceExt', 'u_realName'],
    },
    {
      title: '发起时间',
      dataIndex: 'instanceCreateTime',
    },
    {
      title: '发起人所属部门',
      dataIndex: ['instanceExt', 'u_deptName'],
    },
    {
      title: '发起人职务',
      dataIndex: ['instanceExt', 'u_postName'],
    },
    {
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_t_LIKE_displayName',
      label: '节点名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入节点名称',
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload }] = useTable({
    api: wfProcessTaskTodoList,
    columns: columns,
  });
  // // 选中行id集合
  // const checkedKeys = ref([]);
  // // 多选处理
  // const rowSelection = {
  //   type: 'checkbox',
  //   onChange: (keys) => {
  //     checkedKeys.value = keys;
  //   },
  // };
  // 处理流程
  const handleExecute = (record) => {
    openDetailDrawer(true, {
      record,
    });
  };
  // 委办
  const handleSurrogate = (record) => {
    surrogateRef.value.show(record);
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
  // 提交成功刷新
  const handleSuccess = () => {
    reload();
  };
</script>

<style lang="less" scoped></style>
