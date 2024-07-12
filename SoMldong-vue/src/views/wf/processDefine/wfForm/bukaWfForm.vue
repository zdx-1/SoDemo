<template>
  <a-card title="补卡审批单">
    <BasicForm @register="registerForm" v-bind="$attrs" />
  </a-card>
</template>
<script setup name="bukaWfForm|补卡表单">
  import { BasicForm, useForm } from '/@/components/Form';
  // 表单元数据配置
  const schemas = [
    {
      field: 'f_time',
      label: '补卡时间',
      component: 'DatePicker',
      rules: [{ required: true, message: '请选择补卡时间', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'f_title',
      label: '补卡原因',
      component: 'InputTextArea',
      rules: [{ required: true, message: '请选择补卡原因', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入补卡原因',
      },
    },
    {
      field: 'f_attachment',
      label: '上传附件',
      component: 'Upload',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {},
    },
  ];
  // 注册表单
  const [registerForm, formAction] = useForm({
    labelWidth: 100,
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  defineExpose({
    ...formAction,
  });
</script>
