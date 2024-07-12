<template>
  <TableImg
    :size="60"
    :imgList="imgList"
    v-if="imgList.length && column?.componentProps?.pictureCard"
  />
  <span v-else>
    <template v-for="url in imgList" :key="url">
      <TableImg v-if="isImg(url)" :size="60" :imgList="[url]" />
      <div v-else>{{ url }}</div>
    </template>
  </span>
</template>
<script setup lang="ts" name="Upload">
  import { computed, PropType } from 'vue';
  import { BasicColumn, TableImg } from '/@/components/Table';
  import { isArray } from '/@/utils/is';
  const props = defineProps({
    data: {
      // 当前行数据
      type: Object,
    },
    column: {
      // 列定义
      type: Object as PropType<BasicColumn>,
    },
  });
  // 定义一个函数，判断是否是图片
  const isImg = (url: string) => {
    return /\.(gif|jpg|jpeg|png|webp|svg|psd|bmp|tiff|tga)$/.test(url);
  };
  const imgList = computed(() => {
    if (props.data?.text && isArray(props.data?.text)) {
      return props.data?.text;
    }
    if (props.data?.text) {
      return props.data?.text.split(',');
    }
    return [];
  });
</script>
<style lang="less" scoped></style>
