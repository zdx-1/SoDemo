<template>
  <div>
    <a-row>
      <a-col :span="4">title</a-col>
      <a-col :span="20"><a-input v-model:value="mValue.title" placeholder="请输入title" /></a-col>
    </a-row>
    <a-row>
      <a-col :span="4">value</a-col>
      <a-col :span="20"><a-input v-model:value="mValue.value" placeholder="请输入value" /></a-col>
    </a-row>
    <a-row>
      <a-col :span="4">key</a-col>
      <a-col :span="20"><a-input v-model:value="mValue.key" placeholder="请输入key" /></a-col>
    </a-row>
    <a-row>
      <a-col :span="4">children</a-col>
      <a-col :span="20"
        ><a-input v-model:value="mValue.children" placeholder="请输入children"
      /></a-col>
    </a-row>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    value: {
      type: [Object],
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  const mValue = ref(props.value || {});
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
