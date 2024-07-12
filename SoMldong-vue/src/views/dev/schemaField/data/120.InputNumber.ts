export default {
  label: '数值输入框',
  value: 'InputNumber',
  props: [
    {
      field: 'ext.max',
      label: '最大值',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入最大值',
      },
    },
    {
      field: 'ext.min',
      label: '最小值',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入最小值',
      },
    },
    {
      field: 'ext.step',
      label: '步数',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入步数',
      },
    },
    {
      field: 'ext.precision',
      label: '数值精度',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入数值精度',
      },
    },
  ],
};
