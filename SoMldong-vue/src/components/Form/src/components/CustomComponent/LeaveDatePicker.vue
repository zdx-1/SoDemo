<template>
  <div class="my-comp">
    <a-date-picker v-model:value="datePickerValue" v-bind="$attrs" />
    <a-select
      style="width: 100px; margin-left: 4px"
      v-model:value="selectValue"
      v-bind="$attrs"
      :options="[
        { label: '上午', value: 'am' },
        { label: '下午', value: 'pm' },
      ]"
    />
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const datePickerValue = ref();
  const selectValue = ref();
  const props = defineProps({
    value: {
      type: [Array], // ['2023-01-01', 'am']、['2023-01-01', 'pm']
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  watch(
    () => datePickerValue.value,
    () => {
      emits('update:value', [datePickerValue.value, selectValue.value]);
      emits('change', [datePickerValue.value, selectValue.value]);
    },
    {
      deep: true,
    },
  );
  watch(
    () => selectValue.value,
    () => {
      emits('update:value', [datePickerValue.value, selectValue.value]);
      emits('change', [datePickerValue.value, selectValue.value]);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.value,
    () => {
      if (Array.isArray(props.value) && props.value.length == 2) {
        datePickerValue.value = props.value[0];
        selectValue.value = props.value[1];
      }
    },
    {
      deep: true,
    },
  );
</script>
