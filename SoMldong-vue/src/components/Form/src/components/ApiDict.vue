<template>
  <ApiRadioGroup
    v-if="renderType == 'RadioGroup'"
    :api="apiFun"
    componentName="Dict"
    v-model:value="mValue"
    @change="handleChange"
  />
  <ApiSelect
    v-else
    :api="apiFun"
    componentName="Dict"
    v-model:value="mValue"
    @change="handleChange"
  />
</template>
<script lang="ts">
  import ApiSelect from './ApiSelect.vue';
  import ApiRadioGroup from './ApiRadioGroup.vue';

  import { defineComponent, ref, watch } from 'vue';
  import { isFunction } from '/@/utils/is';
  import { useDictStore } from '/@/store/modules/dict';
  type OptionsItem = { label: string; value: string; disabled?: boolean };
  export default defineComponent({
    name: 'ApiDict',
    components: {
      ApiSelect,
      ApiRadioGroup,
    },
    props: {
      dataType: {
        type: String,
      },
      value: [Array, Object, String, Number],
      code: {
        type: String,
      },
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: null,
      },
      renderType: {
        type: String,
        default: 'Select',
      },
    },
    emits: ['change', 'update:value', 'focus', 'onFocus'],
    setup(props, cxt) {
      const mDataType = ref(props.dataType);
      const handleValue = (val) => {
        let text = val;
        if (
          typeof text == 'string' &&
          (mDataType.value === 'Number' ||
            mDataType.value === 'number' ||
            mDataType.value === undefined)
        ) {
          text = Number(text);
        } else if ((mDataType.value === 'String' || mDataType.value === 'string') && text) {
          text = String(text);
        }
        return text;
      };
      const mValue = ref(handleValue(props.value));
      watch(
        () => props.dataType,
        () => {
          mDataType.value = props.dataType;
        },
      );
      watch(
        () => props.value,
        (val) => {
          let text = handleValue(val);
          mValue.value = text;
        },
        { immediate: true },
      );
      const dictStore = useDictStore();
      const apiFun = (params: any): Promise<OptionsItem[]> => {
        if (props.code) {
          return dictStore.requestData(props.code, mDataType.value) as any;
        } else if (props.api && isFunction(props.api)) {
          return props.api(params);
        } else {
          return Promise.resolve([]);
        }
      };
      const handleChange = (e) => {
        let v = handleValue(e);
        cxt.emit('change', v);
        cxt.emit('update:value', v);
        mValue.value = v;
      };
      return {
        apiFun,
        mValue,
        handleChange,
      };
    },
  });
</script>
