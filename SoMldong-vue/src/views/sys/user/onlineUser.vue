<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    >
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '详情',
              icon: 'ant-design:eye-outlined',
              onClick() {
                onlineUserDetailRef?.show(record);
              },
            },
            {
              label: '踢下线',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定踢下线吗？',
                confirm: handleDelete.bind(null, record, 'kickoutByLoginId'),
              },
              disabled: record.isCurrentUser || record.superAdmin,
              tooltip:
                record.isCurrentUser || record.superAdmin
                  ? '当前用户或超级管理员不允许踢下线！'
                  : undefined,
              auth: ['admin', 'sys:user:kickoutByLoginId'], // 根据权限控制是否显示: 有权限，会显示
            },
            {
              label: '强制注销',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定强制注销吗？',
                confirm: handleDelete.bind(null, record, 'logoutByLoginId'),
              },
              disabled: record.isCurrentUser || record.superAdmin,
              tooltip:
                record.isCurrentUser || record.superAdmin
                  ? '当前用户或超级管理员不允许强制注销！'
                  : undefined,
              auth: ['admin', 'sys:user:logoutByLoginId'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template>
      <template #loginCount="{ record }">
        <a-tag color="blue">{{ record.tokenList?.length }}个客户端</a-tag>
      </template>
    </BasicTable>
    <OnlineUserDetail ref="onlineUserDetailRef" @reload="reload" />
  </PageWrapper>
</template>

<script setup>
  import { ref, h } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { onlineUserList, logoutByLoginId, kickoutByLoginId } from '/@/api/sys/user';
  import { message } from 'ant-design-vue';
  import OnlineUserDetail from './onlineUserDetail.vue';
  import { strToDateTime, diff, dateUtil, formatMilliseconds } from '/@/utils/dateUtil';
  const onlineUserDetailRef = ref();
  const columns = [
    // 列定义
    {
      title: '账户ID',
      dataIndex: 'id',
    },
    {
      title: '账户信息',
      dataIndex: 'userName',
      customRender({ record }) {
        return `${record.userName}（${record.realName}）`;
      },
    },
    {
      title: '会话创建于',
      dataIndex: 'loginTime',
      customRender({ record }) {
        return h('div', { class: 'text-center' }, [
          h('span', record.loginTime + ' - '),
          h(
            'span',
            {
              style: {
                color: 'green',
              },
            },
            formatMilliseconds(
              Math.abs(diff(strToDateTime(record.loginTime), new dateUtil(), 'ms')),
            ) + '前',
          ),
        ]);
      },
    },
    {
      title: '会话失效于',
      dataIndex: 'expireTime',
      customRender({ record }) {
        return h('div', { class: 'text-center' }, [
          h('span', record.expireTime + ' - '),
          h(
            'span',
            {
              style: {
                color: 'green',
              },
            },
            formatMilliseconds(
              Math.abs(diff(strToDateTime(record.expireTime), new dateUtil(), 'ms')),
            ) + '后',
          ),
        ]);
      },
    },
    {
      title: '登录数量',
      dataIndex: 'tokenList',
      slots: { customRender: 'loginCount' },
    },
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'keywords',
      label: '账户ID',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入账户ID',
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload }] = useTable({
    api: onlineUserList,
    columns: columns,
  });
  // 多选删除
  const handleDelete = (record, type) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    const api = type === 'logoutByLoginId' ? logoutByLoginId : kickoutByLoginId;
    const msg = type === 'logoutByLoginId' ? '强制注销成功' : '踢下线成功';
    api({
      ids: ids,
    }).then(() => {
      message.success(msg);
      reload();
    });
  };
</script>

<style lang="less" scoped></style>
