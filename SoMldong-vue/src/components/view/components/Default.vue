<template>
  {{ data?.text }}
</template>
<script setup lang="ts" name="Default">
  import { PropType } from 'vue';
  import { BasicColumn } from '../../Table';
  defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    column: {
      // 列定义
      type: Object as PropType<BasicColumn>,
    },
  });
</script>
<style lang="less" scoped></style>
