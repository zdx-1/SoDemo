export default {
  label: '远程自动完成',
  value: 'ApiAutoComplete',
  props: [
    {
      field: 'ext.api',
      label: '接口地址',
      labelWidth: '110px',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.resultField',
      label: '返回字段',
      labelWidth: '110px',
      helpMessage: ['接口返回的字段，如果接口返回数组，可以不填。支持x.x.x格式'],
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.labelField',
      label: '选项label',
      labelWidth: '110px',
      helpMessage: ['下拉数组项内label显示文本的字段，支持x.x.x格式'],
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.valueField',
      label: '选项value',
      labelWidth: '110px',
      helpMessage: ['下拉数组项内value实际值的字段，支持x.x.x格式'],
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.numberToString',
      labelWidth: '110px',
      component: 'Checkbox',
      renderComponentContent: '是否将number值转化为string',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.immediate',
      labelWidth: '110px',
      component: 'Checkbox',
      renderComponentContent: '是否立即请求接口，否则将在第一次点击时候触发请求',
      defaultValue: true,
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.params',
      label: '请求参数',
      component: 'RequestParams',
    },
  ],
};
