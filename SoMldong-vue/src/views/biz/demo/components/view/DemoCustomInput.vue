<template>
  {{ data?.text }}
</template>
<script setup>
  defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    column: {
      // 列定义
      type: Object,
    },
  });
</script>
<style lang="less" scoped></style>
