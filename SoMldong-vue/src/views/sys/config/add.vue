<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增系统配置"
    @cancel="handleCancel"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { sysConfigSaveOrUpdate } from '/@/api/sys/config';
  // import { ChangeCode } from '/@/components/ChangeCode/index.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  // 表单元数据配置
  const schemas = [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入名称',
      },
    },
    {
      field: 'code',
      label: '编码',
      component: 'Input',
      rules: [{ required: true, message: '请输入编码', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入编码',
      },
    },
    {
      field: 'content',
      label: '参数值',
      component: 'Input',
      rules: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入参数值',
      },
    },
    {
      field: 'isSys',
      label: '系统参数',
      component: 'ApiDict',
      rules: [{ required: true, message: '请选择系统参数', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      // defaultValue: 1,
      componentProps: {
        placeholder: '请选择系统参数',
        code: 'yes_no',
      },
    },
    {
      field: 'enabled',
      label: '是否启用',
      component: 'ApiDict',
      rules: [{ required: true, message: '请选择是否启用', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      // defaultValue: 1,
      componentProps: {
        placeholder: '请选择是否启用',
        code: 'yes_no',
      },
    },
    {
      field: 'groupCode',
      label: '分组编码',
      component: 'Input',
      rules: [{ required: true, message: '请输入分组编码', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入分组编码',
      },
    },
    {
      field: `remark`,
      label: `备注`,
      component: 'InputTextArea',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
  const isUpdate = ref(false); // 是否为更新
  let currentRecord = reactive({}); // 当前记录
  // 注册模态框
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(
    async (data) => {
      if (typeof data.record === 'object') {
        let values = { ...data.record };
        // 初始化表单
        setFieldsValue(values);
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
      }
    },
  );
  // 注册表单
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
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
        // parentId设置默认值
        formData.parentId = formData.parentId ? formData.parentId : '0';
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}系统配置成功`;
        // const failMsg = `${isUpdate.value ? '编辑' : '新增'}系统配置失败`;
        // 调用添加或编辑接口
        sysConfigSaveOrUpdate(formData, unref(isUpdate))
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
            console.log(e);
            // message.error(e || failMsg);
          });
      })
      .catch((e) => {
        console.log(e);
        changeOkLoading(false);
        changeLoading(false);
      });
  };
</script>
