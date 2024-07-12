<template>
  <PageList
    :api="requestData"
    :value="data?.text"
    type="view"
    :params="{
      includeType: 2,
      includeIds: Array.isArray(data?.text) ? data?.text : data?.text && data?.text.split(','),
      ...column?.componentProps?.params,
    }"
    :replaceFields="{
      label: 'label',
      children: 'children',
      value: 'value',
    }"
  />
</template>
<script setup lang="ts" name="ApiSelect">
  import { PropType } from 'vue';
  import { BasicColumn } from '../../Table';
  import PageList from '/@/components/PageList/index.vue';
  import { defHttp } from '/@/utils/http/axios';
  const props = defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    api: {
      type: String,
    },
    column: {
      // 列定义
      type: Object as PropType<BasicColumn>,
    },
  });
  const requestData = (params) => {
    return defHttp.post({ url: props.api || props.column?.componentProps?.api, params });
  };
</script>
<style lang="less" scoped></style>
