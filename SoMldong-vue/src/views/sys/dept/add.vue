<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增部门"
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
  import { sysDeptTree, sysDeptSaveOrUpdate } from '/@/api/sys/dept';
  import { sysUserSelect } from '/@/api/sys/user';
  import { getAntTreeParents } from '/@/utils/tree';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  // 表单元数据配置
  const schemas = [
    {
      field: 'parentId',
      label: '所属上级',
      component: 'ApiTreeSelect',
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请选择上级',
        api: sysDeptTree,
        onOptionsChange(options) {
          // 数据变化事件,将值赋值给treeData，注：这里的options数据结构并不是后端返回的结果，可打印查看
          treeData = options;
        },
        replaceFields: {
          key: 'id',
          title: 'name',
          children: 'children',
          value: 'id',
        },
      },
    },
    {
      field: 'name',
      label: '部门名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入部门名称',
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
      field: 'sort',
      label: '排序',
      component: 'InputNumber',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      defaultValue: 10,
      componentProps: {
        placeholder: '请输入排序',
        min: 0,
        step: 5,
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
      field: 'leaderIdList',
      label: '部门负责人',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择部门负责人',
        api: sysUserSelect,
        params: {
          includeType: 1,
        },
        mode: 'multiple',
      },
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
    {
      field: 'mainLeaderId',
      label: '分管领导',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择分管领导',
        api: sysUserSelect,
        params: {
          includeType: 1,
        },
      },
      colProps: {
        xl: 24,
        xxl: 24,
      },
    },
  ];
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
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}部门成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}部门失败`;
        // 调用添加或编辑接口
        sysDeptSaveOrUpdate(formData, unref(isUpdate))
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
