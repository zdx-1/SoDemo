<template>
  <div class="desc-wrap">
    <template v-if="detailCard.length">
      <div class="desc-card" v-for="item in detailCard" :key="item.title">
        <a-spin :spinning="loadding">
          <Description
            class="desc-item"
            :title="item.title"
            :data="detailData"
            :schema="item.list"
            size="middle"
            :labelStyle="{ width: '180px' }"
            :contentStyle="{ width: '300px' }"
            v-if="Array.isArray(item.list) && item.list.length"
          />
        </a-spin>
      </div>
    </template>
    <div class="desc-single" v-else>
      <a-spin :spinning="loadding">
        <Description
          size="middle"
          bordered
          title="基本信息"
          :data="detailData"
          :schema="detailSchemas"
          :labelStyle="{ width: '180px' }"
          :contentStyle="{ width: '300px' }"
        >
          <template #b5="{ text }">
            <a>{{ text }}</a>
          </template>
        </Description>
      </a-spin>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Description } from '/@/components/Description/index';
  import { useDetailSchema } from '/@/hooks/web/useSchema';
  import { watch } from 'vue';
  const detailCard = ref([]);
  const detailSchemas = ref([]);
  const loadding = ref(false);
  const props = defineProps({
    tableName: {
      type: String,
    },
    detailData: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const initDetailSchema = () => {
    if (props.tableName) {
      useDetailSchema({
        tableName: props.tableName,
        detailCard,
        detailData: props.detailData,
      });
    }
  };
  onMounted(() => {
    initDetailSchema();
  });
  watch(
    () => props.tableName,
    () => {
      initDetailSchema();
    },
  );
  watch(
    () => props.detailData,
    () => {
      initDetailSchema();
    },
    {
      deep: true,
    },
  );
</script>
<style scoped lang="less">
  @import '/@/assets/styles/common-detail.less';
</style>
