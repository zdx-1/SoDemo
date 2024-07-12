export default {
  label: '图标选择器',
  value: 'IconPicker',
  props: [
    {
      field: 'ext.copy',
      label: '允许复制',
      defaultValue: false,
      component: 'Switch',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {},
    },
  ],
};
