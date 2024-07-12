<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增岗位"
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
  import { sysRoleSaveOrUpdate } from '/@/api/sys/role';
  // import { ChangeCode } from '/@/components/ChangeCode/index.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const props = defineProps({
    appCode: {
      type: String,
    },
  });
  // 表单元数据配置
  const schemas = [
    {
      field: 'name',
      label: '角色名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入角色名称',
      },
    },
    {
      field: 'code',
      label: '唯一编码',
      component: 'Input',
      rules: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入唯一编码',
      },
    },
    {
      field: 'roleType',
      label: '角色类型',
      component: 'ApiDict',
      rules: [{ required: true, message: '请选择角色类型', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      // defaultValue: 1,
      componentProps: {
        placeholder: '请选择角色类型',
        code: 'sys_role_role_type',
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
        formData.appCode = props.appCode;
        if (isUpdate.value) {
          formData.id = currentRecord.id;
        }
        // parentId设置默认值
        formData.parentId = formData.parentId ? formData.parentId : '0';
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}岗位成功`;
        // const failMsg = `${isUpdate.value ? '编辑' : '新增'}岗位失败`;
        // 调用添加或编辑接口
        sysRoleSaveOrUpdate(formData, unref(isUpdate))
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
