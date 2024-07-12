<template>
  <div v-if="data?.text" v-html="data?.text"></div>
  <div v-else>-</div>
</template>
<script setup lang="ts" name="Editor">
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
