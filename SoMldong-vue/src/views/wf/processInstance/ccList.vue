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
        <TableAction :actions="[]" :dropDownActions="[]">
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
              auth: ['admin', 'wf:processInstance:detail'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[]"
        />
      </template>
    </BasicTable>
    <Detail @register="registerDetailDrawer" />
  </PageWrapper>
</template>

<script setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { wfProcessInstanceCcPage } from '/@/api/wf/processInstance';
  import { useDrawer } from '/@/components/Drawer';
  import Detail from './detail.vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  const columns = [
    // 列定义
    {
      title: '标题',
      dataIndex: ['ext', 'autoGenTitle'],
    },
    {
      title: '摘要',
      dataIndex: ['ext', 'f_title'],
    },
    {
      title: '发起人',
      dataIndex: ['ext', 'u_realName'],
    },
    {
      title: '发起时间',
      dataIndex: 'createTime',
    },
    {
      title: '发起人所属部门',
      dataIndex: ['ext', 'u_deptName'],
    },
    {
      title: '发起人职务',
      dataIndex: ['ext', 'u_postName'],
    },
    {
      title: '定义名称',
      dataIndex: 'displayName',
    },
    {
      title: '定义版本',
      dataIndex: 'version',
    },
    {
      title: '状态',
      dataIndex: 'state',
      component: 'ApiDict',
      componentProps: {
        code: 'wf_process_instance_state',
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
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_pd_LIKE_displayName',
      label: '显示名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入显示名称',
      },
    },
    {
      field: 'm_pd_LIKE_name',
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
  ];
  // 注册表格
  const [registerTable, {}] = useTable({
    api: wfProcessInstanceCcPage,
    columns: columns,
  });
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
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
  /**
   * 打开流程详情
   * @param {} record
   */
  const handleDetail = (record) => {
    openDetailDrawer(true, {
      record,
    });
  };
</script>

<style lang="less" scoped></style>
