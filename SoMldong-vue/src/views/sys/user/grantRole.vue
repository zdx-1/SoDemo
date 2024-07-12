<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="授权角色"
    @cancel="handleCancel"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { grantRole } from '/@/api/sys/user';
  import { sysRoleSelect } from '/@/api/sys/role';
  import { nextTick } from 'vue';
  // import { ChangeCode } from '/@/components/ChangeCode/index.vue';
  // 声明Emits
  const emit = defineEmits(['reload', 'register']);
  // 表单元数据配置
  const schemas = [
    {
      field: 'roleIdList',
      label: '选择角色',
      component: 'ApiSelect',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请选择角色',
        api: sysRoleSelect,
        mode: 'multiple',
        params: {
          includeType: 1,
          pageNum: 1,
          pageSize: 1000,
        },
      },
    },
  ];
  let currentRecord = reactive({}); // 当前记录
  // 注册模态框
  const [registerModal, { closeModal, openModal }] = useModal();
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
    validate()
      .then((values) => {
        const formData = { ...values };
        formData.userId = currentRecord.value.id;
        // 调用添加或编辑接口
        grantRole(formData)
          .then(() => {
            // 重置表单
            resetFields();
            // 关闭模态框
            closeModal();
            message.success('保存成功');
            emit('reload');
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      openModal();
      nextTick(() => {
        setFieldsValue({
          roleIdList: record.roleIds ? record.roleIds.split(',') : [],
        });
      });
    },
  });
</script>
