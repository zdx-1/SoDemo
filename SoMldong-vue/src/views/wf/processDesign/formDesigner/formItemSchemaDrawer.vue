<template>
  <BasicDrawer
    width="30%"
    title="表单项"
    @register="registerDrawer"
    :showFooter="true"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm">
      <template #rulesSlot="{ model, field }">
        <a-checkbox v-model:checked="model[field][0].required">必填</a-checkbox>
        <a-input v-model:value="model[field][0].message" placeholder="必填校验提示信息" />
      </template>
      <template #defaultValueSlot="{ model, field }">
        <a-input v-model:value="model[field]" :allowClear="true" placeholder="请输入" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script setup>
  import { computed, nextTick } from 'vue';
  import { BasicDrawer, useDrawer } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useComponentRegister } from '/@/components/Form/src/hooks/useComponentRegister';
  import InputTextAreaAutoSize from './components/InputTextAreaAutoSize.vue';
  import MSelectOptions from './components/MSelectOptions.vue';
  import TreeSelectReplaceFields from './components/TreeSelectReplaceFields.vue';
  useComponentRegister('InputTextAreaAutoSize', InputTextAreaAutoSize);
  useComponentRegister('MSelectOptions', MSelectOptions);
  useComponentRegister('TreeSelectReplaceFields', TreeSelectReplaceFields);
  const componentList = [
    {
      label: '文本输入',
      value: 'Input',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
      ],
    },
    {
      label: '密码输入',
      value: 'InputPassword',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
      ],
    },
    {
      label: '数字输入',
      value: 'InputNumber',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'min',
          label: '最小值',
          component: 'InputNumber',
        },
        {
          field: 'max',
          label: '最大值',
          component: 'InputNumber',
        },
        {
          field: 'step',
          label: '每次改变步数',
          component: 'InputNumber',
        },
      ],
    },
    {
      label: '多行文本',
      value: 'InputTextArea',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'autoSize',
          label: '高度',
          component: 'InputTextAreaAutoSize',
        },
        {
          field: 'showCount',
          // label: '是否展示字数',
          component: 'Checkbox',
          renderComponentContent: '展示字数',
        },
      ],
    },
    {
      label: '下拉选择',
      value: 'Select',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'options',
          label: '选项配置',
          component: 'MSelectOptions',
        },
      ],
    },
    {
      label: '单选组',
      value: 'RadioGroup',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'options',
          label: '选项配置',
          component: 'MSelectOptions',
        },
      ],
    },
    {
      label: '单选按钮组',
      value: 'RadioButtonGroup',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'options',
          label: '选项配置',
          component: 'MSelectOptions',
        },
      ],
    },
    {
      label: '复选组',
      value: 'CheckboxGroup',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'options',
          label: '选项配置',
          component: 'MSelectOptions',
        },
      ],
    },
    {
      label: '远程下拉',
      value: 'ApiSelect',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'numberToString',
          component: 'Checkbox',
          renderComponentContent: '是否将number值转化为string',
        },
        {
          field: 'api',
          label: '接口地址',
          component: 'Input',
        },
        {
          field: 'resultField',
          label: '接口返回的字段，如果接口返回数组，可以不填。支持x.x.x格式',
          component: 'Input',
        },
        {
          field: 'labelField',
          label: '下拉数组项内label显示文本的字段，支持x.x.x格式',
          component: 'Input',
        },
        {
          field: 'valueField',
          label: '下拉数组项内value实际值的字段，支持x.x.x格式',
          component: 'Input',
        },
        {
          field: 'immediate',
          component: 'Checkbox',
          renderComponentContent: '是否立即请求接口，否则将在第一次点击时候触发请求',
          defaultValue: true,
        },
      ],
    },
    {
      label: '远程树',
      value: 'ApiTreeSelect',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
        {
          field: 'api',
          label: '接口地址',
          component: 'Input',
        },
        {
          field: 'resultField',
          label: '接口返回的字段，如果接口返回数组，可以不填。支持x.x.x格式',
          component: 'Input',
        },
        {
          field: 'replaceFields',
          label: '替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段',
          component: 'TreeSelectReplaceFields',
        },
        {
          field: 'immediate',
          component: 'Checkbox',
          renderComponentContent: '是否立即请求接口，否则将在第一次点击时候触发请求',
          defaultValue: true,
        },
      ],
    },
    {
      label: '附件上传',
      value: 'Upload',
      props: [
        {
          field: 'placeholder',
          label: '占位内容',
          component: 'Input',
        },
      ],
    },
  ];
  const componentListFlat = computed(() => {
    const res = [];
    componentList.forEach((component) => {
      component?.props.forEach((prop) => {
        res.push({
          ...prop,
          field: `componentProps_${prop.field}`,
          ifShow({ values }) {
            return component.value == values.component;
          },
        });
      });
    });
    return res;
  });
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
        field: 'field',
        label: '字段',
        component: 'Input',
        rules: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        componentProps: {
          placeholder: '请输入字段',
        },
      },
      {
        field: 'label',
        label: '标签',
        component: 'Input',
        rules: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        componentProps: {
          placeholder: '请输入标签',
        },
      },
      {
        field: 'component',
        label: '组件类型',
        component: 'Select',
        defaultValue: 'Input',
        componentProps: {
          options: componentList,
        },
      },
      ...componentListFlat.value,
      {
        field: 'defaultValue',
        label: '默认值',
        component: 'Input',
        slot: 'defaultValueSlot',
      },
      {
        field: 'rules',
        label: '校验',
        defaultValue: [{ required: false }],
        component: 'Checkbox',
        slot: 'rulesSlot',
      },
    ],
  });
  /**
   * 重写获取表单值方法
   */
  const _getFieldsValue = () => {
    const values = getFieldsValue();
    const res = {
      componentProps: {},
    };
    Object.keys(values).forEach((key) => {
      if (key.startsWith('componentProps_')) {
        res.componentProps[key.replace('componentProps_', '')] = values[key];
      } else {
        res[key] = values[key];
      }
    });
    return res;
  };
  /**
   * 重写设置表单值方法
   * @param {*} values
   */
  const _setFieldsValue = (values) => {
    const newValues = {
      ...values,
    };
    if (values.componentProps) {
      Object.keys(values.componentProps).forEach((key) => {
        newValues['componentProps_' + key] = values.componentProps[key];
      });
    }
    return setFieldsValue(newValues);
  };
  const handleOk = () => {
    validate().then(() => {
      emits('ok', _getFieldsValue());
      drawerAction.closeDrawer();
    });
  };
  defineExpose({
    ...drawerAction,
    show(record) {
      if (record?.field) {
        drawerAction.setDrawerProps({
          title: '编辑表单项',
        });
      } else {
        drawerAction.setDrawerProps({
          title: '新增表单项',
        });
      }
      drawerAction.openDrawer();
      nextTick(() => {
        _setFieldsValue(record);
      });
    },
  });
</script>
