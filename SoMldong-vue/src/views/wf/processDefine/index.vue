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
              auth: ['admin', 'wf:processDefine:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              label: '查看',
              onClick: handlePreview.bind(null, record),
              auth: ['admin', 'wf:processDefine:detail'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '发起',
              disabled: record.state == 0,
              onClick: handleStartProcess.bind(null, record),
              auth: ['admin', 'wf:processDefine:startAndExecute'], // 根据权限控制是否显示: 有权限，会显示
            },
            {
              label: '启用',
              popConfirm: {
                title: '确定启用吗？',
                confirm: handleUpAndDown.bind(null, record),
              },
              ifShow() {
                return record.state == 0;
              },
              auth: ['admin', 'wf:processDefine:upAndDown'], // 根据权限控制是否显示: 有权限，会显示
            },
            {
              label: '禁用',
              popConfirm: {
                title: '确定禁用吗？',
                confirm: handleUpAndDown.bind(null, record),
              },
              ifShow() {
                return record.state == 1;
              },
              auth: ['admin', 'wf:processDefine:upAndDown'], // 根据权限控制是否显示: 有权限，会显示
            },
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'wf:processDefine:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template>
    </BasicTable>
    <Preview @register="registerPreviewModal" @success="handlePreviewSaveSuccess" />
    <StartProcess @register="registerStartProcessDrawer" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import {
    wfProcessDefineDel,
    wfProcessDefinePage,
    wfProcessDefineUpAndDown,
  } from '/@/api/wf/processDefine';
  import Preview from './preview.vue';
  import StartProcess from './startProcess.vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  const columns = [
    // 列定义
    {
      title: '显示名称',
      dataIndex: 'displayName',
    },
    {
      title: '唯一编码',
      dataIndex: 'name',
    },
    {
      title: '流程分类',
      dataIndex: 'type',
      component: 'ApiDict',
      componentProps: {
        code: 'wf_process_type',
        dataType: 'String',
      },
    },
    {
      title: '版本号',
      dataIndex: 'version',
    },
    {
      title: '状态',
      dataIndex: 'state',
      component: 'ApiDict',
      componentProps: {
        code: 'wf_process_define_state',
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
      field: 'm_LIKE_displayName',
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
      field: 'm_LIKE_name',
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
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: wfProcessDefinePage,
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
  const [registerPreviewModal, { openModal: openPreviewModel }] = useModal();
  const [registerStartProcessDrawer, { openDrawer: openStartProcessDrawer }] = useDrawer();
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
      checkedKeys.value = [];
    } else {
      ids.push(...unref(checkedKeys));
    }
    wfProcessDefineDel({
      ids: ids,
    }).then(() => {
      message.success('删除成功');
      clearSelectedRowKeys();
      reload();
    });
  };
  // 启用/禁用
  const handleUpAndDown = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    ids.push(...unref(checkedKeys));
    wfProcessDefineUpAndDown({
      ids: ids,
      opType: record.state == 1 ? 0 : 1,
    }).then(() => {
      message.success(`${record.state == 1 ? '禁用' : '启用'}成功`);
      clearSelectedRowKeys();
      reload();
    });
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
   * 打开流程预览
   * @param {} record
   */
  const handlePreview = (record) => {
    openPreviewModel(true, {
      record,
    });
  };
  // 流程设计保存成功，刷新列表
  const handlePreviewSaveSuccess = () => {
    reload();
  };
  /**
   * 打开发起流程
   * @param {} record
   */
  const handleStartProcess = (record) => {
    openStartProcessDrawer(true, {
      record,
    });
  };
</script>

<style lang="less" scoped></style>
