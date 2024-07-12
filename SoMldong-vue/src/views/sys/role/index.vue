<template>
  <PageWrapper>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in menuAppList" :key="item.value" :tab="item.label">
        <MenuList :appCode="item.value" />
      </a-tab-pane>
    </a-tabs>
  </PageWrapper>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import MenuList from './list.vue';
  import { sysMenuAppList } from '/@/api/sys/menu';
  const menuAppList = ref([]);
  const activeKey = ref((import.meta.env.VITE_APP_CODE || 'platform').toString());
  onMounted(() => {
    sysMenuAppList({}).then((res) => {
      menuAppList.value = res;
    });
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-scroll) {
    background: white;
  }
</style>
