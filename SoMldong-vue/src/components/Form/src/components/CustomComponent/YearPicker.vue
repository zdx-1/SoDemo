<template>
  <a-date-picker
    v-model:value="datePickerValue"
    :open="open"
    v-bind="{
      mode: 'year',
      format,
      valueFormat,
      ...$attrs,
    }"
    @openChange="openChange"
    @panelChange="panelChange"
  />
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    value: {
      type: [String, Number],
    },
    format: {
      type: String,
      default: 'YYYY',
    },
    valueFormat: {
      type: String,
      default: 'YYYY',
    },
  });
  const datePickerValue = ref(props.value);
  const open = ref(false);
  const emits = defineEmits(['update:value', 'change']);
  const openChange = (status) => {
    if (status) {
      open.value = true;
    } else {
      open.value = false;
    }
  };
  const panelChange = (value) => {
    datePickerValue.value = String(value.year());
    emits('update:value', datePickerValue.value);
    emits('change', datePickerValue.value);
    open.value = false;
  };
  //监听value变化
  watch(
    () => props.value,
    (val) => {
      datePickerValue.value = val;
    },
    { immediate: true },
  );
</script>
