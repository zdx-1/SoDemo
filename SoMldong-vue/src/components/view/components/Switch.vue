<template>
  <Switch :disabled="true" v-model:checked="value" v-bind="column.componentProps || {}" />
</template>
<script setup lang="ts" name="Switch">
  import { Switch } from 'ant-design-vue';
  import { PropType } from 'vue';
  import { BasicColumn } from '../../Table';
  import { ref, watchEffect } from 'vue';
  const props = defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    column: {
      // 列定义
      type: Object as PropType<BasicColumn>,
    },
  });
  const value = ref(props.data?.text);
  watchEffect(() => {
    value.value = props.data?.text;
  });
</script>
<style lang="less" scoped></style>
