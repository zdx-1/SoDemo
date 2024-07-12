<template>
  <BasicDrawer width="60%" @register="register" title="字典项管理" destroyOnClose>
    <DictItemIndex ref="dictItemIndexRef" :record="record" />
  </BasicDrawer>
</template>
<script setup>
  import { nextTick, ref, unref } from 'vue';
  import { useDrawer, BasicDrawer } from '/@/components/Drawer';
  import DictItemIndex from '../dictItem/index.vue';
  const [register, drawerAction] = useDrawer();
  const record = ref();
  const dictItemIndexRef = ref();
  defineExpose({
    ...drawerAction,
    show(mRecord) {
      record.value = mRecord;
      drawerAction.openDrawer();
      nextTick(() => {
        unref(dictItemIndexRef).reloadData(mRecord.id);
      });
    },
  });
</script>
