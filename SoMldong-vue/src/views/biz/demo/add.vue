<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增演示"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <a-spin :spinning="loadding">
      <BasicForm @register="registerForm" />
    </a-spin>
  </BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { demoSaveOrUpdate, demoDetail } from '/@/api/biz/demo';
  import { formSchemas, async } from './schemas';
  import { cloneDeep } from 'lodash-es';
  import { useFormSchema } from '/@/hooks/web/useSchema';
  import './components/form/index';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const schemas = ref([]);
  const loadding = ref(false);
  const isUpdate = ref(false); // 是否为更新
  let currentRecord = reactive({}); // 当前记录
  // 注册模态框
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(
    async (data) => {
      if (async === false) {
        // 重新拷贝一份元数据，防止被修改
        schemas.value = cloneDeep(formSchemas);
      } else {
        // 使用异步数据
        useFormSchema({
          tableName: 'biz_demo',
          formRef: formMethods,
        });
      }
      if (typeof data.record === 'object') {
        const values = { ...data.record };
        // 初始化表单
        setFieldsValue(values);
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
        if (isUpdate.value) {
          loadding.value = true;
          demoDetail({
            id: currentRecord.id,
          }).then((res) => {
            currentRecord.value = res;
            loadding.value = false;
            // 初始化表单
            setFieldsValue({
              ...values,
              ...currentRecord.value,
            });
            // 设置禁止的字段（详情接口提供，单条记录动态）
            handleDisabledKeys(res?.$disabledKeyList);
            // 设置隐藏的字段（详情接口提供，单条记录动态）
            handleHideKeys(res?.$hideKeyList);
          });
        }
      }
    },
  );
  // 注册表单
  const [registerForm, formMethods] = useForm({
    labelWidth: 100,
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  const { setFieldsValue, resetFields, validate, updateSchema } = formMethods;
  /**
   * 设置disabled字段
   * @param {*} keys
   */
  const handleDisabledKeys = (keys) => {
    keys?.forEach((key) => {
      updateSchema({
        field: key,
        componentProps: {
          disabled: true,
        },
      });
    });
  };
  /**
   * 设置隐藏字段
   * @param {*} keys
   */
  const handleHideKeys = (keys) => {
    keys?.forEach((key) => {
      updateSchema({
        field: key,
        ifShow: false,
      });
    });
  };
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
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}演示成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}演示失败`;
        // 调用添加或编辑接口
        demoSaveOrUpdate(formData, unref(isUpdate))
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
