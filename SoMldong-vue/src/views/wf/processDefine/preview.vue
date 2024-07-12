<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="流程预览"
    :footer="null"
    :canFullscreen="false"
    :defaultFullscreen="true"
    @cancel="handleCancel"
    :showOkBtn="false"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="processGraph" tab="流程图">
        <SnakerFlowDesigner
          v-model="flowData"
          :showDoc="false"
          :viewer="true"
          nodeRenderType="html"
          :wfConfig="{
            showHelp: false,
          }"
        />
      </a-tab-pane>
      <a-tab-pane key="processData" tab="流程数据">
        <JsonPreview :data="flowData" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script setup>
  import 'element-plus/dist/index.css';
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { wfProcessDefineDetail } from '/@/api/wf/processDefine';
  import { JsonPreview } from '/@/components/CodeEditor';
  // 导入组件库
  import SnakerFlowDesigner from 'snakerflow-designer-vue';
  let currentRecord = reactive({}); // 当前记录
  const flowData = ref({});
  const activeKey = ref('processGraph');
  // 注册模态框
  const [registerModal, {}] = useModalInner(async (data) => {
    currentRecord = data.record;
    loadDesign();
  });
  // 关闭模态框事件
  const handleCancel = () => {
    // 重置表单
  };
  /**
   * 加载流程设计
   */
  const loadDesign = () => {
    wfProcessDefineDetail({
      id: currentRecord.id,
    }).then((data) => {
      flowData.value = data?.jsonObject || {};
    });
  };
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-tabpane) {
    height: calc(100vh - 100px);
    overflow-y: scroll;
  }
</style>
