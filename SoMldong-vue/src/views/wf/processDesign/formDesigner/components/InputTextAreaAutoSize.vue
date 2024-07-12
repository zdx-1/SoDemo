<template>
  <div>
    <a-checkbox v-model:checked="mValue">自适应高度</a-checkbox>
    <a-input-number
      :min="1"
      v-if="!mValue"
      v-model:value="maxMinRows.minRows"
      placeholder="最小行"
    />
    <a-input-number
      :min="1"
      v-if="!mValue"
      v-model:value="maxMinRows.maxRows"
      placeholder="最大行"
    />
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    value: {
      type: [Boolean, Object],
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  const mValue = ref(props.value === true ? true : false);
  const maxMinRows = ref({ minRows: props.value?.minRows, maxRows: props.value?.maxRows });

  watch(
    () => mValue.value,
    () => {
      if (mValue.value) {
        emits('update:value', true);
        emits('change', true);
      } else {
        if (maxMinRows.value.minRows && maxMinRows.value.maxRows) {
          emits('update:value', maxMinRows.value);
          emits('change', maxMinRows.value);
        } else {
          emits('update:value', false);
          emits('change', false);
        }
      }
    },
  );
  watch(
    () => maxMinRows.value,
    () => {
      if (maxMinRows.value.minRows && maxMinRows.value.maxRows) {
        emits('update:value', maxMinRows.value);
        emits('change', maxMinRows.value);
      } else {
        emits('update:value', false);
        emits('change', false);
      }
    },
    { deep: true },
  );
</script>
