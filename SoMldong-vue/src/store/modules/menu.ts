import { defineStore } from 'pinia';
import { Menu } from '/@/router/types';

interface MenuState {
  menus: Array<Menu>;
}

export const useMenuStore = defineStore({
  id: 'menu-lock',
  state: (): MenuState => ({
    menus: [],
  }),
  getters: {
    getMenus(): Array<Menu> {
      return this.menus;
    },
  },
  actions: {
    /**
     * 设置路由菜单
     * @param menus
     */
    setMenus(menus: Array<Menu>) {
      this.menus = menus;
    },
    /**
     * 通过路由名称更新徽标数
     * @param routeName
     * @param badgeCount
     */
    updateMenuBadgeByRouteName(routeName: string, badgeCount: string | number | undefined) {
      const fun = (datas: Array<Menu>, code: string) => {
        if (!datas) return;
        datas.forEach((item: Menu) => {
          if (item.meta && item.name == code) {
            item.meta.badgeCount = badgeCount;
          }
          if (item.children) {
            fun(item.children, code);
          }
        });
      };
      fun(this.menus, routeName);
    },
    /**
     * 通过路由地址更新徽标数
     * @param routePath
     * @param badgeCount
     */
    updateMenuBadgeByRoutePath(routePath: string, badgeCount: string | number | undefined) {
      const fun = (datas: Array<Menu>, code: string) => {
        if (!datas) return;
        datas.forEach((item: Menu) => {
          if (item.meta && item.path == code) {
            item.meta.badgeCount = badgeCount;
          }
          if (item.children) {
            fun(item.children, code);
          }
        });
      };
      fun(this.menus, routePath);
    },
  },
});
