<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增菜单"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { nextTick, reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { sysMenuTree, sysMenuSaveOrUpdate } from '/@/api/sys/menu';
  import { getAntTreeParents } from '/@/utils/tree';
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
      field: 'type',
      label: '菜单类型',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      defaultValue: 1,
      componentProps: {
        options: [
          {
            value: 1,
            label: '目录',
          },
          {
            value: 2,
            label: '菜单',
          },
          {
            value: 3,
            label: '按钮',
          },
          {
            value: 4,
            label: '接口',
          },
        ],
        onChange(ee) {
          handleMenuTypeChange(ee);
        },
      },
    },
    {
      field: 'parentId',
      label: '所属上级',
      component: 'ApiTreeSelect',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请选择上级',
        api: sysMenuTree,
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
      label: '菜单名称',
      component: 'Input',
      rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入菜单名称',
      },
    },
    {
      field: 'code',
      label: '唯一编码',
      component: 'Input',
      rules: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入唯一编码',
      },
    },
    {
      field: 'path',
      label: '路由/接口地址',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入路由/接口地址',
      },
    },
    {
      field: 'component',
      label: '组件地址',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入组件地址',
      },
    },
    {
      field: 'openType',
      label: '打开方式',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      defaultValue: 0,
      componentProps: {
        placeholder: '请选择打开方式',
        options: [
          {
            value: 0,
            label: '无',
          },
          {
            value: 1,
            label: '组件',
          },
          {
            value: 2,
            label: '内链',
          },
          {
            value: 3,
            label: '外链',
          },
        ],
        onChange(ee) {
          handleOpenTypeChange(ee);
        },
      },
    },
    {
      field: 'icon',
      label: '图标',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      component: 'IconPicker',
      componentProps: {
        placeholder: '请选择图标',
      },
    },
    {
      field: 'url',
      label: '内外链地址',
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入内外链地址',
      },
    },
    {
      field: 'sort',
      label: '排序',
      component: 'InputNumber',
      defaultValue: 1000,
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请输入排序',
      },
    },
    {
      field: 'enabled',
      label: '是否启用',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择是否启用',
        options: [
          {
            value: 1,
            label: '是',
          },
          {
            value: 0,
            label: '否',
          },
        ],
      },
    },
    {
      field: 'isShow',
      label: '是否显示',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择是否显示',
        options: [
          {
            value: 1,
            label: '是',
          },
          {
            value: 0,
            label: '否',
          },
        ],
      },
    },
    {
      field: 'isSync',
      label: '是否同步',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: 0,
      componentProps: {
        placeholder: '请选择是否同步',
        options: [
          {
            value: 1,
            label: '是',
          },
          {
            value: 0,
            label: '否',
          },
        ],
      },
    },
    {
      field: 'isCache',
      label: '是否缓存',
      component: 'RadioButtonGroup',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      defaultValue: 0,
      componentProps: {
        placeholder: '请选择是否缓存',
        options: [
          {
            value: 1,
            label: '是',
          },
          {
            value: 0,
            label: '否',
          },
        ],
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
        nextTick(() => {
          clearValidate();
        });
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
        handleMenuTypeChange(values.type);
        handleOpenTypeChange(values.openType);
      } else {
        handleMenuTypeChange(1);
        handleOpenTypeChange(0);
      }
    },
  );
  // 注册表单
  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema, clearValidate }] =
    useForm({
      labelWidth: 110,
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
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}菜单成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}菜单失败`;
        // 调用添加或编辑接口
        sysMenuSaveOrUpdate(formData, unref(isUpdate))
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
  // 处理菜单类型事件
  const handleMenuTypeChange = (ee) => {
    const e = ee?.target?.value || ee;
    let isShowDisabled = false;
    let openTypeDisabled = true;
    let isCacheDisabled = true;
    let pathRequired = false;
    let pathDisabled = false;
    let componentRequired = false;
    let componentDisabled = false;
    let iconDisabled = false;
    if (e !== undefined) {
      if (e == 1) {
        // 目录
        isShowDisabled = false;
        pathRequired = false;
        pathDisabled = false;
        componentRequired = false;
        componentDisabled = false;
        iconDisabled = false;
      } else if (e == 2) {
        // 菜单
        isShowDisabled = false;
        openTypeDisabled = false;
        isCacheDisabled = false;
        pathRequired = true;
        pathDisabled = false;
        componentRequired = false;
        componentDisabled = false;
        iconDisabled = false;
      } else if (e == 3) {
        // 按钮
        isShowDisabled = true;
        pathRequired = true;
        pathDisabled = false;
        iconDisabled = true;
        componentRequired = false;
        componentDisabled = true;
      } else if (e == 4) {
        // 接口
        isShowDisabled = true;
        pathRequired = true;
        pathDisabled = false;
        iconDisabled = true;
        componentRequired = false;
        componentDisabled = true;
      }
    }
    updateSchema({
      field: 'path',
      componentProps: {
        disabled: pathDisabled,
      },
      required: pathRequired,
    });
    updateSchema({
      field: 'component',
      componentProps: {
        disabled: componentDisabled,
      },
      required: componentRequired,
    });
    updateSchema({
      field: 'icon',
      componentProps: {
        disabled: iconDisabled,
      },
    });
    updateSchema({
      field: 'isShow',
      componentProps: {
        disabled: isShowDisabled,
      },
    });
    updateSchema({
      field: 'openType',
      componentProps: {
        disabled: openTypeDisabled,
      },
    });
    updateSchema({
      field: 'isCache',
      componentProps: {
        disabled: isCacheDisabled,
      },
    });
  };
  // 打开类型事件
  const handleOpenTypeChange = (ee) => {
    const e = ee?.target?.value || ee;
    let urlDisabled = true;
    let urlRequired = false;
    if (e == 2 || e == 3) {
      urlDisabled = false;
      urlRequired = true;
    }
    updateSchema({
      field: 'url',
      componentProps: {
        disabled: urlDisabled,
      },
      required: urlRequired,
    });
  };
</script>
