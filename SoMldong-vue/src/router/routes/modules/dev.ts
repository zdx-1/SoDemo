import { AppRouteRecordRaw } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
const menu: AppRouteRecordRaw = {
  name: 'dev:manager',
  path: '/dev/manager',
  component: LAYOUT,
  meta: {
    title: '在线开发',
    icon: 'ant-design:cloud-outlined',
    perms: ['admin', 'dev:manager'],
    orderNo: 100,
    component: 'LAYOUT',
  },
  children: [
    {
      name: 'dev:schemaGroup',
      path: '/dev/schemaGroup/index',
      component: () => import('/@/views/dev/schemaGroup/index.vue'),
      meta: {
        title: '模型分组',
        icon: 'ant-design:group-outlined',
        orderNo: 0,
        perms: ['admin', 'dev:schemaGroup'],
        component: '/dev/schemaGroup/index',
        btns: {
          'dev:schemaGroup:page': '分页查询模型分组',
          'dev:schemaGroup:detail': '查看模型分组详情',
          'dev:schemaGroup:save': '添加模型分组',
          'dev:schemaGroup:update': '修改模型分组',
          'dev:schemaGroup:remove': '删除模型分组',
        },
      },
    },
    {
      name: 'dev:schema',
      path: '/dev/schema/index',
      component: () => import('/@/views/dev/schema/index.vue'),
      meta: {
        title: '数据模型',
        icon: 'ant-design:database-outlined',
        orderNo: 1,
        perms: ['admin', 'dev:schema'],
        component: '/dev/schema/index',
        btns: {
          'dev:schema:page': '分页查询数据模型',
          'dev:schema:detail': '查看数据模型详情',
          'dev:schema:save': '添加数据模型',
          'dev:schema:update': '修改数据模型',
          'dev:schema:remove': '删除数据模型',
          'dev:schema:importTable': '导入数据库表',
          'dev:schema:getByTableName': '查看元数据',
          'dev:schemaField:page': '分页查询模型字段',
          'dev:schemaField:detail': '查看模型字段详情',
          'dev:schemaField:save': '添加模型字段',
          'dev:schemaField:update': '修改模型字段',
          'dev:schemaField:remove': '删除模型字段',
          'dev:schemaField:updateSort': '更新模型字段排序',
          'dev:schema:updateSearchFormKeys': '更新搜索表单字段Key',
          'dev:schema:updateListKeys': '更新列表字段Key',
        },
      },
    },
  ],
};

export default menu;
