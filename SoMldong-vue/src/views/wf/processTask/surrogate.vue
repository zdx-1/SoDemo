<template>
  <SelectUserModal
    title="请选择代理人"
    ref="selectUserModalRef"
    width="80%"
    :canFullscreen="true"
    :defaultFullscreen="false"
    @ok="handleOk"
  />
</template>
<script setup>
  import { ref } from 'vue';
  import { surrogate } from '/@/api/wf/processTask';
  import { message } from 'ant-design-vue';
  import SelectUserModal from '/@/views/sys/user/selectUserModal.vue';
  defineEmits(['register']);
  let currentRecord = ref({}); // 当前记录
  const selectUserModalRef = ref();
  /**
   * 确定
   */
  const handleOk = (data) => {
    if (!data || !data.length) {
      message.error('代理人不能为空！');
      return;
    }
    surrogate({
      processTaskId: currentRecord.value.id,
      actorIds: data,
    }).then(() => {
      message.success('提交成功');
      selectUserModalRef.value.closeModal();
    });
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      selectUserModalRef.value.show(record);
    },
  });
</script>
<style lang="less" scoped></style>
