<template>
  <BasicDrawer
    title="授权菜单"
    width="60%"
    @register="register"
    :showFooter="true"
    @ok="handleOk"
    destroyOnClose
  >
    <BasicTree
      ref="treeRef"
      checkable
      @check="handleCheck"
      v-model:checkedKeys="checkedKeys"
      :treeData="treeData"
    />
  </BasicDrawer>
</template>
<script setup>
  import { ref, nextTick } from 'vue';
  import { useDrawer, BasicDrawer } from '/@/components/Drawer';
  import { sysMenuList } from '/@/api/sys/menu';
  import { roleMenuIds, saveRoleMenu } from '/@/api/sys/rbac';
  import { TreeNode } from '/@/utils/tree';
  import { BasicTree } from '/@/components/Tree';
  import { message } from 'ant-design-vue';
  const props = defineProps({
    appCode: {
      type: String,
    },
  });
  const currentRecord = ref();
  const treeRef = ref();
  const treeData = ref([]);
  // 勾选的key
  const checkedKeys = ref([]);
  // 提交的勾选的key,会进行特殊处理，包含半勾状态的父节点halfCheckedKeys
  const submitCheckedKeys = ref([]);
  // 所有叶子节点key
  const leafKeys = ref([]);
  const [register, { openDrawer }] = useDrawer();
  /**
   * 生成树时，同时进行行处理
   * @param node
   */
  const rowHandle = (node) => {
    node.title = `${node.name}(${node.code})`;
    node.key = node.id;
    if (!node.children) {
      leafKeys.value.push(node.id);
    }
  };
  /**
   * 点击复选框触发处理
   * @param mCheckedKeys
   */
  const handleCheck = (mCheckedKeys, e) => {
    checkedKeys.value = mCheckedKeys;
    // 提交的时候需要将半选的父节点也提交上
    submitCheckedKeys.value = [...mCheckedKeys, ...e.halfCheckedKeys];
  };
  /**
   * api请求成功回调
   */
  const handleFetchSuccess = () => {
    roleMenuIds({
      roleId: currentRecord.value.id,
      appCode: props.appCode,
    }).then((res) => {
      // 设置的勾选节点只能为叶子节点
      checkedKeys.value = res.filter((item) => {
        return leafKeys.value.includes(item);
      });
      submitCheckedKeys.value = res;
    });
  };
  /**
   * 处理提交保存
   */
  const handleOk = () => {
    const roleMenus = submitCheckedKeys.value.map((item) => {
      return {
        roleId: currentRecord.value.id,
        menuId: item,
      };
    });
    if (!roleMenus.length) {
      roleMenus.push({
        roleId: currentRecord.value.id,
      });
    }
    saveRoleMenu(roleMenus).then(() => {
      message.success('保存成功');
    });
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      openDrawer();
      sysMenuList({
        m_EQ_appCode: props.appCode,
      }).then((res) => {
        treeData.value = new TreeNode({
          rowHandle: rowHandle,
        }).build(res, '0');
        nextTick(() => {
          handleFetchSuccess();
        });
      });
    },
  });
</script>
