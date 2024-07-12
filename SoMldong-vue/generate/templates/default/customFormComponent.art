<template>
  <div>
    <div><a-input v-model:value="mValue" /></div>
    <div>元数据中配置的组件参数：{{ params }}</div>
    <div>allowClear：{{ allowClear }}</div>
    <div>disabled：{{ disabled }}</div>
    <div>codeField：{{ codeField }}</div>
    <div>size：{{ size }}</div>
    <div>formValues：{{ formValues }}</div>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    value: {
      type: String,
    },
    params: {
      type: String,
    },
    allowClear: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    codeField: {
      type: String,
    },
    size: {
      type: String,
    },
    formValues: {
      type: Object,
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  const mValue = ref(props.value);
  watch(
    () => mValue.value,
    () => {
      emits('update:value', mValue.value);
      emits('change', mValue.value);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.value,
    (val) => {
      if (val !== undefined && val !== null) {
        mValue.value = val;
      }
    },
    { immediate: true },
  );
</script>
