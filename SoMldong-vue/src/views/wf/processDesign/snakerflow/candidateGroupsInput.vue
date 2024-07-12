<template>
  <a-row>
    <a-col :span="22">
      <a-select
        v-model:value="mValue"
        allowClear
        mode="multiple"
        disabled
        v-bind="$attrs"
        :options="leftDataSource"
      />
    </a-col>
    <a-col :span="2">
      <a-button type="primary" @click="handleOpen">
        <template #icon><UsergroupAddOutlined /></template>
      </a-button>
    </a-col>
  </a-row>
  <BasicModal title="候选用户组配置" @register="register" :zIndex="9999" @ok="handleOk" width="60%">
    <a-row>
      <a-col :span="12">
        <a-card>
          <template #title>选择角色</template>
          <BasicTable
            rowKey="value"
            :showIndexColumn="false"
            :dataSource="leftDataSource"
            :rowSelection="rowSelection"
            :beforeFetch="handleBeforeFetch"
            @register="registerTable"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <template #title>已选角色</template>
          <BasicTable
            rowKey="value"
            :showIndexColumn="false"
            :columns="selectColumns"
            :dataSource="selectDataSource"
          >
            <!--操作项-->
            <template #action="{ record }">
              <TableAction
                :stopButtonPropagation="true"
                :actions="[
                  {
                    label: '删除',
                    onClick: handleDelete.bind(null, record),
                  },
                ]"
              />
            </template>
          </BasicTable>
        </a-card>
      </a-col>
    </a-row>
  </BasicModal>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { sysRoleSelect } from '/@/api/sys/role';
  import { UsergroupAddOutlined } from '@ant-design/icons-vue';
  import { nextTick } from 'vue';
  const [register, { openModal, closeModal }] = useModal();
  const props = defineProps({
    value: {
      type: String,
    },
  });
  const mValue = ref(props.value ? props.value?.split(',') : []);
  const emits = defineEmits(['update:value', 'change']);
  const columns = [
    {
      title: '角色名称',
      key: 'label',
      dataIndex: 'label',
    },
    {
      title: '唯一编码',
      key: 'ext.code',
      dataIndex: ['ext', 'code'],
    },
  ];
  const selectColumns = [
    {
      title: '角色名称',
      key: 'label',
      dataIndex: 'label',
    },
    {
      title: '唯一编码',
      key: 'ext.code',
      dataIndex: ['ext', 'code'],
    },
    {
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      width: '60px',
      slots: { customRender: 'action' },
    },
  ];

  const [registerTable, { deleteSelectRowByKey, setSelectedRowKeys }] = useTable({
    columns,
  });
  // 左侧数据源
  const leftDataSource = ref([]);
  // 已选数据源
  const selectDataSource = ref([]);
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys, rows) => {
      checkedKeys.value = keys;
      const leftAllIds = leftDataSource.value.map((item) => item.value);
      rows.forEach((row) => {
        const index = selectDataSource.value.findIndex((item) => item.value == row.value);
        if (index == -1) {
          selectDataSource.value.push(row);
        }
      });
      // 删除不在左边列表的值
      selectDataSource.value = selectDataSource.value.filter((item) => {
        if (keys.includes(item.value)) {
          return true;
        } else {
          if (!leftAllIds.includes(item.value)) {
            return true;
          }
        }
        return false;
      });
    },
  };
  watch(
    () => props.value,
    () => {
      mValue.value = props.value ? props.value?.split(',') : [];
    },
  );
  const handleBeforeFetch = (params) => {
    return {
      ...params,
    };
  };
  const handleOpen = () => {
    openModal();
    nextTick(() => {
      setSelectedRowKeys(mValue.value);
    });
  };
  const handleDelete = (record) => {
    selectDataSource.value = selectDataSource.value.filter((item) => {
      return record.id != item.id;
    });
    deleteSelectRowByKey(record.id);
  };
  const handleOk = () => {
    mValue.value = selectDataSource.value.map((item) => item.value);
    emits('update:value', mValue.value?.join(','));
    closeModal();
  };
  onMounted(() => {
    sysRoleSelect({
      includeType: 1,
      pageSize: 1000,
      extFieldNames: 'code',
    }).then((data) => {
      leftDataSource.value = data;
    });
  });
</script>
