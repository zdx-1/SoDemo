export default {
  label: '多行文本',
  value: 'InputTextArea',
  props: [
    {
      field: 'ext.showCount',
      label: '展示字数',
      defaultValue: true,
      component: 'Switch',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {},
    },
    {
      field: 'ext.autoSize',
      label: '高度',
      component: 'InputTextAreaAutoSize',
    },
  ],
};
