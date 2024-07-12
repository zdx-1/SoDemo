<template>
  <BasicModal
    :footer="null"
    title="调整搜索/列表排序"
    width="60%"
    v-bind="$attrs"
    @register="registerDrawer"
  >
    <a-row>
      <a-col :span="12">
        <a-card>
          <template #title>调整搜索表单字段排序</template>
          <template #extra>
            <div v-auth="['admin', 'dev:schema:updateSearchFormKeys']">
              <a-button size="small" type="link" @click="handleReset('searchFormKeys')"
                >重置</a-button
              >
              <a-button size="small" type="link" @click="handleClick('searchFormKeys')"
                >保存</a-button
              >
            </div>
          </template>
          <SortableTable
            rowKey="id"
            :canRowDrag="true"
            :showTableSetting="false"
            :showIndexColumn="false"
            @register="registerSearchFormKeysTable"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <template #title>调整列表字段排序</template>
          <template #extra>
            <div v-auth="['admin', 'dev:schema:updateListKeys']">
              <a-button size="small" type="link" @click="handleReset('listKeys')">重置</a-button>
              <a-button size="small" type="link" @click="handleClick('listKeys')">保存</a-button>
            </div>
          </template>
          <SortableTable
            rowKey="id"
            :canRowDrag="true"
            :showTableSetting="false"
            :showIndexColumn="false"
            @register="registerListKeysTable"
          />
        </a-card>
      </a-col>
    </a-row>
  </BasicModal>
</template>
<script setup>
  import { useModalInner, BasicModal } from '/@/components/Modal';
  import { ref } from 'vue';
  import { SortableTable, useTable } from '/@/components/Table';
  import { devSchemaDetail, updateListKeys, updateSearchFormKeys } from '/@/api/dev/schema';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  const schemaId = ref();
  const currentRecord = ref();
  // 声明Emits
  defineEmits(['register']);
  const columns = [
    {
      title: '列名',
      dataIndex: 'fieldName',
      component: 'Input',
    },
    {
      title: '注释',
      dataIndex: 'remark',
      component: 'Input',
    },
  ];
  // 注册表格
  const [
    registerSearchFormKeysTable,
    { setTableData: setSearchFormKeysTableData, getDataSource: getSearchFormKeysDataSource },
  ] = useTable({
    columns: columns,
  });
  // 注册表格
  const [
    registerListKeysTable,
    { setTableData: setListKeysTableData, getDataSource: getListKeysDataSource },
  ] = useTable({
    columns: columns,
  });
  const _setSearchFormKeysTableData = () => {
    devSchemaDetail({
      id: schemaId.value,
    }).then((res) => {
      currentRecord.value = res.data;
      const cloneData = cloneDeep(currentRecord.value);
      setSearchFormKeysTableData(
        cloneData?.columns
          ?.filter((column) => {
            return column?.ext?.search && column?.ext?.searchType;
          })
          ?.sort((a, b) => {
            if (a.searchSort === b.searchSort) {
              return Number(a.id) - Number(b.id);
            }
            return a.searchSort - b.searchSort;
          }) || [],
      );
    });
  };
  const _setListKeysTableData = () => {
    devSchemaDetail({
      id: schemaId.value,
    }).then((res) => {
      currentRecord.value = res.data;
      const cloneData = cloneDeep(currentRecord.value);
      setListKeysTableData(
        cloneData?.columns
          ?.filter((column) => {
            return !column?.ext?.listHide;
          })
          ?.sort((a, b) => {
            if (a.listSort === b.listSort) {
              return Number(a.id) - Number(b.id);
            }
            return a.listSort - b.listSort;
          }) || [],
      );
    });
  };
  // 注册抽屉
  const [registerDrawer, {}] = useModalInner(async (data) => {
    if (typeof data.record === 'object') {
      schemaId.value = data.record.schemaId;
      _setSearchFormKeysTableData();
      _setListKeysTableData();
    }
  });
  /**
   * 提交
   * @param {*} type
   * @param {*} data
   */
  const doSubmit = (type, data) => {
    if (type === 'searchFormKeys') {
      const searchFormKeys = data.map((item) => item.fieldName).join(',');
      return updateSearchFormKeys({
        id: schemaId.value,
        searchFormKeys,
      });
    } else {
      const listKeys = data.map((item) => item.fieldName).join(',');
      return updateListKeys({
        id: schemaId.value,
        listKeys,
      });
    }
  };
  /**
   * 重置
   * @param {*} type
   */
  const handleReset = (type) => {
    if (type === 'searchFormKeys') {
      doSubmit(type, []).then(() => {
        message.success('重置成功');
        _setSearchFormKeysTableData();
      });
    } else {
      doSubmit(type, currentRecord.value?.columns || []).then(() => {
        message.success('重置成功');
        _setListKeysTableData();
      });
    }
  };
  /**
   * 保存
   * @param {*} type
   */
  const handleClick = (type) => {
    if (type === 'searchFormKeys') {
      doSubmit(type, getSearchFormKeysDataSource() || []).then(() => {
        message.success('保存成功');
      });
    } else {
      doSubmit(type, getListKeysDataSource() || []).then(() => {
        message.success('保存成功');
      });
    }
  };
</script>
