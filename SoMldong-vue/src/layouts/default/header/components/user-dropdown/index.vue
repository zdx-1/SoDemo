<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <MenuItem
          key="gitee"
          :text="t('layout.header.dropdownItemGitee')"
          icon="gitee|svg"
          v-if="getShowDoc"
        />
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem key="pass" text="修改密码" icon="ion:lock-closed-outline" />
        <MenuItem
          key="unplay"
          text="退出扮演"
          icon="ion:log-out-outline"
          v-if="getUserInfo.isPlayer"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
  <Password ref="passwordRef" />
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu, message } from 'ant-design-vue';

  import { defineComponent, computed, ref } from 'vue';

  import { DOC_URL, GITHUB_URL } from '/@/settings/siteSetting';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';

  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';
  import Password from './password.vue';
  import { router } from '/@/router';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { unPlayUser } from '/@/api/sys/user';
  import { useTabs } from '/@/hooks/web/useTabs';
  type MenuEvent = 'logout' | 'doc' | 'lock' | 'unplay' | 'pass' | 'gitee';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
      Password,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const passwordRef = ref();

      const getUserInfo = computed(() => {
        const { realName = '', avatar, desc, isPlayer = false } = userStore.getUserInfo || {};
        return { realName, avatar: avatar || headerImg, desc, isPlayer };
      });

      const [register, { openModal }] = useModal();

      function handleLock() {
        openModal(true);
      }
      // 退出扮演
      function handleUnPlay() {
        unPlayUser({}).then((data) => {
          userStore.setToken(data.token);
          userStore.setRefreshToken(data.refreshToken);
          message.success('退出扮演成功！');
          const { closeCurrent } = useTabs(router);
          closeCurrent();
          setTimeout(() => {
            location.reload();
          }, 600);
        });
      }
      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL);
      }
      // open gitee
      function openGitee() {
        openWindow(GITHUB_URL);
      }
      // 打开修改密码
      function openPass() {
        passwordRef.value.show();
      }

      function handleMenuClick(e: { key: MenuEvent }) {
        switch (e.key) {
          case 'logout':
            handleLoginOut();
            break;
          case 'gitee':
            openGitee();
            break;
          case 'doc':
            openDoc();
            break;
          case 'lock':
            handleLock();
            break;
          case 'pass':
            openPass();
            break;
          case 'unplay':
            handleUnPlay();
            break;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        passwordRef,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
