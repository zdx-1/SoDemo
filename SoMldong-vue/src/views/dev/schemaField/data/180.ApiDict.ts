export default {
  label: '字典',
  value: 'ApiDict',
  props: [
    {
      field: 'ext.code',
      label: '字典编码',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.dataType',
      label: '数据类型',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      defaultValue: 'number',
      componentProps: {
        options: [
          { label: '字符串', value: 'string' },
          { label: '数值', value: 'number' },
        ],
      },
    },
    {
      field: 'ext.renderType',
      label: '渲染类型',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          { label: '下拉选择', value: 'Select' },
          { label: '按钮组', value: 'RadioGroup' },
        ],
      },
    },
  ],
};
