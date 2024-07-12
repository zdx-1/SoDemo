<template>
  <div ref="basicTableWrapRef" class="m-basic-table-wrap">
    <BasicTable v-bind="$attrs" ref="basicTableRef">
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
  import { PropType, h, nextTick, onMounted, onUnmounted, ref, unref } from 'vue';
  import type { BasicColumn } from './types/table';
  import BasicTable from './BasicTable.vue';
  import Sortable from 'sortablejs';
  import { MenuOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  const props = defineProps({
    columns: {
      type: [Array] as PropType<BasicColumn[]>,
      default: () => [],
    },
    canRowDrag: {
      type: Boolean,
      default: true,
    },
  });
  const emits = defineEmits(['row-drag-end']);
  const sortableRef = ref();
  const basicTableRef = ref();
  const basicTableWrapRef = ref();
  const initRowDrap = () => {
    // 行排序处理
    sortableRef.value = Sortable.create(
      unref(basicTableWrapRef)?.querySelector('.ant-table-tbody') as any,
      {
        handle: '.m-table-row-drap-icon',
        ghostClass: 'm-table-row-drap-ghost',
        onEnd(e: any) {
          e.preventDefault();
          const cDataSource: any = unref(basicTableRef).getDataSource();
          const oldRecord = cDataSource[e.oldIndex];
          const newRecord = cDataSource[e.newIndex];
          cDataSource[e.newIndex] = oldRecord;
          cDataSource[e.oldIndex] = newRecord;
          unref(basicTableRef).setTableData(cDataSource);
          nextTick(() => {
            emits('row-drag-end', {
              ...e,
              oldRecord: oldRecord,
              newRecord: newRecord,
            });
          });
        },
      },
    );
    // 拖拽图标
    const newColumns = cloneDeep(unref(basicTableRef).getColumns());
    if (!newColumns) return;
    if (newColumns.length) {
      const firstColumn = newColumns[0];
      firstColumn.align = 'left';
      if (firstColumn.customRender) {
        const oldCustomRender = firstColumn.customRender;
        if (oldCustomRender.toString().indexOf('m-table-row-drap-icon') == -1) {
          firstColumn.customRender = (row: any) => {
            return h('span', {}, [
              h(MenuOutlined, {
                class: 'm-table-row-drap-icon',
              }),
              oldCustomRender(row),
            ]);
          };
        }
      } else {
        firstColumn.customRender = (row: any) => {
          return h('span', {}, [
            h(MenuOutlined, {
              class: 'm-table-row-drap-icon',
            }),
            h('span', {}, row.text),
          ]);
        };
      }
    }
    unref(basicTableRef).setColumns(newColumns);
  };
  onMounted(() => {
    if (props.canRowDrag) {
      initRowDrap();
    }
  });
  onUnmounted(() => {
    if (sortableRef.value) {
      sortableRef.value.destroy();
    }
  });
</script>
<style scoped lang="less">
  :deep(.m-table-row-drap-icon) {
    cursor: pointer;
    margin-right: 12px;
  }
</style>
