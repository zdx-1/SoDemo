<template>
  <div>
    <BasicTable @register="registerTable">
      <template v-for="col in ['name', 'url', 'method']" #[col]="{ index }" :key="col">
        <div>
          <a-select
            v-if="col == 'method'"
            v-model:value="mValue[index][col]"
            :options="[
              {
                label: 'post',
                value: 'post',
              },
              {
                label: 'get',
                value: 'get',
              },
            ]"
          />
          <a-input v-else allowClear v-model:value="mValue[index][col]" style="margin: -5px 0" />
        </div>
      </template>
      <!--操作项-->
      <template #action="{ index }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '上移',
              onClick: handleUpDown.bind(null, index, 'up'),
              disabled: index == 0,
            },
            {
              label: '下移',
              onClick: handleUpDown.bind(null, index, 'down'),
              disabled: index == mValue.length - 1,
            },
            {
              label: '添加',
              onClick: handleAdd.bind(null, index),
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, index),
            },
          ]"
        />
      </template>
      <template #customActionTitle>
        操作<a-button size="small" type="link" @click="handleAdd((mValue.length || 1) - 1)"
          >添加</a-button
        >
      </template>
    </BasicTable>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { isArray } from '/@/utils/is';
  const props = defineProps({
    value: {
      type: Array,
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  const mValue = ref(isArray(props.value) && props.value && props.value.length ? props.value : []);
  // 注册表格
  const [registerTable] = useTable({
    columns: [
      {
        title: '接口名称',
        dataIndex: 'name',
        slots: { customRender: 'name' },
      },
      {
        title: '接口地址',
        dataIndex: 'url',
        slots: { customRender: 'url' },
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        slots: { customRender: 'method' },
      },
      {
        // flag: 'ACTION',
        // title: '操作',
        key: 'ACTION',
        dataIndex: 'ACTION',
        slots: { title: 'customActionTitle', customRender: 'action' },
      },
    ],
    dataSource: mValue,
    canResize: false,
    showIndexColumn: false,
  });
  const handleAdd = (index) => {
    const dataSource = cloneDeep(mValue.value);
    dataSource.splice(index + 1, 0, {
      name: '接口名称' + (mValue.value.length + 1),
      url: '',
      method: 'post',
    });
    mValue.value = dataSource;
  };
  const handleDelete = (index) => {
    const dataSource = cloneDeep(mValue.value);
    dataSource.splice(index, 1);
    mValue.value = dataSource;
  };
  const handleUpDown = (index, type) => {
    const dataSource = cloneDeep(mValue.value);
    if (type == 'up' && index > 0) {
      const temp = dataSource[index];
      dataSource[index] = dataSource[index - 1];
      dataSource[index - 1] = temp;
    } else if (type == 'down' && index < dataSource.length - 1) {
      const temp = dataSource[index];
      dataSource[index] = dataSource[index + 1];
      dataSource[index + 1] = temp;
    }
    mValue.value = dataSource;
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
    (val) => {
      if (val && isArray(val) && val.length) {
        mValue.value = val;
      }
    },
    { immediate: true },
  );
</script>
