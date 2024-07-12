<template>
  <a-auto-complete
    :options="options"
    v-model:value="defValue"
    @select="onSelect"
    @search="debounceSearch"
    v-bind="$attrs"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </a-auto-complete>
</template>
<script>
  import { defineComponent, ref, watch } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { isFunction } from '/@/utils/is';
  import { defHttp } from '/@/utils/http/axios';

  export default defineComponent({
    props: {
      api: {
        type: [Function, String],
      },
      value: {
        type: [String, Array],
        default: () => {
          return null;
        },
      },
      // api params
      params: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['change', 'update:value'],
    setup(props, ctx) {
      const defValue = ref('');
      const options = ref([]);

      const handleSearch = (value) => {
        let api;
        if (typeof props.api === 'string' && props.api) {
          api = (params) => {
            return defHttp.post({ url: props.api, params });
          };
        } else {
          api = props.api;
        }
        if (!api || !isFunction(api)) return;
        api({ keywords: value, ...props.params }).then((res) => {
          options.value = res.map((item) => ({ value: item.label }));
        });
        emitData(value);
      };
      // 防抖
      const debounceSearch = useDebounceFn(handleSearch, 500);

      const onSelect = (value) => {
        emitData(value);
      };

      const emitData = (value) => {
        ctx.emit('change', value);
        ctx.emit('update:value', value);
      };

      watch(
        () => props.value,
        (value) => {
          defValue.value = value == null ? undefined : value;
        },
        { immediate: true },
      );

      return {
        options,
        defValue,
        debounceSearch,
        onSelect,
      };
    },
  });
</script>
