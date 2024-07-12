<template>
  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <!-- 获取普通状态icon -->
    <Icon
      v-if="getDefIcon == 1"
      :icon="getIcon"
      :size="16"
      class="def-icon"
      style="display: inline-block"
    />
    <IconFont v-if="getDefIcon == 2" :type="getIcon" class="def-icon" />
    <!-- 获取hover下icon -->
    <Icon
      v-if="getHovDefIcon == 1"
      :icon="getHoverIcon"
      :size="16"
      class="hov-icon"
      style="display: none"
    />
    <IconFont v-if="getHovDefIcon == 2" :type="getHoverIcon" class="hov-icon" />

    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
      <a-badge class="badge-count" :count="item.meta?.badgeCount" />
    </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
        <a-badge class="badge-count" :count="item.meta?.badgeCount" />
      </span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <!-- 获取普通状态icon -->
      <Icon
        v-if="getDefIcon == 1"
        :icon="getIcon"
        :size="16"
        class="def-icon"
        style="display: inline-block"
      />
      <IconFont v-if="getDefIcon == 2" :type="getIcon" class="def-icon" />

      <!-- 获取hover下icon -->
      <Icon
        v-if="getHovDefIcon == 1"
        :icon="getHoverIcon"
        :size="16"
        class="hov-icon"
        style="display: none"
      />
      <IconFont v-if="getHovDefIcon == 2" :type="getHoverIcon" class="hov-icon" />

      <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
        {{ getI18nName }}
        <a-badge class="badge-count" :count="item.meta?.badgeCount" />
      </div>

      <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
        <a-badge class="badge-count" :count="item.meta?.badgeCount" />
      </span>
      <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
    </template>
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu } from '/@/router/types';

  import { defineComponent, computed, reactive, toRefs } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Icon from '/@/components/Icon/index';

  import MenuItem from './components/MenuItem.vue';
  import SubMenu from './components/SubMenuItem.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  // import { useMenuStore } from '/@/store/modules/menu';
  // import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      SubMenu,
      MenuItem,
      SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')),
      Icon,
    },
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      parent: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('simple-menu');
      const state = reactive({
        taskCount: [],
      });
      const getShowMenu = computed(() => !props.item?.meta?.hideMenu);
      const getIcon = computed(() => props.item?.icon);
      const getHoverIcon = computed(() => {
        if (props.item?.iconHover) {
          return props.item?.iconHover;
        } else {
          return props.item?.icon;
        }
      });
      const getDefIcon = computed(() => {
        const icoStr = props.item?.icon;
        let Num = 0;
        if (icoStr) {
          if (icoStr.startsWith('ion:') || icoStr.startsWith('ant-design:')) {
            Num = 1;
          } else {
            Num = 2;
          }
        }
        return Num;
      });
      const getHovDefIcon = computed(() => {
        const icoStr = props.item?.icon;
        let Num = 0;
        if (icoStr) {
          if (icoStr.startsWith('ion:') || icoStr.startsWith('ant-design:')) {
            Num = 1;
          } else {
            Num = 2;
          }
        }
        return Num;
      });
      // const menuStore = useMenuStore();
      // const userStore = useUserStore().taskCount;
      // menuStore.updateMenuBadgeByRoutePath('/biz/office', userStore.todo_all);
      // menuStore.updateMenuBadgeByRoutePath('/biz/office/todolist', userStore.todo_all);
      const getI18nName = computed(() => t(props.item?.name));
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });

      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        ...toRefs(state),
        prefixCls,
        menuHasChildren,
        getShowMenu,
        getIcon,
        getHoverIcon,
        getDefIcon,
        getHovDefIcon,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
      };
    },
  });
</script>
<style lang="less">
  @menu-prefix-cls: ~'@{namespace}';
  @simple-prefix-cls: ~'@{namespace}-simple-menu';
  .hov-icon {
    display: none;
  }
  .@{menu-prefix-cls}-menu-submenu-title {
    display: flex;
    align-items: center;
  }
  .@{menu-prefix-cls}-simple-menu-sub-title {
    height: 32px;
    display: inline-block;
    line-height: 32px;
  }
  .def-icon,
  .hov-icon {
    font-size: 18px;
    width: 32px;
    height: 32px;
    line-height: 28px;
  }
  .@{menu-prefix-cls}-menu-submenu-title,
  .@{menu-prefix-cls}-menu-item {
    &:hover {
      background-color: #3c4d62 !important;
    }
  }
  .@{simple-prefix-cls}__children {
    &.@{menu-prefix-cls}-menu-item-selected {
      .anticon {
        &.def-icon,
        &.hov-icon {
          background-color: rgba(255, 255, 255, 1);
          border-radius: 32px;
        }
      }
    }
  }
  :deep(.ant-badge-count) {
    top: 8px !important;
    right: -16px !important;
  }
  .badge-count {
    margin: 0 5px;
  }
</style>
