<template>
  <BasicDrawer
    width="60%"
    v-bind="$attrs"
    @register="registerDrawer"
    okText="确定"
    cancelText="取消"
    :showFooter="false"
    title="流程详情"
    :destroyOnClose="true"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="form" tab="表单">
        <component :is="formKey" ref="formRef" :disabled="true" :flowData="flowData" />
      </a-tab-pane>
      <a-tab-pane key="process" tab="流程图" class="m-tab-pane">
        <SnakerFlowDesigner
          v-if="activeKey == 'process'"
          v-model="flowData"
          :showDoc="false"
          :viewer="true"
          nodeRenderType="html"
          :assigneeText="assigneeTextData"
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
  import { reactive, ref, nextTick } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import ApprovalRecordTime from '../components/approvalRecordTime.vue';
  import ApprovalRecordTable from '../components/approvalRecordTable.vue';

  import {
    wfProcessInstanceDetail,
    wfProcessInstanceHighLight,
    wfProcessInstanceApprovalRecord,
    wfProcessInstanceGetAssigneeTextData,
  } from '/@/api/wf/processInstance';
  import { componentMap } from '../processDefine/componentMap';
  // 导入组件库
  import SnakerFlowDesigner from 'snakerflow-designer-vue';
  let currentRecord = reactive({}); // 当前记录
  const flowData = ref({});
  const formKey = ref();
  const formRef = ref();
  // 高亮数据
  const highLight = ref({});
  // 参与人回显数据
  const assigneeTextData = ref({});
  const recordActiveKey = ref('time');
  // 审批记录
  const approvalRecord = ref([]);
  // 注册模态框
  const [registerDrawer, {}] = useDrawerInner(async (data) => {
    currentRecord = data.record;
    activeKey.value = 'form';
    recordActiveKey.value = 'time';
    loadDetail();
  });
  const activeKey = ref('form');
  /**
   * 加载流程实例详情数据
   */
  const loadDetail = () => {
    // 流程详情
    wfProcessInstanceDetail({
      id: currentRecord.id,
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
      id: currentRecord.id,
    }).then((data) => {
      highLight.value = data;
    });
    // 审批记录
    wfProcessInstanceApprovalRecord({
      id: currentRecord.id,
    }).then((data) => {
      approvalRecord.value = data;
    });
    // 设置审批人回显文本
    wfProcessInstanceGetAssigneeTextData({
      id: currentRecord.id,
    }).then((data) => {
      assigneeTextData.value = data;
    });
  };
</script>
<style lang="less" scoped>
  :deep(.m-tab-pane) {
    height: calc(100vh - 60px);
  }
</style>
