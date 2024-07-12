<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    title="选择店铺"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <div class="modal-form-wrap">
      <BasicTable
        rowKey="id"
        @register="registerTable"
        :beforeFetch="handleBeforeFetch"
        :useSearchForm="true"
        :rowSelection="rowSelection"
        :showIndexColumn="false"
        :clickToRowSelect="false"
        size="small"
        :scroll="{ y: 240 }"
        :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
      >
        <template #headerTop>
          <a-alert type="info" show-icon>
            <template #message>
              <template v-if="checkedKeys.length > 0">
                <span>已选中{{ checkedKeys.length }}条记录</span>
                <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
              </template>
              <template v-else>
                <span>未选中任何项目</span>
              </template>
            </template>
          </a-alert>
        </template>
        <!--操作项-->
        <!--左上角按钮-->
        <template #tableTitle>
          <TableAction :actions="[]" :dropDownActions="[]">
            <template #more>
              <a-button style="margin-left: 8px">
                批量操作
                <DownOutlined />
              </a-button>
            </template>
          </TableAction>
        </template>

        <template #shopType="{ text }">
          <ChangeCode code="biz_shop_shop_type" :value="text" />
        </template>

        <template #salesAreaId="{ text }">
          <PageList
            :api="salesAreaSelect"
            :value="text"
            type="view"
            :params="{ includeType: 1 }"
            :replaceFields="{
              label: 'label',
              children: 'children',
              value: 'value',
            }"
            cacheKey="salesAreaSelect"
          />
        </template>

        <template #defaultWarehouseId="{ text }">
          <PageList
            :api="warehouseSelect"
            :value="text"
            type="view"
            cacheKey="warehouseSelect"
            :params="{ includeType: 1 }"
            :replaceFields="{
              label: 'label',
              children: 'children',
              value: 'value',
            }"
          />
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';

  import ChangeCode from '/@/components/ChangeCode/index.vue';
  import PageList from '/@/components/PageList/index.vue';
  import { shopPage } from '/@/api/biz/shop';
  import { salesAreaSelect } from '/@/api/biz/salesArea';
  import { warehouseSelect } from '/@/api/biz/warehouse';
  import { salesAreaTree } from '/@/api/biz/salesArea';
  // 声明Emits
  const emit = defineEmits(['success']);
  const curData = ref(null);

  const columns = [
    // 列定义
    {
      title: '门店编号',
      dataIndex: 'shopCode',
    },
    {
      title: '门店名称',
      dataIndex: 'shopName',
    },
    {
      title: '门店类型',
      dataIndex: 'shopType',
      slots: { customRender: 'shopType' },
    },
    {
      title: '所属销售区域',
      dataIndex: 'salesAreaId',
      slots: { customRender: 'salesAreaId' },
    },
    {
      title: '默认发货仓',
      dataIndex: 'defaultWarehouseId',
      slots: { customRender: 'defaultWarehouseId' },
    },
  ];

  // 注册表格
  const [registerTable] = useTable({
    api: shopPage,
    columns: columns,
  });
  // 注册模态框
  const [registerModal, { closeModal }] = useModalInner(async (record) => {
    curData.value = record.data;
    checkedKeys.value = record.value;
  });

  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'keywords',
      label: '门店编号/名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入门店编号/名称',
      },
    },
    {
      field: 'm_IN_shopType',
      label: '门店类型',
      component: 'ApiDict',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请选择门店类型',
        code: 'biz_shop_shop_type',
        mode: 'multiple',
      },
    },
    {
      field: 'm_IN_salesAreaId',
      label: '所属销售区域',
      component: 'PageList',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请选择所属销售区域',
        api: salesAreaTree,
        multiple: true,
        cacheKey: 'salesAreaTree',
      },
    },
    {
      label: '默认发货仓',
      field: 'm_IN_defaultWarehouseId',
      component: 'PageList',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请选择默认发货仓',
        api: warehouseSelect,
        params: { includeType: 1 },
        multiple: true,
        replaceFields: {
          label: 'label',
          children: 'children',
          value: 'value',
        },
      },
    },
    {
      field: 'm_EQ_status',
      label: '订货权限',
      component: 'ApiDict',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请选择订货权限',
        code: 'yes_no',
      },
    },
  ];

  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: checkedKeys,
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };

  // 关闭
  const handleCancel = () => {
    checkedKeys.value = [];
  };

  const handleSubmit = () => {
    emit('success', checkedKeys.value);
    closeModal();
  };

  // 处理查询请求参数
  const handleBeforeFetch = (params) => {
    console.log('params', params);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] == 9999999999) {
          // 删除全部自定义的值-不提交到后端
          delete params[key];
        }
      });
    }
    return { ...params, shopId: curData.value.id, searchKeys: 'shopCode,shopName' };
  };
</script>
<style scoped lang="less">
  .common-form {
    :deep(.ant-row) {
      justify-content: space-between;
    }
  }
  .modal-form-wrap {
    padding: 12px;
  }
</style>
