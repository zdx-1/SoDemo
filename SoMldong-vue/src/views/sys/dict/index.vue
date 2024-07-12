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
              auth: ['admin', 'sys:dict:save'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '枚举字典',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:unordered-list-outlined',
              onClick: handleEnumDict.bind(null),
              auth: ['admin', 'sys:dict:enumDictList'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '自定义字典',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:unordered-list-outlined',
              onClick: handleCustomDict.bind(null),
              auth: ['admin', 'sys:dict:customDictList'], // 根据权限控制是否显示: 无权限，不显示
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
              auth: ['admin', 'sys:dict:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              auth: ['admin', 'sys:dict:update'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '字典项',
              onClick: openDictItem.bind(null, record),
              auth: ['admin', 'sys:dictItem:page'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'sys:dict:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><sysDictAdd @register="registerAddModal" @success="handleSuccess" />
    <dictItem ref="dictItemRef" />
    <EnumDict ref="enumDictRef" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { sysDictDel, sysDictPage } from '/@/api/sys/dict';
  import sysDictAdd from './add.vue';
  import dictItem from './dictItemWrap.vue';
  import EnumDict from './enumDict.vue';

  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  const dictItemRef = ref();
  const enumDictRef = ref();
  const columns = [
    // 列定义
    {
      title: '字典名称',
      dataIndex: 'name',
    },
    {
      title: '唯一编码',
      dataIndex: 'code',
    },
    {
      title: '分组编码',
      dataIndex: 'groupCode',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      width: '10%',
      component: 'ApiDict',
      componentProps: {
        code: 'sys_dict_data_type',
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
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
      field: 'm_LIKE_name',
      label: '字典名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入字典名称',
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
        placeholder: '请输入唯一编码',
      },
    },
    {
      field: 'm_EQ_enabled',
      label: '是否启用',
      component: 'ApiDict',
      componentProps: {
        code: 'yes_no',
        placeholder: '请选择是否启用',
      },
      colProps: {
        xl: 6,
        xxl: 6,
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: sysDictPage,
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
    setModalProps({ title: '新增字典' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑字典' });
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
    sysDictDel({
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
  // 打开字典项管理
  const openDictItem = (record) => {
    dictItemRef.value.show(record);
  };
  // 打开枚举字典
  const handleEnumDict = () => {
    enumDictRef.value.show();
  };
  // 打开自定义字典
  const handleCustomDict = () => {
    enumDictRef.value.show('custom');
  };
</script>

<style lang="less" scoped></style>
