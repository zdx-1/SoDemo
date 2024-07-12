<template>
  <div class="my-input">
    <a-input v-bind="$attrs" @mousewheel="scrollFunc" @DOMMouseScroll="scrollFunc">
      <template #suffix="{ value }" v-if="$attrs.maxlength">
        {{ showAction(value) }}/{{ $attrs.maxlength }}
      </template>
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </a-input>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      function scrollFunc(evt) {
        evt = evt || window.event;
        if (evt.preventDefault) {
          // Firefox
          evt.preventDefault();
          evt.stopPropagation();
        } else {
          // IE
          evt.cancelBubble = true;
          evt.returnValue = false;
        }
        return false;
      }

      const showAction = (value) => {
        if (!value) return 0;
        return value.length || 0;
      };
      return {
        scrollFunc,
        showAction,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-input-suffix) {
    color: #ccc;
  }
</style>
