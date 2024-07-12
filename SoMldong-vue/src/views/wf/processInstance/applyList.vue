<template>
  <PageWrapper>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="list" tab="发起流程">
        <template v-for="item in dataSource" :key="item.type">
          <a-card v-if="item.items.length" :title="item.title">
            <a-row>
              <a-col
                v-for="itemm in item.items"
                :xs="6"
                :sm="6"
                :md="8"
                :lg="4"
                :xl="3"
                :key="itemm.id"
              >
                <a-space style="cursor: pointer" @click="handleClick(itemm)">
                  <span><Icon size="48" :icon="itemm.icon" /></span>
                  <span>{{ itemm.displayName }}</span>
                </a-space>
              </a-col>
            </a-row>
          </a-card>
        </template>
      </a-tab-pane>
      <!-- <a-tab-pane key="draft" tab="我的草稿">开发中……</a-tab-pane> -->
    </a-tabs>
    <StartProcess @register="registerStartProcessDrawer" />
  </PageWrapper>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { wfProcessDesignListByType } from '/@/api/wf/processDesign';
  import { Icon } from '/@/components/Icon';
  import StartProcess from '../processDefine/startProcess.vue';
  import { useDrawer } from '/@/components/Drawer';
  const [registerStartProcessDrawer, { openDrawer: openStartProcessDrawer }] = useDrawer();

  const activeKey = ref('list');
  const dataSource = ref([]);
  const handleClick = (itemm) => {
    openStartProcessDrawer(true, {
      record: {
        id: itemm.processDefineId,
      },
    });
  };
  onMounted(() => {
    wfProcessDesignListByType({}).then((data) => {
      dataSource.value = data;
    });
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-scroll) {
    background: white;
  }
</style>
