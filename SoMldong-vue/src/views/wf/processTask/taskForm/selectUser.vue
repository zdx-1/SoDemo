<template>
  <div>
    <a-row>
      <a-col :span="14">
        <a-select
          v-model:value="mValue"
          :options="selectOptions"
          :disabled="true"
          v-bind="props.formValues?.schema?.componentProps || {}"
        />
      </a-col>
      <a-col :span="6" style="margin-left: 8px">
        <a-space>
          <a-button type="primary" @click="handleSelectUser">
            <template #icon><SearchOutlined /></template>
            选择
          </a-button>
          <a-button type="primary" @click="handleClear">
            <template #icon><ReloadOutlined /></template>
            清空
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <BasicModal
      @register="registerModal"
      okText="确定"
      cancelText="取消"
      title="用户列表"
      :canFullscreen="false"
      :defaultFullscreen="true"
      @ok="handleOk"
    >
      <a-row>
        <a-col :span="12">
          <a-card>
            <template #title>选择用户</template>
            <BasicTable
              rowKey="id"
              :showIndexColumn="false"
              :rowSelection="rowSelection"
              :beforeFetch="handleBeforeFetch"
              @register="registerTable"
            />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card>
            <template #title>已选用户</template>
            <BasicTable
              rowKey="id"
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
  </div>
</template>
<script setup>
  import { ref, watch, computed } from 'vue';
  import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { candidatePage } from '/@/api/wf/processTask';
  const [registerModal, { openModal, closeModal }] = useModal();
  const mValue = ref();
  const props = defineProps({
    value: {
      type: [String, Number, Array],
    },
    formValues: {
      type: Object,
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  const columns = [
    {
      title: '用户名',
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      key: 'realName',
      dataIndex: 'realName',
    },
    {
      title: '所属部门',
      dataIndex: 'deptId',
      component: 'ApiSelect',
      componentProps: {
        api: '/sys/dept/select',
      },
    },
  ];
  const selectColumns = [
    {
      title: '用户名',
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      key: 'realName',
      dataIndex: 'realName',
    },
    {
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      width: '60px',
      slots: { customRender: 'action' },
    },
  ];
  const [registerTable, { getDataSource, deleteSelectRowByKey, clearSelectedRowKeys }] = useTable({
    api: candidatePage,
    columns,
  });
  // 已选用户
  const selectDataSource = ref([]);
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys, rows) => {
      checkedKeys.value = keys;
      // 原始数据源
      const userDataSource = getDataSource();
      const userAllIds = userDataSource.map((item) => item.id);
      rows.forEach((row) => {
        const index = selectDataSource.value.findIndex((item) => item.id == row.id);
        if (index == -1) {
          selectDataSource.value.push(row);
        }
      });
      // 删除不在左边列表的值
      selectDataSource.value = selectDataSource.value.filter((item) => {
        if (keys.includes(item.id)) {
          return true;
        } else {
          if (!userAllIds.includes(item.id)) {
            return true;
          }
        }
        return false;
      });
    },
  };

  watch(
    () => mValue.value,
    () => {
      emits('update:value', mValue.value);
      emits('change', mValue.value);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.value,
    () => {},
    {
      deep: true,
    },
  );
  const selectOptions = computed(() => {
    return selectDataSource.value.map((item) => {
      return {
        label: item.realName,
        value: item.id,
      };
    });
  });
  const handleSelectUser = () => {
    openModal();
  };
  // 清空已选择用户
  const handleClear = () => {
    mValue.value = [];
    clearSelectedRowKeys();
    selectDataSource.value = [];
  };
  const handleBeforeFetch = (params) => {
    return {
      ...params,
      processTaskId: props.formValues?.schema?.componentProps?.bizData?.processTaskId,
    };
  };
  const handleDelete = (record) => {
    selectDataSource.value = selectDataSource.value.filter((item) => {
      return record.id != item.id;
    });
    deleteSelectRowByKey(record.id);
  };
  const handleOk = () => {
    mValue.value = selectDataSource.value.map((item) => item.id);
    closeModal();
  };
</script>
