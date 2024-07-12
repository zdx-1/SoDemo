<template>
  <BasicModal
    width="40%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增字典项"
    @cancel="handleCancel"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { sysDictItemSaveOrUpdate } from '/@/api/sys/dictItem';
  // import { ChangeCode } from '/@/components/ChangeCode/index.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const props = defineProps({
    dictId: {
      type: [String, Number],
    },
  });
  const currentDictId = ref(props.dictId);
  watch(
    () => props.dictId,
    () => {
      currentDictId.value = props.dictId;
    },
  );
  // 表单元数据配置
  const schemas = [
    {
      field: 'name',
      label: '字典项名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入字典项名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入字典项名称',
      },
    },
    {
      field: 'code',
      label: '字典值',
      component: 'Input',
      rules: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入字典值',
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
      field: 'sort',
      label: '排序',
      component: 'InputNumber',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      defaultValue: 999,
      componentProps: {
        placeholder: '请输入排序',
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
        if (values.sort !== undefined) {
          values.sort = Number(values.sort);
        }
        // 初始化表单
        setFieldsValue(values);
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
      }
    },
  );
  // 注册表单
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 90,
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
        formData.dictId = currentDictId.value;
        console.log(currentDictId.value);
        if (isUpdate.value) {
          formData.id = currentRecord.id;
        }
        // parentId设置默认值
        formData.parentId = formData.parentId ? formData.parentId : '0';
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}字典项成功`;
        // const failMsg = `${isUpdate.value ? '编辑' : '新增'}字典项失败`;
        // 调用添加或编辑接口
        sysDictItemSaveOrUpdate(formData, unref(isUpdate))
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
