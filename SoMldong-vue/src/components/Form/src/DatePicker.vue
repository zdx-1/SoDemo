<template>
  <YearPicker v-if="mode == 'year'" />
  <a-month-picker v-else-if="mode == 'month'" />
  <a-date-picker v-else />
</template>
<script setup>
  import YearPicker from './components/CustomComponent/YearPicker.vue';
  defineProps({
    mode: {
      type: String,
    },
  });
</script>
