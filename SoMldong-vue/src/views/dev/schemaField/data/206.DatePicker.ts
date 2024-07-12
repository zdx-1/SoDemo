export default {
  label: '日期',
  value: 'DatePicker',
  props: [
    {
      field: 'ext.mode',
      label: '日期面板状态',
      component: 'Select',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        options: [
          {
            label: 'time',
            value: 'time',
          },
          {
            label: 'date',
            value: 'date',
          },
          {
            label: 'month',
            value: 'month',
          },
          {
            label: 'year',
            value: 'year',
          },
          {
            label: 'decade',
            value: 'decade',
          },
        ],
      },
    },
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
