<template>
  <a-timeline style="margin-top: 20px">
    <a-timeline-item v-for="item in mApprovalRecord" :key="item.id">
      <a-row>
        <a-col :span="24">
          <a-space>
            <span>{{ item.displayName }}</span>
            <span>{{ item.finishTime }}</span>
          </a-space>
        </a-col>
        <a-col :span="24">
          <a-space>
            <span><UserOutlined /></span>
            <span>{{ item.ext?.u_realName }}</span>
            <span>
              <a-tag>
                <ApiDict code="wf_process_submit_type" :data="{ text: item.ext?.submitType }" />
              </a-tag>
            </span>
          </a-space>
        </a-col>
        <a-col :span="24">
          <a-space>
            <span><AliwangwangOutlined /></span>
            <span>{{ item.ext?.tf_approvalComment || '无' }}</span>
          </a-space>
        </a-col>
      </a-row>
    </a-timeline-item>
  </a-timeline>
</template>
<script setup>
  import { UserOutlined, AliwangwangOutlined } from '@ant-design/icons-vue';
  import ApiDict from '/@/components/view/components/ApiDict.vue';
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
</script>
