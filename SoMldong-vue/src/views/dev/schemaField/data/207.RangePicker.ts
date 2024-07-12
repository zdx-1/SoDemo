export default {
  label: '日期区间',
  value: 'RangePicker',
  props: [
    {
      field: 'ext.format',
      label: '日期格式化',
      component: 'Input',
      helpMessage: ['例：YYYY-MM-DD HH:mm:ss'],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入日期格式化',
      },
    },
    {
      field: 'ext.valueFormat',
      label: '日期格式化值	',
      component: 'Input',
      helpMessage: ['例：YYYY-MM-DD HH:mm:ss'],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入日期格式化值	',
      },
    },
  ],
};
