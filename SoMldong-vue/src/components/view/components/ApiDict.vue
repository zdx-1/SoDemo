<template> {{ cValue }}</template>
<script setup lang="ts" name="ApiDict">
  import { PropType, computed, onMounted, ref, watch } from 'vue';
  import { BasicColumn } from '../../Table';
  import { useDictStore } from '/@/store/modules/dict';
  const dictStore = useDictStore();
  const props = defineProps({
    dataType: {
      type: String,
    },
    data: {
      // 当前行数据
      type: Object,
    },
    code: {
      type: String,
    },
    column: {
      // 列定义
      type: Object as PropType<BasicColumn>,
    },
  });
  const mDataType = ref(props.dataType || props.column?.componentProps?.dataType);
  watch(
    () => props.dataType,
    () => {
      mDataType.value = props.dataType;
    },
  );
  const getCode = computed(() => {
    return props.column?.componentProps?.code || props.code;
  });
  // 请求
  const requestData = () => {
    dictStore.requestData(getCode.value, mDataType.value);
  };

  const cValue = computed(() => {
    let v = props.data?.text;
    const distData = dictStore.getDictData(getCode.value);
    distData?.forEach((item: any) => {
      if (item.value == v) {
        v = item.label;
      }
    });
    return v;
  });
  onMounted(() => {
    setTimeout(() => {
      requestData();
    }, 500);
  });
</script>
<style lang="less" scoped></style>
