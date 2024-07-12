import { AppRouteRecordRaw } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
const menu: AppRouteRecordRaw = {
  name: 'wf:manager',
  path: '/wf/manager',
  component: LAYOUT,
  meta: {
    title: '工作流程',
    icon: 'ant-design:laptop-outlined',
    perms: ['admin', 'wf:manager'],
    orderNo: 100,
    component: 'LAYOUT',
  },
  children: [
    {
      name: 'wf:processDesign',
      path: '/wf/processDesign/index',
      component: () => import('/@/views/wf/processDesign/index.vue'),
      meta: {
        title: '流程设计',
        icon: 'ant-design:book-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processDesign'],
        component: '/wf/processDesign/index',
        btns: {
          'wf:processDesign:page': '分页查询流程设计',
          'wf:processDesign:detail': '查看流程设计详情',
          'wf:processDesign:save': '添加流程设计',
          'wf:processDesign:update': '修改流程设计',
          'wf:processDesign:remove': '删除流程设计',
          'wf:processDesign:updateDefine': '保存流程设计定义',
          'wf:processDesign:deploy': '部署流程定义',
          'wf:processDesign:redeploy': '重新部署流程定义',
        },
      },
    },
    {
      name: 'wf:processDefine',
      path: '/wf/processDefine/index',
      component: () => import('/@/views/wf/processDefine/index.vue'),
      meta: {
        title: '流程定义',
        icon: 'ant-design:picture-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processDefine'],
        component: '/wf/processDefine/index',
        btns: {
          'wf:processDefine:page': '分页查询流程定义',
          'wf:processDefine:detail': '查看流程定义详情',
          'wf:processDefine:remove': '删除流程定义',
          'wf:processDefine:upAndDown': '启用/禁用流程定义',
          'wf:processDefine:startAndExecute': '发起流程',
        },
      },
    },
    {
      name: 'wf:processDesign:listByType',
      path: '/wf/processInstance/applyList',
      component: () => import('/@/views/wf/processInstance/applyList.vue'),
      meta: {
        title: '发起申请',
        icon: 'ion:grid-outline',
        orderNo: 210,
        perms: ['admin', 'wf:processDesign:listByType'],
        component: '/wf/processInstance/applyList',
      },
    },
    {
      name: 'wf:processInstance',
      path: '/wf/processInstance/index',
      component: () => import('/@/views/wf/processInstance/index.vue'),
      meta: {
        title: '我发起的',
        icon: 'ant-design:form-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processInstance'],
        component: '/wf/processInstance/index',
        btns: {
          'wf:processInstance:page': '分页查询流程定义',
          'wf:processInstance:detail': '查看流程定义详情',
          'wf:processInstance:startAndExecute': '发起流程',
          'wf:processInstance:withdraw': '撤回流程',
        },
      },
    },
    {
      name: 'wf:processTask:todoList',
      path: '/wf/processTask/todo',
      component: () => import('/@/views/wf/processTask/todo.vue'),
      meta: {
        title: '我的待办',
        icon: 'ant-design:mail-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processTask:todoList'],
        component: '/wf/processTask/todo',
        btns: {
          'wf:processTask:todoList': '分页查询我的待办',
          'wf:processTask:execute': '办理',
          'wf:processTask:surrogate': '委托',
        },
      },
    },
    {
      name: 'wf:processTask:doneList',
      path: '/wf/processTask/done',
      component: () => import('/@/views/wf/processTask/done.vue'),
      meta: {
        title: '我的已办',
        icon: 'ant-design:read-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processTask:doneList'],
        component: '/wf/processTask/done',
        btns: {
          'wf:processTask:todoList': '分页查询我的已办',
          'wf:processTask:doneDetail': '已办详情',
        },
      },
    },
    {
      name: 'wf:processInstance:ccList',
      path: '/wf/processInstance/ccList',
      component: () => import('/@/views/wf/processInstance/ccList.vue'),
      meta: {
        title: '我的抄送',
        icon: 'ant-design:edit-outlined',
        orderNo: 210,
        perms: ['admin', 'wf:processInstance:ccList'],
        component: '/wf/processInstance/ccList',
        btns: {
          'wf:processInstance:ccList': '分页查询我的抄送',
        },
      },
    },
  ],
};

export default menu;
