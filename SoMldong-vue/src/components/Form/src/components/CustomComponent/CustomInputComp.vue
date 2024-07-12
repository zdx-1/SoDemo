<template>
  <div class="my-comp">
    <a-input v-model:value="defvalue" @onChange="handleChange" v-bind="$attrs">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </a-input>
  </div>
</template>
<script>
  import { defineComponent, reactive, toRefs, watch } from 'vue';

  export default defineComponent({
    inheritAttrs: false,
    props: {
      api: {
        type: Function,
        default: null,
      },
      params: {
        type: [Object, String],
        default: () => ({}),
      },
      value: {
        type: [String, Number, Boolean],
      },
    },
    setup(props) {
      const state = reactive({
        defvalue: null,
      });
      const handleChange = (e) => {
        console.log(e);
      };
      watch(
        () => props.value,
        (val) => {
          // console.log('props', props);
          state.defvalue = val;
        },
      );
      return {
        ...toRefs(state),
        handleChange,
      };
    },
  });
</script>
