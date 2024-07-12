<template>
  <PageWrapper>
    <SortableTable
      rowKey="id"
      :canRowDrag="canRowDrag"
      :showTableSetting="true"
      @register="registerTable"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      @row-drag-end="handleRowDragEnd"
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
              auth: ['admin', 'dev:schemaField:save'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '调整搜索/列表排序',
              type: 'default',
              size: 'middle',
              icon: 'ant-design:ordered-list-outlined',
              onClick: openUpdateKeys.bind(null),
              auth: ['admin', 'dev:schema:updateSearchFormKeys', 'dev:schema:updateListKeys'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'dev:schemaField:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'dev:schemaField:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </SortableTable
    ><DevSchemaFieldAdd
      @register="registerAddModal"
      @success="handleSuccess"
      :schemaId="schemaId"
    />
    <UpdateKeys @register="registerUpdateKeysModal" />
  </PageWrapper>
</template>

<script setup>
  import { computed } from 'vue';
  import { SortableTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import {
    devSchemaFieldDel,
    devSchemaFieldPage,
    schemaFieldUpdateSort,
  } from '/@/api/dev/schemaField';
  import DevSchemaFieldAdd from './add.vue';
  import UpdateKeys from './updateKeys.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const [registerUpdateKeysModal, { openModal: openUpdateKeysModal }] = useModal();

  const props = defineProps({
    immediate: {
      type: Boolean,
      default: true,
    },
    schemaId: {
      type: [String, Number],
    },
  });
  /* eslint-disable */
  const columns = [
    // 列定义
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '字段注释',
      dataIndex: 'remark',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      component: 'Input',
      componentProps: {
      },
      customRender(e){
        if(e.text == 'CustomComponent') {
          return `${e.record.ext[e.text+'_componentName']}`;
        }
        return `${e.record.component}`;
      }
    },
    {
      title: '允许为空',
      dataIndex: 'nullable',
      component: 'ApiDict',
      componentProps: {
        code: 'yes_no'
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
  // 判断是否有拖拽权限
  const canRowDrag = computed(()=>{
    const { hasPermission } = usePermission();
    return hasPermission(['admin','dev:schemaField:updateSort'])
  })
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: devSchemaFieldPage,
    columns: columns,
    immediate: props.immediate
  });
  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增模型字段' });
  };
  // 打开更新keys抽屉
  const openUpdateKeys = () => {
    openUpdateKeysModal(true, {
      record: {
        schemaId: props.schemaId
      }
    });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑模型字段' });
  };
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    devSchemaFieldDel({
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
      m_EQ_schemaId: props.schemaId,
      orderBy: 'sort asc, id asc'
    };
  };
  // 拖拽处理
  const handleRowDragEnd = (e) =>{
    if(e.oldIndex == e.newIndex) return
        schemaFieldUpdateSort({
          schemaId: props.schemaId,
          dragRowId: e.oldRecord?.id,
          hoverRowId: e.newRecord?.id,
        }).then(()=>{
          reload();
        })
  }
  defineExpose({
    reload
  })
</script>

<style lang="less" scoped></style>
