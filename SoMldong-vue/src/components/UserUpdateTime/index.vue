<template>
  <span class="user-update-time">
    {{ time }}
    by
    <PageList
      :api="sysUserSelect"
      :value="user"
      type="view"
      :cacheKey="`update-user-${user}`"
      :params="{ includeType: 2, includeIds: Array.isArray(user) ? user : [user] }"
      :replaceFields="{
        label: 'label',
        children: 'children',
        value: 'value',
      }"
      v-bind="$attrs"
    />
  </span>
</template>
<script>
  import { defineComponent } from 'vue';
  import { sysUserSelect } from '/@/api/sys/user';
  import PageList from '/@/components/PageList/index.vue';

  export default defineComponent({
    components: { PageList },
    props: {
      user: String,
      time: String,
    },
    setup() {
      return {
        sysUserSelect,
      };
    },
  });
</script>
