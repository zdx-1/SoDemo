<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增模型分组"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { devSchemaGroupSaveOrUpdate } from '/@/api/dev/schemaGroup';
  import { getAntTreeParents } from '/@/utils/tree';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  /* eslint-disable */
  // 表单元数据配置
  const schemas = [
    {
      field: 'name',
      label: '分组名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
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
      },
    },
    {
      field: 'icon',
      label: '图标',
      component: 'IconPicker',
      rules: [{ required: false, message: '请输入图标', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'sort',
      label: '排序',
      component: 'Input',
      rules: [{ required: false, message: '请输入排序', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        type: "number",
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入备注', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
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
        if (values.leaderIds) {
          values.leaderIdList = values.leaderIds.split(',');
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
        if (formData.leaderIdList && formData.leaderIdList.length) {
          formData.leaderIds = formData.leaderIdList.join(',');
        }
        // parentId设置默认值
        formData.parentId = formData.parentId ? formData.parentId : '0';
        // 组合名-所有父名称集合
        let mergerNames = getAntTreeParents(formData.parentId, treeData).map((item) => item.title);
        mergerNames.push(formData.name);
        // 设置组合名
        formData.mergerName = mergerNames.join(',');
        // 设置层级
        formData.levelCode = mergerNames.length - 1;
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}模型分组成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}模型分组失败`;
        // 调用添加或编辑接口
        devSchemaGroupSaveOrUpdate(formData, unref(isUpdate))
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
