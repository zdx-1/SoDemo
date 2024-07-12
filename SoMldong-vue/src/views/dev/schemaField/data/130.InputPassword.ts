export default {
  label: '密码输入框',
  value: 'InputPassword',
  props: [
    {
      field: 'ext.visibilityToggle',
      label: '显示切换按钮',
      defaultValue: true,
      component: 'Switch',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {},
    },
    {
      field: 'ext.maxlength',
      label: '最大长度',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入最大长度',
        min: 1,
      },
    },
    {
      field: 'ext.prefix',
      label: '前辍图标',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入前辍图标',
      },
    },
    {
      field: 'ext.suffix',
      label: '后辍图标',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入后辍图标',
      },
    },
    {
      field: 'ext.addonBefore',
      label: '前置标签',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入前置标签',
      },
    },
    {
      field: 'ext.addonAfter',
      label: '后置标签',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入后置标签',
      },
    },
  ],
};
