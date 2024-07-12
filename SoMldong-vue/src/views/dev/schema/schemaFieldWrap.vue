<template>
  <BasicDrawer title="模型字段管理" width="60%" v-bind="$attrs" @register="registerDrawer">
    <SchemaField :immediate="false" ref="schemaFieldRef" :schemaId="schemaId" />
  </BasicDrawer>
</template>
<script setup>
  import { useDrawerInner, BasicDrawer } from '/@/components/Drawer';
  import SchemaField from '../schemaField/index.vue';
  import { nextTick, ref } from 'vue';
  const schemaFieldRef = ref(null);
  const schemaId = ref();
  // 声明Emits
  defineEmits(['register']);
  // 注册抽屉
  const [registerDrawer, {}] = useDrawerInner(async (data) => {
    if (typeof data.record === 'object') {
      schemaId.value = data.record.id;
      nextTick(() => {
        schemaFieldRef.value?.reload();
      });
    }
  });
</script>
