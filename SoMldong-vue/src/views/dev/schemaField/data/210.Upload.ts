export default {
  label: '附件上传',
  value: 'Upload',
  props: [
    {
      field: 'ext.api',
      label: '接口地址',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.maxSize',
      label: '单文件大小(MB)',
      component: 'InputNumber',
      defaultValue: 2,
      componentProps: {
        step: 10,
        min: 0,
      },
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.maxNumber',
      label: '最大文件个数',
      component: 'InputNumber',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.responseType',
      label: '数据类型',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          {
            label: '数组',
            value: 'array',
          },
          {
            label: '字符串',
            value: 'string',
          },
        ],
      },
    },
    {
      field: 'ext.multiple',
      component: 'Select',
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
      defaultValue: false,
      label: '是否多选',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'ext.pictureCard',
      component: 'Select',
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
      defaultValue: false,
      label: '是否卡片式',
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
  ],
};
