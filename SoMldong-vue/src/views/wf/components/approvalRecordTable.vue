<template>
  <BasicTable :columns="columns" :showIndexColumn="false" :dataSource="mApprovalRecord" />
</template>
<script setup>
  import { BasicTable } from '/@/components/Table';
  import { ref, watch } from 'vue';
  const props = defineProps({
    approvalRecord: {
      type: Array,
    },
  });
  const mApprovalRecord = ref(props.approvalRecord || []);
  watch(
    () => props.approvalRecord,
    () => {
      mApprovalRecord.value = props.approvalRecord || [];
    },
    {
      deep: true,
    },
  );
  const columns = ref([
    {
      title: '节点名称',
      dataIndex: 'displayName',
    },
    {
      title: '操作人',
      dataIndex: ['ext', 'u_realName'],
    },
    {
      title: '操作类型',
      dataIndex: ['ext', 'submitType'],
      component: 'ApiDict',
      componentProps: {
        code: 'wf_process_submit_type',
      },
    },
    {
      title: '意见',
      dataIndex: ['ext', 'tf_approvalComment'],
    },
    {
      title: '附件',
      dataIndex: ['ext', 'tf_approvalAttachment'],
    },
    {
      title: '操作时间',
      dataIndex: 'finishTime',
    },
  ]);
</script>
