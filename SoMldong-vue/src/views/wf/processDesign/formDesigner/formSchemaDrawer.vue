<template>
  <BasicDrawer
    width="30%"
    title="表单属性"
    @register="registerDrawer"
    :showFooter="true"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script setup>
  import { nextTick, onMounted } from 'vue';
  import { BasicDrawer, useDrawer } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useComponentRegister } from '/@/components/Form/src/hooks/useComponentRegister';
  import GridInput from './components/GridInput.vue';
  const emits = defineEmits(['ok']);
  const [registerDrawer, drawerAction] = useDrawer();
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    showResetButton: false,
    showSubmitButton: false,
    actionColOptions: {
      span: 24,
    },
    schemas: [
      {
        field: 'title',
        label: '标题',
        component: 'Input',
        rules: [{ required: true, message: '请输入表单标题', trigger: 'blur' }],
        componentProps: {
          placeholder: '请输入表单标题',
        },
      },
      {
        field: 'layout',
        label: '表单布局',
        component: 'RadioButtonGroup',
        defaultValue: 'horizontal',
        componentProps: {
          options: [
            {
              label: '水平',
              value: 'horizontal',
            },
            {
              label: '垂直',
              value: 'vertical',
            },
            {
              label: '行内',
              value: 'inline',
            },
          ],
          onChange() {
            emits('ok', getFieldsValue());
          },
        },
      },
      {
        field: 'labelLayoutType',
        label: '标签布局（水平布局生效）',
        component: 'RadioButtonGroup',
        defaultValue: 'fix',
        componentProps: {
          options: [
            {
              label: '固定',
              value: 'fix',
            },
            {
              label: '栅格',
              value: 'grid',
            },
          ],
        },
      },
      {
        field: 'labelWidth',
        label: '标签宽度（px）',
        component: 'InputNumber',
        componentProps: {},
        ifShow({ values }) {
          return values.labelLayoutType == 'fix';
        },
      },
      {
        field: 'gridInput',
        component: 'GridInput',
        componentProps: {},
        ifShow({ values }) {
          return values.labelLayoutType == 'grid';
        },
      },
    ],
  });
  const handleOk = () => {
    validate().then(() => {
      emits('ok', getFieldsValue());
      drawerAction.closeDrawer();
    });
  };
  onMounted(() => {
    useComponentRegister('GridInput', GridInput);
  });
  defineExpose({
    ...drawerAction,
    show(formSchema) {
      drawerAction.openDrawer();
      nextTick(() => {
        setFieldsValue(formSchema);
      });
    },
  });
</script>
