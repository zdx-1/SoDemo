<template>
  {{ mText ? mText : '-' }}
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { findNodeById } from '/@/utils/tree';
  const props = defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    column: {
      // 列定义
      type: Object,
    },
    api: {
      type: String,
    },
  });
  const mText = ref(props.data?.text);
  const treeData = ref([]);
  const requestData = (params) => {
    return defHttp.post({ url: props.api || props.column?.componentProps?.api, params });
  };
  onMounted(() => {
    if (props.column?.componentProps?.viewLabelKey) {
      // 如果存在回显的key，则直接使用，不请求接口
      mText.value = props.data?.record?.[props.column?.componentProps?.viewLabelKey];
    } else {
      requestData({ ...props.column?.componentProps?.params }).then((res) => {
        treeData.value = res;
        if (props.data?.text) {
          mText.value = findNodeById(treeData.value, props.data?.text)?.name;
        }
      });
    }
  });
  watch(
    () => props.data?.text,
    (val) => {
      if (props.column?.componentProps?.viewLabelKey) {
        // 如果存在回显的key，则直接使用，不请求接口
        mText.value = props.data?.record?.[props.column?.componentProps?.viewLabelKey];
      } else {
        if (val) {
          mText.value = findNodeById(treeData.value, val)?.name;
        }
      }
    },
  );
</script>
<style lang="less" scoped></style>
