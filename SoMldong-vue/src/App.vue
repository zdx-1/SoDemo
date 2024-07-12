<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
<style lang="less">
  .ant-input-textarea-show-count::after {
    position: absolute;
    right: 20px;
    bottom: 25px;
  }
  .count-all {
    display: flex;
    align-items: center;
    .ant-statistic-content {
      font-size: 14px;
    }
    .ant-statistic {
      line-height: 100%;
    }
  }
</style>
