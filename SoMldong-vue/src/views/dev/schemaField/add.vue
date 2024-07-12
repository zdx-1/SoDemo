<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增模型字段"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
    ><BasicForm class="common-form" @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { devSchemaFieldSaveOrUpdate } from '/@/api/dev/schemaField';
  import './formComponents/index';
  import { componentData, componentPropsData } from './data';
  const props = defineProps({
    schemaId: {
      type: [String, Number],
    },
  });
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
      field: 'fieldName',
      label: '字段名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入字段名称',
      },
    },
    {
      field: 'remark',
      label: '字段注释',
      component: 'Input',
      rules: [{ required: true, message: '请输入字段注释', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入字段注释'
      },
    },
    {
      field: 'fieldSize',
      label: '字段长度',
      component: 'InputNumber',
      rules: [{ required: false, message: '请输入字段长度', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        min: 0,
        placeholder: '请输入字段长度'
      },
    },
    {
      field: 'dataType',
      label: '数据类型',
      component: 'ApiDict',
      rules: [{ required: true, message: '请选择数据类型', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: 'dev_schema_field_data_type',
        placeholder: '请选择数据类型',
        dataType: 'string'
      },
    },
    {
      field: 'isPrimary',
      label: '是否主键',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择是否主键', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "yes_no",
        placeholder: '请选择是否主键',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'nullable',
      label: '允许为空',
      component: 'ApiDict',
      defaultValue: 1,
      rules: [{ required: false, message: '请选择是否允许为空', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "yes_no",
        placeholder: '请选择是否允许为空',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'defaultValue',
      label: '默认值',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入默认值', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入默认值',
      },
    },
    {
      field: 'ext.memorandum',
      label: '备忘录',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入备忘录', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      helpMessage: ['方便配置人员对特殊情况做备忘'],
      componentProps: {
        placeholder: '请输入备忘录'
      },
    },
    {
      field: 'formProp',
      label: '表单属性',
      component: 'Divider'
    },
    {
      field: 'component',
      label: '组件类型',
      component: 'Select',
      defaultValue: 'Input',
      rules: [{ required: true, message: '请选择组件类型', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        options: [
          ...componentData,
        ]
      },
    },
    {
      field: 'ext.searchType',
      label: '搜索类型',
      component: 'Select',
      rules: [{ required: false, message: '请选择搜索类型', trigger: 'blur' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        options: [
          { label: '等值', value: 'EQ' },
          { label: '包含', value: 'IN' },
          { label: '模糊', value: 'LIKE' },
          { label: '区间', value: 'BT' },]
      },
    },
    {
      field: 'ext.tableAlias',
      label: '表别名',
      helpMessage: ['有些自定义查询需要追加表别名'],
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入菜单标题'
      },
    },
    {
      field: 'ext.placeholder',
      label: '占位文本',
      component: 'Input',
      rules: [{ required: false, message: '请输入占位文本', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入占位文本',
      },
    },
    {
      field: 'ext.help',
      label: '提示语',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入提示语', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入提示语'
      },
    },
    {
      field: 'ext.addHide',
      label: '新增隐藏',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择新增隐藏', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择新增隐藏',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.editHide',
      label: '编辑隐藏',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择新增隐藏', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择编辑隐藏',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.listHide',
      label: '列表隐藏',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择列表隐藏', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择列表隐藏',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.viewHide',
      label: '详情隐藏',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择详情隐藏', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择详情隐藏',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.addDisabled',
      label: '新增禁止',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择新增禁止', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择新增禁止',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.editDisabled',
      label: '编辑禁止',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择编辑禁止', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择编辑禁止',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.required',
      label: '必填',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择必填', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择必填',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.search',
      label: '搜索',
      component: 'ApiDict',
      defaultValue: 0,
      rules: [{ required: false, message: '请选择搜索', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        isBtn: true,
        code: "yes_no",
        placeholder: '请选择搜索',
        renderType: 'RadioGroup',
      },
    },
    {
      field: 'ext.span',
      label: '栅格占位',
      component: 'InputNumber',
      rules: [{ required: false, message: '请输入栅格占位', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        min: 1,
        max: 24,
        placeholder: '请输入栅格占位'
      },
    },
    {
      field: 'ext.searchSpan',
      label: '搜索栅格占位',
      component: 'InputNumber',
      rules: [{ required: false, message: '请输入搜索栅格占位', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        min: 1,
        max: 24,
        placeholder: '请输入搜索栅格占位'
      },
    },
    // 组件自定义配置
    ...componentPropsData,
    // 扩展配置
    {
      field: 'extProp',
      label: '扩展属性',
      component: 'Divider'
    },
    {
      field: 'ext.controlledFieldName',
      label: '被字段控制名',
      component: 'Input',
      labelWidth: '120px',
      rules: [{ required: false, message: '请输入被字段控制名', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      helpMessage: ['该字段被控制的表单字段名'],
      componentProps: {
        placeholder: '请输入被字段控制名',
      },
    },
    {
      field: 'ext.controlledFieldValue',
      label: '被字段控制值',
      component: 'Input',
      labelWidth: '120px',
      rules: [{ required: false, message: '请输入被字段控制值', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      helpMessage: ['被字段控制的表单字段值为该值时，才显示','多个则使用英文逗号分割'],
      componentProps: {
        placeholder: '请输入被字段控制值',
      },
    },
    {
      field: 'ext.excelColumnHandlerType',
      label: 'excel列处理类型',
      labelWidth: '120px',
      component: 'ApiDict',
      rules: [{ required: false, message: '请选择excel列处理类型', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        code: "excel_column_handler",
        placeholder: '请选择excel列处理类型',
        dataType: "string",
        getPopupContainer: () => document.body,
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
          if(values.ext[key]){
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
        formData.schemaId = props.schemaId;
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}模型字段成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}模型字段失败`;
        // 调用添加或编辑接口
        devSchemaFieldSaveOrUpdate(formData, unref(isUpdate))
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
