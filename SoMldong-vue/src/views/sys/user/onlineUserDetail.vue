<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    :footer="null"
    title="在线用户详情"
    ><BasicTable
      ref="tableRef"
      rowKey="tokenValue"
      :dataSource="dataSource"
      :showTableSetting="false"
      :columns="columns"
      :canResize="false"
      :useSearchForm="false"
      :showIndexColumn="false"
    >
      <template #tableTitle
        >账号 {{ currentRecord.userName }} （{{ currentRecord.realName }}）目前已在
        {{ currentRecord.tokenList?.length }} 个客户端登录</template
      >
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '踢下线',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定踢下线吗？',
                confirm: handleDelete.bind(null, record, 'kickoutByTokenValue'),
              },
              disabled: record.isCurrentUser || record.superAdmin,
              tooltip:
                record.isCurrentUser || record.superAdmin
                  ? '当前用户或超级管理员不允许踢下线！'
                  : undefined,
              auth: ['admin', 'sys:user:kickoutByTokenValue'], // 根据权限控制是否显示: 有权限，会显示
            },
            {
              label: '强制注销',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定强制注销吗？',
                confirm: handleDelete.bind(null, record, 'logoutByTokenValue'),
              },
              disabled: record.isCurrentUser || record.superAdmin,
              tooltip:
                record.isCurrentUser || record.superAdmin
                  ? '当前用户或超级管理员不允许强制注销！'
                  : undefined,
              auth: ['admin', 'sys:user:logoutByTokenValue'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
  ></BasicModal>
</template>
<script setup>
  import { ref, h } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { logoutByTokenValue, kickoutByTokenValue } from '/@/api/sys/user';
  import { strToDateTime, diff, dateUtil, formatMilliseconds } from '/@/utils/dateUtil';
  import { message } from 'ant-design-vue';
  // 声明Emits
  const emits = defineEmits(['reload']);
  const currentRecord = ref({});
  const dataSource = ref([]);
  const tableRef = ref();
  const columns = [
    // 列定义
    {
      title: 'Token凭证',
      dataIndex: 'tokenValue',
    },
    // {
    //   title: '登录设备',
    //   dataIndex: 'device',
    // },
    {
      title: '登录于',
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
      title: '登录IP',
      dataIndex: 'loginIp',
    },
    {
      title: '浏览器',
      dataIndex: 'loginBrowser',
    },
    {
      title: '凭证失效于',
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
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  // 注册模态框
  const [registerModal, { openModal }] = useModal();
  // 多选删除
  const handleDelete = (record, type) => {
    const ids = [];
    if (record && record.tokenValue) {
      ids.push(record.tokenValue);
    }
    const api = type === 'logoutByTokenValue' ? logoutByTokenValue : kickoutByTokenValue;
    const msg = type === 'logoutByTokenValue' ? '强制注销成功' : '踢下线成功';
    api({
      ids: ids,
    }).then(() => {
      message.success(msg);
      dataSource.value = dataSource.value.filter((item) => !ids.includes(item.tokenValue));
      emits('reload');
    });
  };
  defineExpose({
    show(record) {
      currentRecord.value = record;
      dataSource.value = record.tokenList || [];
      openModal();
    },
  });
</script>
