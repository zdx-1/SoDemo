<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="流程设计"
    :canFullscreen="false"
    :defaultFullscreen="true"
    @cancel="handleCancel"
    :footer="null"
    :showOkBtn="false"
  >
    <SnakerFlowDesigner
      v-if="show"
      v-model="flowData"
      @on-save="handleSave"
      :showDoc="false"
      nodeRenderType="html"
      :extendPropertyKeys="[
        'candidateUsers',
        'candidateGroups',
        'candidateHandler',
        'assigneeText',
      ]"
    >
      <template #form-item-process-instanceUrl="{ model, field }">
        <a-form :label-col="{ flex: '120px' }" :model="model">
          <a-form-item label="实例启动表单" :colon="false">
            <a-select
              v-model:value="model[field]"
              :options="wfFormOptions"
              :dropdownStyle="{ zIndex: 9999 }"
            />
          </a-form-item>
        </a-form>
      </template>
      <template #form-item-task-form="{ model, field }">
        <a-form :label-col="{ flex: '120px' }" :model="model">
          <a-form-item label="表单" :colon="false">
            <a-select
              v-model:value="model[field]"
              :options="taskFormOptions"
              :dropdownStyle="{ zIndex: 9999 }"
            />
          </a-form-item>
        </a-form>
      </template>
      <template #form-item-task-assignee="{ model, field }">
        <a-form :label-col="{ flex: '120px' }" :model="model">
          <a-form-item label="参与者" :colon="false">
            <a-radio-group v-model:value="assigneeConfigWay" button-style="outline" size="small">
              <a-radio-button :value="2">下拉选择</a-radio-button>
              <a-radio-button :value="1">文本输入</a-radio-button>
            </a-radio-group>
            <div style="margin-top: 8px">
              <AssigneeInput
                v-if="assigneeConfigWay == 2"
                v-model:value="model[field]"
                @setAssigneeText="handleSetAssigneeText($event, model)"
              />
              <a-input v-else v-model:value="model[field]" />
            </div>
          </a-form-item>
        </a-form>
      </template>
      <template #form-item-task-assignmentHandler="{ model, field }">
        <a-form :label-col="{ flex: '120px' }" :model="model">
          <a-form-item label="参与者处理类" :colon="false">
            <a-radio-group
              v-model:value="assignmentHandlerConfigWay"
              button-style="outline"
              size="small"
            >
              <a-radio-button :value="2">下拉选择</a-radio-button>
              <a-radio-button :value="1">文本输入</a-radio-button>
            </a-radio-group>
            <div style="margin-top: 8px">
              <ApiDict
                v-if="assignmentHandlerConfigWay == 2"
                v-model:value="model[field]"
                code="wf_assignment_handler"
                dataType="String"
                :dropdownStyle="{ zIndex: 9999 }"
                allowClear
              />
              <a-input v-else v-model:value="model[field]" />
            </div>
          </a-form-item>
          <a-form-item label="候选用户" :colon="false">
            <a-radio-group
              v-model:value="candidateUsersConfigWay"
              button-style="outline"
              size="small"
            >
              <a-radio-button :value="2">下拉选择</a-radio-button>
              <a-radio-button :value="1">文本输入</a-radio-button>
            </a-radio-group>
            <div style="margin-top: 8px">
              <AssigneeInput
                v-if="candidateUsersConfigWay == 2"
                v-model:value="model.candidateUsers"
              />
              <a-input v-else v-model:value="model.candidateUsers" />
            </div>
          </a-form-item>
          <a-form-item label="候选用户组" :colon="false">
            <a-radio-group
              v-model:value="candidateGroupsConfigWay"
              button-style="outline"
              size="small"
            >
              <a-radio-button :value="2">下拉选择</a-radio-button>
              <a-radio-button :value="1">文本输入</a-radio-button>
            </a-radio-group>
            <div style="margin-top: 8px">
              <CandidateGroupsInput
                v-if="candidateGroupsConfigWay == 2"
                v-model:value="model.candidateGroups"
              />
              <a-input v-else v-model:value="model.candidateGroups" />
            </div>
          </a-form-item>
          <a-form-item label="候选人处理类" :colon="false">
            <a-radio-group
              v-model:value="candidateHandlerConfigWay"
              button-style="outline"
              size="small"
            >
              <a-radio-button :value="2">下拉选择</a-radio-button>
              <a-radio-button :value="1">文本输入</a-radio-button>
            </a-radio-group>
            <div style="margin-top: 8px">
              <ApiDict
                v-if="candidateHandlerConfigWay == 2"
                v-model:value="model.candidateHandler"
                code="wf_candidate_handler"
                dataType="String"
                :dropdownStyle="{ zIndex: 9999 }"
                allowClear
              />
              <a-input v-else v-model:value="model.candidateHandler" />
            </div>
          </a-form-item>
        </a-form>
      </template>
    </SnakerFlowDesigner>
  </BasicModal>
</template>
<script setup>
  import 'element-plus/dist/index.css';
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { wfProcessDesignDetail, updateDefine } from '/@/api/wf/processDesign';
  import ApiDict from '/@/components/Form/src/components/ApiDict.vue';
  // 导入组件库
  import SnakerFlowDesigner from 'snakerflow-designer-vue';
  import { message } from 'ant-design-vue';
  import { wfFormOptions } from '../processDefine/componentMap';
  import { taskFormOptions } from '../processTask/componentMap';
  import AssigneeInput from './snakerflow/assigneeInput.vue';
  import CandidateGroupsInput from './snakerflow/candidateGroupsInput.vue';
  const emits = defineEmits(['success', 'register']);
  let currentRecord = ref({}); // 当前记录
  const flowData = ref({});
  const show = ref(false);
  const assigneeConfigWay = ref(2);
  const assignmentHandlerConfigWay = ref(2);
  const candidateUsersConfigWay = ref(2);
  const candidateGroupsConfigWay = ref(2);
  const candidateHandlerConfigWay = ref(2);
  // 注册模态框
  const [registerModal, {}] = useModalInner(async (data) => {
    currentRecord.value = data.record;
    show.value = true;
    loadDesign();
  });
  // 关闭模态框事件
  const handleCancel = () => {
    // 重置表单
    show.value = false;
  };
  /**
   * 加载流程设计
   */
  const loadDesign = () => {
    wfProcessDesignDetail({
      id: currentRecord.value.id,
    }).then((data) => {
      flowData.value = data?.jsonObject || {};
    });
  };
  /**
   * 保存流程设计
   * @param  data
   */
  const handleSave = (data) => {
    updateDefine({
      processDesignId: currentRecord.value.id,
      displayName: currentRecord.value.displayName,
      name: currentRecord.value.name,
      type: currentRecord.value.type,
      ...(flowData.value?.json || flowData.value),
      ...data.json,
    }).then(() => {
      message.success('保存成功');
      emits('success');
    });
  };
  // 设置参与人回显文本
  const handleSetAssigneeText = (text, model) => {
    model.assigneeText = text;
  };
</script>
