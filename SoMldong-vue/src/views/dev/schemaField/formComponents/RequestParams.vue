<template>
  <div>
    <BasicTable @register="registerTable">
      <template v-for="col in ['label', 'value']" #[col]="{ index }" :key="col">
        <div>
          <a-input v-model:value="mValue[index][col]" style="margin: -5px 0" />
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
              disabled: mValue.length == 1,
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  const props = defineProps({
    value: {
      type: Array,
    },
  });
  const emits = defineEmits(['update:value', 'change']);
  /**
   * 对象转数组
   * @param {} obj
   */
  const objToArray = (obj) => {
    const res = [];
    if (obj && Object.keys(obj).length) {
      Object.keys(obj).forEach((key) => {
        res.push({
          label: key,
          value: obj[key],
        });
      });
    }
    return res;
  };
  /**
   * 数组转对象
   * @param {} obj
   */
  const arrayToObj = (arr) => {
    const obj = {};
    if (arr && arr.length) {
      arr.forEach((item) => {
        obj[item.label] = item.value;
      });
    }
    return obj;
  };
  const mValue = ref(
    objToArray(props.value).length
      ? objToArray(props.value)
      : [
          {
            label: 'labelKey',
            value: 'name',
          },
          {
            label: 'valueKey',
            value: 'id',
          },
        ],
  );
  // 注册表格
  const [registerTable] = useTable({
    columns: [
      {
        title: '键',
        dataIndex: 'label',
        slots: { customRender: 'label' },
      },
      {
        title: '值',
        dataIndex: 'value',
        width: '20%',
        slots: { customRender: 'value' },
      },
      {
        // flag: 'ACTION',
        title: '操作',
        key: 'ACTION',
        dataIndex: 'ACTION',
        slots: { customRender: 'action' },
      },
    ],
    dataSource: mValue,
    canResize: false,
    showIndexColumn: false,
  });
  const handleAdd = (index) => {
    const dataSource = cloneDeep(mValue.value);
    dataSource.splice(index + 1, 0, {
      label: 'key' + (mValue.value.length + 1),
      value: 'value' + (mValue.value.length + 1),
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
      const r = arrayToObj(mValue.value);
      emits('update:value', r);
      emits('change', r);
    },
    {
      deep: true,
    },
  );
</script>
