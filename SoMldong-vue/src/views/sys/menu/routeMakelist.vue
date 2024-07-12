<template>
  <PageWrapper>
    <div class="update-btn">
      <a-button type="primary" @click="handleUpdateRoute">同步路由清单</a-button>
    </div>
    <BasicTable
      class="table-wrap"
      rowKey="code"
      :pagination="false"
      :isTreeTable="true"
      :dataSource="dataSource"
      :columns="columns"
    >
      <template #type="{ record }">
        <a-tag color="orange" v-if="record.type == 1">目录</a-tag>
        <a-tag color="orange" v-else-if="record.type == 2">菜单</a-tag>
        <a-tag color="orange" v-else-if="record.type == 3">按钮</a-tag>
        <a-tag color="orange" v-else-if="record.type == 4">接口</a-tag>
        <a-tag color="blue" v-else>其他</a-tag>
      </template>
      <template #perms="{ record }">
        <a-tag :key="item" v-for="item in record.perms">{{ item }}</a-tag>
      </template>
      <template #ignoreSync="{ text }">
        <span>{{ text ? '否' : '是' }}</span>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script>
  import { message } from 'ant-design-vue';
  import { menuSyncRoute } from '/@/api/sys/menu';
  import { asyncRoutes } from '/@/router/routes';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable } from '/@/components/Table';
  import { omit } from 'lodash-es';
  import { h } from 'vue';
  import Icon from '/@/components/Icon';
  export default {
    components: {
      PageWrapper,
      BasicTable,
    },
    data() {
      return {
        dataSource: [],
        routeData: [],
        filterRoute: ['PageNotFound', 'About'], //需过滤掉的路由地址
        columns: [
          {
            title: '路由标题',
            dataIndex: 'name',
            key: 'name',
            customRender({ record }) {
              if (record.icon) {
                return h('span', {}, [
                  h(Icon, {
                    icon: record.icon,
                  }),
                  h(
                    'span',
                    {
                      style: {
                        paddingLeft: '6px',
                      },
                    },
                    record.name,
                  ),
                ]);
              } else {
                return h('span', {}, record.name);
              }
            },
          },
          {
            title: '菜单类型',
            dataIndex: 'type',
            key: 'type',
            slots: { customRender: 'type' },
          },
          {
            title: '路由名称(权限标识)',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: '是否同步',
            dataIndex: 'ignoreSync',
            key: 'ignoreSync',
            slots: { customRender: 'ignoreSync' },
          },
          {
            title: '可访问权限定义',
            dataIndex: 'perms',
            key: 'perms',
            slots: { customRender: 'perms' },
          },
        ],
      };
    },
    mounted() {
      this.dataSource = this.transformRoute(asyncRoutes);
      this.routeData = this.buildRouteList(asyncRoutes);
      console.log(this.routeData);
    },
    methods: {
      // 转换路由
      transformRoute(asyncRoutes) {
        const res = [];
        if (!asyncRoutes) return undefined;
        // 排序
        asyncRoutes.sort((a, b) => {
          return (a.meta.orderNo || 0) - (b.meta.orderNo || 0);
        });
        asyncRoutes.forEach((element) => {
          if (!this.filterRoute.includes(element.name)) {
            let children = this.transformRoute(element.children);
            if (!children) {
              children = this.transformBtns(element.meta.btns);
            }
            
            const componentName = element?.meta?.component;
            res.push({
              code: element.name,
              name: element.meta.title,
              sort: element.meta.orderNo || 999,
              path: element.path,
              type: ['LAYOUT', 'EMPTY_LAYOUT'].includes(componentName) ? 1 : 2,
              ignoreSync: element.meta.ignoreSync,
              icon: element.meta?.icon || '',
              isShow: element?.meta?.hideMenu !== true ? 0 : 1,
              isLink: element?.meta?.isLink === true ? 1 : 0,
              isCache: element?.meta?.ignoreKeepAlive !== true ? 0 : 1,
              isSync: element?.meta?.ignoreSync === true ? 0 : 1,
              perms: element.meta?.perms,
              openType: 1,
              ext: {
                ...omit(element.meta, ['title']),
              },
              children: children,
            });
          }
        });
        return res;
      },
      transformBtns(btns) {
        if (!btns || !Object.keys(btns).length) return undefined;
        return Object.keys(btns).map((key) => {
          return {
            code: key,
            name: btns[key],
            type: key.startsWith('btn:') ? 3 : 4,
          };
        });
      },
      // 生成同步路由清单
      buildRouteList(asyncRoutes) {
        const route = [];
        if (!asyncRoutes) return undefined;
        asyncRoutes.forEach((item) => {
          const componentName = item?.meta?.component;
          if (!this.filterRoute.includes(item.name)) {
            let children = this.buildRouteList(item.children);
            if (!children) {
              children = this.buildRouteBtns(item.meta.btns);
            }
            route.push({
              code: item.name,
              name: item.meta.title,
              sort: item.meta.orderNo || 999,
              path: item.path,
              component: componentName,
              type: ['LAYOUT', 'EMPTY_LAYOUT'].includes(componentName) ? 1 : 2,
              ignoreSync: item.meta.ignoreSync,
              icon: item.meta?.icon || '',
              isShow: item?.meta?.hideMenu !== true ? 0 : 1,
              isLink: item?.meta?.isLink === true ? 1 : 0,
              isCache: item?.meta?.ignoreKeepAlive !== true ? 0 : 1,
              isSync: item?.meta?.ignoreSync === true ? 0 : 1,
              openType: 1,
              ext: {
                ...omit(item.meta, ['title']),
              },
              children,
            });
          }
        });
        return route;
      },
      buildRouteBtns(btns) {
        if (!btns || !Object.keys(btns).length) return undefined;
        return Object.keys(btns).map((key) => {
          return {
            code: key,
            name: btns[key],
            code: key,
            name: btns[key],
            type: key.startsWith('btn:') ? 3 : 4,
            isSync: 1,
          };
        });
      },
      handleUpdateRoute() {
        menuSyncRoute(this.routeData).then(() => {
          message.success('路由同步成功！');
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  .table-wrap {
    margin: 12px;
    border-radius: 8px;
    overflow: hidden;
  }
  .update-btn {
    padding: 15px;
    text-align: right;
    background: #ffffff;
  }
</style>
