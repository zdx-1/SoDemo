<template>
  <BasicModal
    width="60%"
    :height="500"
    v-bind="$attrs"
    @register="registerModal"
    :footer="null"
    title="预览表单"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane key="form" tab="表单">
        <BasicForm @register="registerForm" />
      </a-tab-pane>
      <a-tab-pane key="details" tab="详情">
        <PreviewDetail :tableName="currentRecord.tableName" :detailData="detailData" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useFormSchema } from '/@/hooks/web/useSchema';
  import { BasicForm, useForm } from '/@/components/Form';
  import PreviewDetail from './previewDetail.vue';
  import { ref } from 'vue';
  let currentRecord = ref({}); // 当前记录
  const detailData = ref({});
  // 声明Emits
  defineEmits(['register']);
  const activeKey = ref('form');
  // 注册表单
  const [registerForm, formMethods] = useForm({
    labelWidth: 100,
    showResetButton: false,
    showSubmitButton: false,
    actionColOptions: {
      span: 24,
    },
  });
  // 注册模态框
  const [registerModal, {}] = useModalInner(async (data) => {
    activeKey.value = 'form';
    if (typeof data.record === 'object') {
      currentRecord.value = data.record;
      // 使用异步数据
      useFormSchema({
        tableName: data.record.tableName,
        formRef: formMethods,
      });
    }
  });
  const tabChange = () => {
    detailData.value = formMethods.getFieldsValue();
  };
  // 关闭模态框事件
  const handleCancel = () => {};
</script>
<style scoped lang="less">
  @import '/@/assets/styles/common-form.less';
</style>
