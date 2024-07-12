export default {
  label: '远程树',
  value: 'ApiTreeSelect',
  props: [
    {
      field: 'ext.api',
      label: '接口地址',
      labelWidth: '110px',
      component: 'Input',
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'ext.viewLabelKey',
      label: '回显的key',
      helpMessage: ['算是一种优化，数据库一般只存储id，前端列表和详情页需要回显成对应的文本'],
      labelWidth: '110px',
      component: 'Input',
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'ext.immediate',
      labelWidth: '110px',
      component: 'Checkbox',
      renderComponentContent: '是否立即请求接口，否则将在第一次点击时候触发请求',
      defaultValue: true,
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'ext.replaceFields',
      labelWidth: '110px',
      label: 'replaceFields',
      helpMessage: ['替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段'],
      component: 'TreeSelectReplaceFields',
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
