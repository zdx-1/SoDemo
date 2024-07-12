export default {
  label: '分割线',
  value: 'Divider',
  props: [
    {
      field: 'ext.dashed',
      label: '是否虚线',
      component: 'RadioGroup',
      defaultValue: false,
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          {
            label: '是',
            value: true,
          },
          {
            label: '否',
            value: false,
          },
        ],
      },
    },
    {
      field: 'ext.plain',
      label: '普通正文样式',
      component: 'RadioGroup',
      defaultValue: false,
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          {
            label: '是',
            value: true,
          },
          {
            label: '否',
            value: false,
          },
        ],
      },
    },
    {
      field: 'ext.orientation',
      label: '标题位置',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          {
            label: 'center',
            value: 'center',
          },
          {
            label: 'left',
            value: 'left',
          },
          {
            label: 'right',
            value: 'right',
          },
        ],
      },
    },
    {
      field: 'ext.type',
      label: '类型',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          {
            label: '水平',
            value: 'horizontal',
          },
          {
            label: '垂直',
            value: 'vertical',
          },
        ],
      },
    },
  ],
};
