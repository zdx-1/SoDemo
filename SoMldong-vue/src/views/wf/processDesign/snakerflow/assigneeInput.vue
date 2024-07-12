<template>
  <a-row>
    <a-col :span="22">
      <a-select
        v-model:value="mValue"
        allowClear
        mode="multiple"
        v-bind="$attrs"
        disabled
        :options="options"
      />
    </a-col>
    <a-col :span="2">
      <a-button type="primary" @click="handleClick">
        <template #icon><UserSwitchOutlined /></template>
      </a-button>
    </a-col>
  </a-row>
  <BasicModal title="参与者配置" @register="register" :zIndex="9999" @ok="handleOk">
    <BasicTree
      v-if="!treeDataLoad"
      ref="treeRef"
      :treeData="treeData"
      :checkedKeys="checkedKeys"
      :replaceFields="{ title: 'label', key: 'value' }"
      checkable
      defaultExpandAll
      @check="handleCheck"
    />
  </BasicModal>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { UserSwitchOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTree } from '/@/components/Tree/index';
  import { getDeptUserTree } from '/@/api/sys/user';
  const emits = defineEmits(['update:value', 'setAssigneeText']);
  const props = defineProps({
    value: {
      type: String,
    },
  });
  // 选项数据
  const mValue = ref(props.value ? props.value?.split(',') : []);
  const options = ref([]);
  const emitSetText = () => {
    const arr = [];
    checkedKeys.value.forEach((key) => {
      const option = options.value.find((option) => option.value == key);
      if (option) {
        arr.push(option.label);
      }
    });
    if (arr.length) {
      emits('setAssigneeText', arr.join(','));
    }
  };
  watch(
    () => props.value,
    () => {
      mValue.value = props.value ? props.value?.split(',') : [];
      checkedKeys.value = mValue.value;
      emitSetText();
    },
  );
  const [register, { openModal, closeModal }] = useModal();
  const treeRef = ref();
  const treeData = ref([]);
  const treeDataLoad = ref(true);
  const checkedKeys = ref(props.value ? props.value.split(',') : []);
  /**
   * 将树型数据转成列表数据
   */
  const treeDataToListData = (treeData) => {
    const res = [];
    treeData?.forEach((item) => {
      res.push({
        label: item.label,
        value: item.value,
      });
      if (item.children && item.children.length) {
        res.push(...treeDataToListData(item.children));
      }
    });
    return res;
  };
  onMounted(() => {
    treeDataLoad.value = true;
    getDeptUserTree({})
      .then((data) => {
        treeData.value = data;
        options.value = treeDataToListData(data);
        emitSetText();
      })
      .finally(() => {
        treeDataLoad.value = false;
      });
  });
  // 搜索选人
  const handleClick = () => {
    openModal(true);
  };
  // 树勾选事件处理
  const handleCheck = (data) => {
    checkedKeys.value = data;
  };
  // 确定
  const handleOk = () => {
    mValue.value = checkedKeys.value;
    emits('update:value', mValue.value?.join(','));
    closeModal();
  };
</script>
