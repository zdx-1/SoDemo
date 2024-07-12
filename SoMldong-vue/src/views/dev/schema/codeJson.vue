<template>
  <BasicModal
    width="60%"
    :height="500"
    v-bind="$attrs"
    @register="registerModal"
    okText="复制"
    cancelText="取消"
    title="元数据"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <JsonPreview :data="jsonObject" />
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { ref } from 'vue';
  import { getByTableName } from '/@/api/dev/schema';
  import { message } from 'ant-design-vue';
  const jsonObject = ref({});
  // 声明Emits
  defineEmits(['register']);
  // 注册模态框
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (typeof data.record === 'object') {
      getByTableName({
        tableName: data.record.tableName,
      }).then((res) => {
        jsonObject.value = res;
      });
    }
  });
  // 关闭模态框事件
  const handleCancel = () => {};
  // 复制元数据
  const handleOk = () => {
    let str = JSON.stringify(jsonObject.value, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      message.success('复制成功！');
    });
    closeModal();
  };
</script>
