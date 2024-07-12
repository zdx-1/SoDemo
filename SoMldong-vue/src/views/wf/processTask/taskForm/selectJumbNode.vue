<template>
  <a-modal
    v-model:visible="visible"
    title="选择节点"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
  >
    <a-form
      style="margin-top: 20px"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="节点" name="taskName">
        <a-select v-model:value="formState.taskName" placeholder="请选择节点" allowClear>
          <a-select-option v-for="item in nodeList" :key="item.value" :value="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import { jumpAbleTaskNameList } from '/@/api/wf/processTask';
  const emits = defineEmits(['ok']);
  const visible = ref(false);
  // 节点列表
  const nodeList = ref([]);
  const formRef = ref();
  const confirmLoading = ref(false);
  const formState = reactive({
    taskName: '',
  });
  const rules = reactive({
    taskName: [{ required: true, message: '请选择节点', trigger: 'blur' }],
  });
  const handleOk = () => {
    formRef.value?.validate().then((values) => {
      emits('ok', values);
    });
  };
  defineExpose({
    // 显示弹窗
    openModal(data) {
      visible.value = true;
      jumpAbleTaskNameList({
        processInstanceId: data.processInstanceId,
      }).then((data) => {
        nodeList.value = data || [];
      });
    },
    // 关闭弹窗
    closeModal() {
      visible.value = false;
    },
    // 修改确认按钮状态
    changeOkLoading(b) {
      confirmLoading.value = b;
    },
  });
</script>
