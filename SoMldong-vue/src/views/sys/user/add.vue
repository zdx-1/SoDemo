/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增用户"
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
  import { sysUserSaveOrUpdate } from '/@/api/sys/user';
  import { sysDeptTree } from '/@/api/sys/dept';
  import { sysPostSelect } from '/@/api/sys/post';
  // import { ChangeCode } from '/@/components/ChangeCode/index.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  // 表单元数据配置
  const schemas = [
    {
      field: 'userName',
      label: '用户名',
      component: 'Input',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      field: 'realName',
      label: '姓名',
      component: 'Input',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      label: '密码',
      field: 'password',
      component: 'InputPassword',
      helpMessage: ['5-18位数字、字母、特殊字符组成。'],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      rules: [
        {
          type: 'string',
          required: true,
          message: '请输入密码',
        },
        {
          type: 'string',
          pattern: /[a-zA-Z0-9_!@#$%^&*]{5,18}/,
          message: '密码由5-18位数字、字母、特殊字符组成。',
        },
      ],
      ifShow: () => {
        return !isUpdate.value;
      },
    },
    {
      label: '确认密码',
      field: 'confirmPassword',
      component: 'InputPassword',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      rules: [
        {
          type: 'string',
          required: true,
          message: '请输入确认密码',
        },
        {
          type: 'string',
          required: true,
          message: '两密码不一致',
          validator: () => {
            const values = getFieldsValue();
            if (values.password === values.confirmPassword) {
              return Promise.resolve(true);
            } else {
              return Promise.reject(new Error('两密码不一致'));
            }
          },
        },
      ],
      ifShow: () => {
        return !isUpdate.value;
      },
    },
    {
      field: 'nickName',
      label: '昵称',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    // {
    //   field: 'birthday',
    //   label: '生日',
    //   colProps: {
    //     xl: 12,
    //     xxl: 12,
    //   },
    //   component: 'DatePicker',
    //   componentProps: {
    //     format: 'YYYY-MM-DD',
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
    {
      label: '性别',
      field: 'sex',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      component: 'ApiDict',
      componentProps: {
        code: 'sex',
        placeholder: '请选择性别',
      },
    },
    {
      label: '邮箱',
      field: 'email',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      component: 'Input',
    },
    {
      field: 'mobilePhone',
      label: '手机号码',
      component: 'Input',
      rules: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入手机号码',
      },
    },
    {
      field: 'tel',
      label: '联系电话',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入联系电话',
      },
    },
    {
      field: 'deptId',
      label: '所属部门',
      component: 'ApiTreeSelect',
      componentProps: {
        placeholder: '请选择所属部门',
        api: sysDeptTree,
        replaceFields: {
          title: 'name',
          value: 'id',
          key: 'id',
        },
      },
      rules: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'postId',
      label: '所属岗位',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择所属岗位',
        api: sysPostSelect,
        params: {
          includeType: 1,
        },
      },
      rules: [{ required: true, message: '请选择所属岗位', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
    },
    {
      label: '头像',
      field: 'avatar',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      component: 'Input',
    },
    {
      label: '备注',
      field: 'remark',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      component: 'InputTextArea',
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
  const [registerForm, { setFieldsValue, resetFields, validate, getFieldsValue }] = useForm({
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
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}用户成功`;
        // const failMsg = `${isUpdate.value ? '编辑' : '新增'}用户失败`;
        // 调用添加或编辑接口
        sysUserSaveOrUpdate(formData, unref(isUpdate))
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
