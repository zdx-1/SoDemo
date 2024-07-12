<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增数据模型"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
    ><BasicForm @register="registerForm" class="common-form"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { devSchemaSaveOrUpdate } from '/@/api/dev/schema';
  import './formComponents/index';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  /* eslint-disable */
  // 表单元数据配置
  const schemas = [
    {
      field: 'baseInfo',
      label: '基本信息',
      component: 'Divider'
    },
    {
      field: 'tableName',
      label: '表名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入表名称',
      },
    },
    {
      field: 'remark',
      label: '表注释',
      component: 'Input',
      rules: [{ required: true, message: '请输入表注释', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入表注释',
      },
    },
    {
      field: 'schemaGroupId',
      label: '所属分组',
      component: 'ApiSelect',
      rules: [{ required: false, message: '请输入所属分组', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        api: "/dev/schemaGroup/select",
        placeholder: '请选择模型分组',
      },
    },
    {
      field: 'tableType',
      label: '表类型',
      component: 'ApiDict',
      rules: [{ required: false, message: '请输入表类型', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "dev_schema_table_type",
        placeholder: '请输入表类型'
      },
    },
    {
      field: 'formType',
      label: '表单类型',
      component: 'ApiDict',
      rules: [{ required: false, message: '请输入表单类型', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "dev_schema_form_type",
        placeholder: '请输入表单类型'
      },
    },
    {
      field: 'isTree',
      label: '是否树',
      component: 'ApiDict',
      rules: [{ required: false, message: '请选择是否树', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "yes_no",
        placeholder: '请选择是否树',
        renderType: 'RadioGroup',
        isBtn: true
      },
    },
    {
      field: 'sort',
      label: '排序',
      component: 'InputNumber',
      rules: [{ required: false, message: '请输入排序', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入排序'
      },
    },
    {
      field: 'icon',
      label: '图标',
      component: 'IconPicker',
      rules: [{ required: false, message: '请输入图标', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
      },
    },
    {
      field: 'otherRemark',
      label: '额外说明',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入额外说明', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'layoutProp',
      label: '布局属性',
      component: 'Divider'
    },
    {
      field: 'ext.layout',
      label: '表单布局',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请选择表单布局',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
          { label: '内联', value: 'inline' },
        ],
      },
    },
    {
      field: 'ext.searchLayout',
      label: '搜索表单布局',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请选择表单布局',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
          { label: '内联', value: 'inline' },
        ],
      },
    },
    {
      field: 'ext.labelWidth',
      label: '标签宽度',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入标签宽度'
      },
    },
    {
      field: 'ext.labelAlign',
      label: '标签对齐',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请选择对齐方式',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '右对齐', value: 'right' },
        ],
      },
    },
    {
      field: 'ext.searchLabelWidth',
      label: '搜索标签宽度',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入标签宽度'
      },
    },
    {
      field: 'ext.searchLabelAlign',
      label: '搜索标签对齐',
      component: 'Select',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请选择搜索对齐方式',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '右对齐', value: 'right' },
        ],
      },
    },
    {
      field: 'extProp',
      label: '扩展属性',
      component: 'Divider'
    },
    {
      field: 'ext.title',
      label: '菜单标题',
      component: 'Input',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入菜单标题'
      },
    },
    {
      field: 'ext.relMainTableIdKey',
      label: '关联主表Key',
      component: 'Input',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      ifShow({ values }){
        return values.tableType == 3
      },
      componentProps: {
        placeholder: '请输入关联主表Key'
      },
    },
    {
      field: 'ext.async',
      label: '异步元数据',
      component: 'RadioGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: true,
      helpMessage:["当为异步时，进入页面会通过接口重新获取元数据","当为同步时，只使用代码生成的本地元数据"],
      componentProps: {
        isBtn: true,
        options: [{
          label: '异步',
          value: true,
        }, {
          label: '同步',
          value: false,
        }]
      },
    },
    {
      field: 'ext.hideMenu',
      label: '隐藏菜单',
      component: 'RadioGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        options: [{
          label: '隐藏',
          value: true,
        }, {
          label: '显示',
          value: false,
        }]
      },
    },
    {
      field: 'ext.ignoreSync',
      label: '忽略同步',
      component: 'RadioGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        options: [{
          label: '是',
          value: true,
        }, {
          label: '否',
          value: false,
        }]
      },
    },
    {
      field: 'ext.isCreateRoute',
      label: '是否生成路由',
      component: 'RadioGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        options: [{
          label: '是',
          value: true,
        }, {
          label: '否',
          value: false,
        }]
      },
    },
    {
      field: 'ext.defaultAuthTypeList',
      label: '默认功能权限',
      helpMessage: ['模板可根据该配置生成对应功能，同时生成对应的路由权限按钮'],
      labelWidth: '120px',
      component: 'Select',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      defaultValue: [
        "list",
        "save",
        "remove",
        "update",
        "detail",
        "export",
        "advSearch",
        "importTo",
        "downloadImportTemplate"
      ],
      componentProps: {
        mode: "tags",
        getPopupContainer: () => document.body,
        options: [
          {
            label: "列表",
            value: "list"
          },
          {
            label: "新增",
            value: "save"
          },
          {
            label: "删除",
            value: "remove"
          },
          {
            label: "编辑",
            value: "update"
          },
          {
            label: "详情",
            value: "detail"
          },
          {
            label: "导出",
            value: "export"
          },
          {
            label: "高级搜索",
            value: "advSearch"
          },
          {
            label: "导入",
            value: "importTo"
          },
          {
            label: "下载模板",
            value: "downloadImportTemplate"
          }
        ]
      }
    },
    {
      field: 'ext.customAuthTypeList',
      label: '自定义功能权限',
      helpMessage: ['和默认功能权限一起，生成对应的路由权限按钮'],
      labelWidth: '120px',
      component: 'CustomAuthTypeList',
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'ext.customApiList',
      label: '自定义接口',
      helpMessage: ['在原有的crud接口基础上追加接口'],
      labelWidth: '120px',
      component: 'CustomApiList',
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'ext.actions',
      label: '操作按钮配置',
      labelWidth: '120px',
      component: 'MTableAction',
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
  ];
  /* eslint-disable */
  const isUpdate = ref(false); // 是否为更新
  let currentRecord = reactive({}); // 当前记录
  let treeData = reactive([]); // 树型数据
  // 注册模态框
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(
    async (data) => {
      if (typeof data.record === 'object') {
        let values = { ...data.record };
        if (values.sort !== undefined) {
          values.sort = Number(values.sort);
        }
        Object.keys(values?.ext || {}).forEach((key)=>{
          // 处理ext.属性
          if(values.ext[key]!==undefined){
            values['ext.'+key] = values.ext[key];
          }
        })
        // 初始化表单
        setFieldsValue(values);
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
      }
    },
  );
  // 注册表单
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  // 关闭模态框事件
  const handleCancel = () => {
    // 重置表单
    resetFields();
  };
  // 提交表单
  const handleOk = () => {
    changeOkLoading(true);
    changeLoading(true);
    validate()
      .then((values) => {
        const formData = { ...values };
        if (isUpdate.value) {
          formData.id = currentRecord.id;
        }
        const extObj = {}
        // 处理ext.属性
        Object.keys(formData).filter(key=>key.startsWith('ext.')).forEach(key=>{
          extObj[key.replace('ext.','')] = formData[key]
          delete formData[key]
        })
        formData.ext = {
          ...currentRecord?.ext,
          ...extObj
        }
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}数据模型成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}数据模型失败`;
        // 调用添加或编辑接口
        devSchemaSaveOrUpdate(formData, unref(isUpdate))
          .then(() => {
            changeOkLoading(false);
            changeLoading(false);
            // 重置表单
            resetFields();
            // 关闭模态框
            closeModal();
            message.success(successMsg);
            emit('success');
          })
          .catch((e) => {
            changeOkLoading(false);
            changeLoading(false);
            message.error(e || failMsg);
          });
      })
      .catch(() => {
        changeOkLoading(false);
        changeLoading(false);
      });
  };
</script>
<style scoped lang="less">
@import '/@/assets/styles/common-form.less';
</style>
