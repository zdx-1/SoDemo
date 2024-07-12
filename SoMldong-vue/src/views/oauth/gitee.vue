<template>
  <div class="container"><a-spin v-if="loading" /> </div>
</template>
<script setup>
  import { onMounted, ref, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { defHttp } from '/@/utils/http/axios';
  import { useLockStore } from '/@/store/modules/lock';
  import { Modal } from 'ant-design-vue';
  const route = useRoute();
  const router = useRouter();
  const lockStore = useLockStore();
  const loading = ref(true);
  onMounted(() => {
    defHttp
      .post({
        url: '/thirdParty/checkStarred',
        params: {
          code: route.query.code,
        },
      })
      .then((res) => {
        if (res?.flag) {
          lockStore.setCheckGitee(res.flag);
          loading.value = false;
          Modal.destroyAll();
          router.replace({
            path: '/dashboard',
          });
        } else {
          Modal.info({
            title: () => '提醒',
            keyboard: false,
            content: () =>
              h('div', {}, [
                h('p', [
                  h(
                    'a',
                    {
                      href: 'https://gitee.com/mldong/mldong',
                      target: '_blank',
                    },
                    '项目',
                  ),
                  '  点亮小星星才可以使用演示系统哦(◠‿◠)',
                ]),
              ]),
            okText: '跳转到项目',
            onOk() {
              window.location.href = `https://gitee.com/mldong/mldong`;
              return Promise.reject();
            },
          });
        }
      });
  });
</script>
<style lang="less" scoped>
  .container {
    display: flex; /* 将容器转为Flex布局 */
    justify-content: center; /* 水平居中对齐子项目 */
    margin-top: 300px;
  }
</style>
