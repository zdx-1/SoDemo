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
              auth: ['admin', 'wf:processDesign:save'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'wf:processDesign:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              auth: ['admin', 'wf:processDesign:detail'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'wf:processDesign:update'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '设计',
              onClick: handleDesign.bind(null, record),
              auth: ['admin', 'wf:processDesign:updateDefine'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '表单设计',
              // disabled: record.jsonObject?.instanceUrl != 'schemaWfForm', // 元数据表单才能编辑
              auth: ['admin', 'wf:processDesign:updateDefine'], // 根据权限控制是否显示: 无权限，不显示
              onClick: handleOpenFormDesigner.bind(null, record),
            },
            {
              label: '部署',
              disabled: record.isDeployed == 1,
              popConfirm: {
                title: '部署会生成新的流程定义版本，确定部署吗？',
                confirm: handleDeploy.bind(null, record),
                disabled: record.isDeployed == 1,
              },
              auth: ['admin', 'wf:processDesign:deploy'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '重新部署',
              disabled: record.isDeployed == 1,
              popConfirm: {
                title: '重新部署会覆盖最新版流程定义，确定重新部署吗？',
                confirm: handleRedeploy.bind(null, record),
                disabled: record.isDeployed == 1,
              },
              auth: ['admin', 'wf:processDesign:redeploy'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'wf:processDesign:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><wfProcessDesignAdd @register="registerAddModal" @success="handleSuccess" />
    <Design @register="registerDesignModal" @success="handleDesignSaveSuccess" />
    <Preview @register="registerPreviewModal" />
    <FormDesigner ref="formDesignerRef" @success="handleDesignSaveSuccess" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import Preview from './preview.vue';
  import FormDesigner from './formDesigner/index.vue';
  import {
    wfProcessDesignDel,
    wfProcessDesignPage,
    wfProcessDesignDeploy,
    wfProcessDesignRedeploy,
  } from '/@/api/wf/processDesign';
  import wfProcessDesignAdd from './add.vue';
  import Design from './design.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  const formDesignerRef = ref();
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
      title: '是否已部署',
      dataIndex: 'isDeployed',
      width: '10%',
      component: 'ApiDict',
      componentProps: {
        code: 'yes_no',
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
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
    api: wfProcessDesignPage,
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
  const [registerDesignModal, { openModal: openDesignModel }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModel }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增流程设计' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑流程设计' });
  };
  /**
   * 打开流程设计预览
   * @param {} record
   */
  const handlePreview = (record) => {
    openPreviewModel(true, {
      record,
    });
  };
  /**
   * 打开表单设计
   * @param {*} record
   */
  const handleOpenFormDesigner = (record) => {
    formDesignerRef.value.show(record);
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
    wfProcessDesignDel({
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
  /**
   * 打开流程设计
   * @param {} record
   */
  const handleDesign = (record) => {
    openDesignModel(true, {
      record,
    });
  };
  // 流程设计保存成功，刷新列表
  const handleDesignSaveSuccess = () => {
    reload();
  };
  /**
   * 流程设计定义部署
   * @param {*} record
   */
  const handleDeploy = (record) => {
    wfProcessDesignDeploy({
      id: record.id,
    }).then(() => {
      message.success('部署成功');
      reload();
    });
  };
  /**
   * 流程设计定义重新部署
   * @param {*} record
   */
  const handleRedeploy = (record) => {
    wfProcessDesignRedeploy({
      id: record.id,
    }).then(() => {
      message.success('重新部署成功');
      reload();
    });
  };
</script>

<style lang="less" scoped></style>
