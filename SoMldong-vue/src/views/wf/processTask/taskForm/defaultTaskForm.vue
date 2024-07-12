<template>
  <a-card title="操作区域">
    <BasicForm @register="registerForm" v-bind="$attrs" :disabled="disabled">
      <template #submitBefore v-if="!disabled">
        <a-space v-if="mProcessTask.performType">
          <a-button type="primary" @click="handleExecute('AGREE')" v-loading="loading.AGREE">
            <template #icon><CheckOutlined /></template>
            同意
          </a-button>
          <a-button
            danger
            @click="handleExecute('COUNTERSIGN_DISAGREE')"
            v-loading="loading.COUNTERSIGN_DISAGREE"
          >
            <template #icon><CloseOutlined /></template>
            不同意
          </a-button>
          <a-button @click="handleAddCandidate">
            <template #icon><UsergroupAddOutlined /></template>
            加签
          </a-button>
        </a-space>
        <a-space v-else>
          <a-button type="primary" @click="handleExecute('AGREE')" v-loading="loading.AGREE">
            <template #icon><CheckOutlined /></template>
            同意
          </a-button>
          <a-button danger @click="handleExecute('REJECT')" v-loading="loading.REJECT">
            <template #icon><CloseOutlined /></template>
            拒绝
          </a-button>
          <a-button @click="handleExecute('ROLLBACK')" v-loading="loading.ROLLBACK">
            <template #icon><RollbackOutlined /></template>
            退回上一步
          </a-button>
          <a-button
            @click="handleExecute('ROLLBACK_TO_OPERATOR')"
            v-loading="loading.ROLLBACK_TO_OPERATOR"
          >
            <template #icon><RollbackOutlined /></template>
            退回发起人
          </a-button>
          <a-button @click="handleExecute('JUMP')" v-loading="loading.JUMP">
            <template #icon><AimOutlined /></template>
            跳转
          </a-button>
        </a-space>
      </template>
    </BasicForm>
    <SelectJumbNode ref="selectJumbNodeRef" @ok="handleSelectJumbNodeOk" />
    <AddCandidate ref="addCandidateRef" />
  </a-card>
</template>
<script setup name="defaultTaskForm|默认表单">
  import { BasicForm, useForm } from '/@/components/Form';
  import SelectJumbNode from './selectJumbNode.vue';
  import AddCandidate from './addCandidate.vue';
  import {
    CheckOutlined,
    CloseOutlined,
    RollbackOutlined,
    AimOutlined,
    UsergroupAddOutlined,
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { ref, watch, reactive, onMounted } from 'vue';
  import { wfProcessTaskExecute } from '/@/api/wf/processTask';
  import { useComponentRegister } from '/@/components/Form/src/hooks/useComponentRegister';
  import NextNodeSelectUser from './selectUser.vue';
  const emits = defineEmits(['success']);
  const props = defineProps({
    processTask: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  // 选择节点操作对象
  const selectJumbNodeRef = ref();
  // 加签
  const addCandidateRef = ref();
  // 按钮加载状态
  const loading = reactive({
    AGREE: false, // 同意
    REJECT: false, // 拒绝
    ROLLBACK: false, // 退回（上一步）
    JUMP: false, // 跳转,
    ROLLBACK_TO_OPERATOR: false, // 退回发起人
    COUNTERSIGN_DISAGREE: false, // 会签不同意
  });
  // 按钮对应类型
  const btnSubmitType = reactive({
    AGREE: 1,
    REJECT: 2,
    ROLLBACK: 3,
    JUMP: 4,
    ROLLBACK_TO_OPERATOR: 6,
    COUNTERSIGN_DISAGREE: 20,
  });
  // 当前流程任务对象
  const mProcessTask = ref(props.processTask || {});
  watch(
    () => props.processTask,
    () => {
      mProcessTask.value = props.processTask;
    },
    {
      deep: true,
    },
  );
  // 表单元数据配置
  const schemas = [
    {
      field: 'tf_approvalComment',
      label: '审批意见',
      component: 'InputTextArea',
      rules: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入审批意见',
      },
    },
    {
      field: 'tf_approvalAttachment',
      label: '上传附件',
      component: 'Upload',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {},
    },
    {
      field: 'tf_isAssignNextNodeOperator',
      label: '指定下一节点处理人',
      component: 'Checkbox',
      required: false,
      labelWidth: '150px',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {},
      ifShow: () => {
        return !props.disabled && !mProcessTask.value.performType;
      },
    },
    {
      field: 'tf_isCc',
      label: '是否抄送',
      component: 'Checkbox',
      required: false,
      labelWidth: '150px',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {},
      ifShow: () => {
        return !props.disabled;
      },
    },
    {
      field: 'tf_nextNodeOperator',
      label: '下一节点处理人',
      component: 'NextNodeSelectUser',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      ifShow: ({ values }) => {
        return (
          values.tf_isAssignNextNodeOperator === true &&
          !props.disabled &&
          !mProcessTask.value.performType
        );
      },
      componentProps: {
        placeholder: '请选择下一节点处理人',
        mode: 'multiple',
        showSearch: true,
        bizData: {
          processTaskId: mProcessTask.value?.id,
        },
      },
    },
    {
      field: 'tf_ccActors',
      label: '抄送给',
      component: 'NextNodeSelectUser',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      ifShow: ({ values }) => {
        return values.tf_isCc === true && !props.disabled;
      },
      componentProps: {
        placeholder: '请选择抄送人',
        mode: 'multiple',
        showSearch: true,
      },
    },
  ];
  // 注册表单
  const [registerForm, formAction] = useForm({
    labelWidth: 110,
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  /**
   * APPLY(0,"发起申请"),
    AGREE(1, "同意申请"),
    REJECT(2, "拒绝申请"),
    ROLLBACK(3, "退回"),
    JUMP(4, "跳转"),
    RE_APPLY(5, "重新提交"),
    ROLLBACK_TO_OPERATOR(6, "退回发起人")
   * @param {*} btnType 
   */
  const handleExecute = (btnType) => {
    formAction.validate().then(() => {
      const values = formAction.getFieldsValue();
      if (!['AGREE'.includes(btnType)]) {
        // 同意才能指定下一节点处理人，所以其他要删掉对应的key
        delete values['tf_isAssignNextNodeOperator'];
        delete values['tf_nextNodeOperator'];
      }
      if (btnType == 'JUMP') {
        selectJumbNodeRef.value?.openModal({
          processInstanceId: mProcessTask.value?.processInstanceId,
        });
      } else {
        doSubmit(btnType, values);
      }
    });
  };
  /**
   * 选择节点确定==>跳转提交处理
   * @param {*} values
   */
  const handleSelectJumbNodeOk = (data) => {
    const values = formAction.getFieldsValue();
    selectJumbNodeRef?.value.changeOkLoading(true);
    doSubmit('JUMP', {
      ...values,
      ...data,
    })
      .then(() => {
        selectJumbNodeRef?.value.closeModal();
      })
      .finally(() => {
        selectJumbNodeRef?.value.changeOkLoading(false);
      });
  };
  // 提交
  const doSubmit = (btnType, data) => {
    const submitType = btnSubmitType[btnType];
    loading[btnType] = true;
    return new Promise((resolve, reject) => {
      wfProcessTaskExecute({
        processTaskId: mProcessTask.value?.id, // 流程任务id
        processInstanceId: mProcessTask.value?.processInstanceId, // 流程实例ID
        submitType: submitType,
        ...data,
      })
        .then(() => {
          message.success('提交成功');
          emits('success');
          resolve({});
        })
        .catch((e) => {
          reject(e);
        })
        .finally(() => {
          loading[btnType] = false;
        });
    });
  };
  const handleAddCandidate = () => {
    addCandidateRef.value?.show(mProcessTask.value);
  };
  onMounted(() => {
    useComponentRegister('NextNodeSelectUser', NextNodeSelectUser);
  });
  defineExpose({
    ...formAction,
  });
</script>
