<template>
  <PageWrapper>
    <BasicTable
      :isTreeTable="true"
      :pagination="false"
      :showTableSetting="true"
      @register="registerTable"
    >
      <!--左上角按钮-->
      <template #tableTitle>
        <a-button type="primary" v-auth="['admin', 'sys:dept:save']" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增</a-button
        >
        <a-button
          style="margin-left: 8px"
          type="primary"
          :disabled="isExpand"
          @click="handleExpandAndCollapse"
        >
          <template #icon><MenuFoldOutlined /></template>
          展开</a-button
        >
        <a-button
          style="margin-left: 8px"
          type="primary"
          :disabled="!isExpand"
          @click="handleExpandAndCollapse"
        >
          <template #icon><MenuUnfoldOutlined /></template>
          折叠</a-button
        >
      </template>
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'sys:dept:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '添加下级',
              onClick: handleAdd.bind(null, record),
              auth: ['admin', 'sys:dept:save'], // 根据权限控制是否显示: 无权限，不显示
            },
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'sys:dept:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><DeptAdd @register="registerAddModal" @success="handleSuccess"
  /></PageWrapper>
</template>

<script setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import { sysDeptTree, sysDeptDel } from '/@/api/sys/dept';
  import DeptAdd from './add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  const columns = [
    // 列定义
    {
      title: '部门名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '唯一编码',
      dataIndex: 'code',
      align: 'left',
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
    api: sysDeptTree,
    columns: columns,
  });
  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增部门' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑部门' });
  };
  // 递归获取子元素id
  const getChildIds = (id, children) => {
    let arr = [];
    arr.push(id);
    if (children && children.length) {
      children.forEach((item) => {
        arr.push(...getChildIds(item.id, item.children));
      });
    }
    return arr;
  };
  // 删除
  const handleDelete = (record) => {
    const ids = getChildIds(record.id, record.children);
    sysDeptDel({
      ids: ids,
    }).then(() => {
      message.success('删除成功');
      reload();
    });
  };
  // 添加、编辑成功回调
  const handleSuccess = () => {
    reload();
  };
  // 是否展开
  let isExpand = ref(false);
  // 展开折叠处理
  const handleExpandAndCollapse = () => {
    if (isExpand.value) {
      collapseAll();
      isExpand.value = false;
    } else {
      expandAll();
      isExpand.value = true;
    }
  };
</script>

<style lang="less" scoped></style>
