<template>
  <BasicDrawer
    width="60%"
    v-bind="$attrs"
    @register="registerDrawer"
    okText="确定"
    cancelText="取消"
    :showFooter="true"
    title="发起流程"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
      <a-tab-pane key="form" tab="表单">
        <component :is="formKey" ref="formRef" :flowData="flowData" />
      </a-tab-pane>
      <a-tab-pane key="process" tab="流程图">
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
    </a-tabs>
  </BasicDrawer>
</template>
<script setup>
  import 'element-plus/dist/index.css';
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { wfProcessDefineDetail, wfProcessDefineStartAndExecute } from '/@/api/wf/processDefine';
  import { componentMap } from './componentMap';
  // 导入组件库
  import SnakerFlowDesigner from 'snakerflow-designer-vue';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  const emits = defineEmits(['success', 'register']);
  let currentRecord = ref({}); // 当前记录
  const flowData = ref({});
  const formKey = ref();
  const formRef = ref();
  const router = useRouter();
  // 注册模态框
  const [registerDrawer, { changeOkLoading, closeDrawer, changeLoading, setDrawerProps }] =
    useDrawerInner(async (data) => {
      currentRecord.value = data.record;
      activeKey.value = 'form';
      setDrawerProps({
        showOkBtn: true,
        showCancelBtn: true,
      });
      loadDefine();
    });
  // 关闭模态框事件
  const handleCancel = () => {
    // 重置表单
  };
  const activeKey = ref('form');
  /**
   * 加载流程设计
   */
  const loadDefine = () => {
    wfProcessDefineDetail({
      id: currentRecord.value.id,
    }).then((data) => {
      formKey.value =
        componentMap.get(data?.jsonObject?.instanceUrl) || componentMap.get('defaultWfForm');
      flowData.value = data?.jsonObject || {};
    });
  };
  const handleTabChange = (key) => {
    setDrawerProps({
      showOkBtn: key == 'form',
      showCancelBtn: key == 'form',
    });
  };
  /**
   * 确定
   */
  const handleOk = () => {
    formRef.value.validate().then(() => {
      const values = formRef.value.getFieldsValue();
      changeLoading(true);
      changeOkLoading(true);
      wfProcessDefineStartAndExecute({
        processDefineId: currentRecord.value.id,
        ...values,
      })
        .then(() => {
          message.success('发起流程成功');
          emits('success');
          router.push({
            path: '/wf/processInstance/index',
          });
        })
        .finally(() => {
          changeLoading(false);
          changeOkLoading(false);
          closeDrawer();
        });
    });
  };
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-tabpane) {
    height: calc(100vh - 200px);
  }
</style>
