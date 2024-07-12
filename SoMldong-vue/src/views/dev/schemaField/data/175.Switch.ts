export default {
  label: '开关',
  value: 'Switch',
  props: [
    {
      field: 'ext.dataType',
      label: '数据类型',
      component: 'Select',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: 'boolean',
      componentProps: {
        options: [
          { label: '字符串', value: 'string' },
          { label: '数值', value: 'number' },
          { label: '布尔值', value: 'boolean' },
        ],
      },
    },
    {
      field: 'ext.checkedValue',
      label: '选中时的值',
      component: 'Input',
      colProps: {
        xl: 9,
        xxl: 9,
      },
      componentProps: {
        placeholder: '请输入选中时的值',
      },
      ifShow: (e: any) => {
        return e.model?.component == 'Switch' && e.model['ext.Switch_dataType'] !== 'boolean';
      },
    },
    {
      field: 'ext.unCheckedValue',
      label: '非选中时的值',
      component: 'Input',
      colProps: {
        xl: 9,
        xxl: 9,
      },
      componentProps: {
        placeholder: '请输入非选中时的值',
      },
      ifShow: (e: any) => {
        return e.model?.component == 'Switch' && e.model['ext.Switch_dataType'] !== 'boolean';
      },
    },
  ],
};
