<template>
  <BasicDrawer
    width="60%"
    v-bind="$attrs"
    @register="registerDrawer"
    okText="确定"
    cancelText="取消"
    :showFooter="false"
    title="审批流程"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="form" tab="表单">
        <component
          :is="formKey"
          ref="formRef"
          :disabled="!isFirstTaskNode || mType == 'done'"
          :flowData="flowData"
        />
        <component
          v-if="!isFirstTaskNode"
          :is="taskFormKey"
          ref="taskFormRef"
          :processTask="currentRecord"
          @success="handleTaskFormSuccess"
          :disabled="mType == 'done'"
        />
      </a-tab-pane>
      <a-tab-pane key="process" tab="流程图" class="m-tab-pane">
        <SnakerFlowDesigner
          v-if="activeKey == 'process'"
          v-model="flowData"
          :showDoc="false"
          :viewer="true"
          :assigneeText="assigneeTextData"
          nodeRenderType="html"
          :wfConfig="{
            showHelp: false,
          }"
          :high-light="highLight"
        />
      </a-tab-pane>
      <a-tab-pane key="record" tab="审批记录">
        <a-tabs v-model:activeKey="recordActiveKey" tabPosition="left">
          <a-tab-pane key="time" tab="时间轴">
            <ApprovalRecordTime :approvalRecord="approvalRecord" />
          </a-tab-pane>
          <a-tab-pane key="table" tab="表格">
            <ApprovalRecordTable :approvalRecord="approvalRecord" />
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>
  </BasicDrawer>
</template>
<script setup>
  import 'element-plus/dist/index.css';
  import { ref, nextTick, watch, shallowRef } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {
    wfProcessInstanceDetail,
    wfProcessInstanceHighLight,
    wfProcessInstanceApprovalRecord,
    wfProcessInstanceGetAssigneeTextData,
  } from '/@/api/wf/processInstance';
  import { wfProcessTaskDetail, wfProcessTaskExecute } from '/@/api/wf/processTask';
  import { componentMap } from '../processDefine/componentMap';
  import { taskFormComponentMap } from './componentMap';
  import ApprovalRecordTime from '../components/approvalRecordTime.vue';
  import ApprovalRecordTable from '../components/approvalRecordTable.vue';
  import { message } from 'ant-design-vue';
  // 导入组件库
  import SnakerFlowDesigner from 'snakerflow-designer-vue';
  const emits = defineEmits(['success', 'register']);
  const props = defineProps({
    type: {
      // 页面类型，done/todo
      type: String,
      default: 'todo',
    },
  });
  const mType = ref(props.type);
  // 参与人回显数据
  const assigneeTextData = ref({});
  watch(
    () => props.type,
    () => {
      mType.value = props.type;
    },
  );
  let currentRecord = ref({}); // 当前记录
  const flowData = ref({});
  const formKey = ref();
  const formRef = ref();
  // 任务节点表单key
  const taskFormKey = shallowRef();
  // 任务表单操作
  const taskFormRef = shallowRef();
  // 高亮数据
  const highLight = ref({});
  const recordActiveKey = ref('time');
  // 审批记录
  const approvalRecord = ref([]);
  // 注册模态框
  const [registerDrawer, { closeDrawer, setDrawerProps, changeLoading, changeOkLoading }] =
    useDrawerInner(async (data) => {
      currentRecord.value = data.record;
      activeKey.value = 'form';
      recordActiveKey.value = 'time';
      isFirstTaskNode.value =
        currentRecord.value?.isFirstTaskNode || currentRecord.value?.ext?.isFirstTaskNode;
      loadDetail();
      setDrawerProps({
        showFooter: isFirstTaskNode.value && mType.value != 'done',
      });
    });
  const activeKey = ref('form');
  // 是否第一个任务节点
  const isFirstTaskNode = ref(false);
  /**
   * 加载流程实例详情数据
   */
  const loadDetail = () => {
    // 流程详情
    wfProcessInstanceDetail({
      id: currentRecord.value.processInstanceId,
    }).then((data) => {
      formKey.value =
        componentMap.get(data?.jsonObject?.instanceUrl) || componentMap.get('defaultWfForm');
      flowData.value = data?.jsonObject || {};
      nextTick(() => {
        formRef.value?.setFieldsValue(data?.formData);
      });
    });
    // 高亮数据
    wfProcessInstanceHighLight({
      id: currentRecord.value.processInstanceId,
    }).then((data) => {
      highLight.value = data;
    });
    // 审批记录
    wfProcessInstanceApprovalRecord({
      id: currentRecord.value.processInstanceId,
    }).then((data) => {
      approvalRecord.value = data;
    });
    // 设置审批人回显文本
    wfProcessInstanceGetAssigneeTextData({
      id: currentRecord.value.processInstanceId,
    }).then((data) => {
      assigneeTextData.value = data;
    });
    // 流程任务详情
    wfProcessTaskDetail({
      id: currentRecord.value.id,
    }).then((data) => {
      taskFormKey.value =
        taskFormComponentMap.get(data?.formKey) || taskFormComponentMap.get('defaultTaskForm');
      nextTick(() => {
        if (mType.value == 'done') {
          taskFormRef.value?.setFieldsValue(data?.taskFormData);
        }
      });
    });
  };
  // 任务处理成功回调
  const handleTaskFormSuccess = () => {
    closeDrawer();
    emits('success');
  };
  /**
   * 确定
   */
  const handleOk = () => {
    formRef.value.validate().then(() => {
      const values = formRef.value.getFieldsValue();
      changeLoading(true);
      changeOkLoading(true);
      wfProcessTaskExecute({
        processTaskId: currentRecord.value.id,
        submitType: 5, // 重新填写提交
        ...values,
      }).then(() => {
        message.success('提交成功');
        changeLoading(false);
        changeOkLoading(false);
        closeDrawer();
        emits('success');
      });
    });
  };
</script>
<style lang="less" scoped>
  :deep(.m-tab-pane) {
    height: calc(100vh - 60px);
  }
</style>
