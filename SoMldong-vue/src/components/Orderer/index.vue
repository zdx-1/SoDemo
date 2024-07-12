<template>
  <div>
    <span>{{ formateValue }}</span>
    <a-tooltip v-if="record">
      <template #title>修改订货人</template>
      <EditOutlined @click="handleEditStaff" />
    </a-tooltip>
  </div>
  <Modal @register="registerAddModal" @success="handleSuccess" />
</template>
<script>
  import { defineComponent, ref, watch } from 'vue';
  import { EditOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';

  import Modal from './modal.vue';

  export default defineComponent({
    components: { EditOutlined, Modal },
    props: {
      record: [Object],
      value: [Object, Array],
    },
    emits: ['success'],
    setup(props, ctx) {
      const formateValue = ref('');
      const [registerAddModal, { openModal, setModalProps }] = useModal();

      const handleEditStaff = () => {
        openModal(true, {
          record: props.record,
        });
        setModalProps({ title: '店铺用户列表' });
      };

      const handleSuccess = () => {
        ctx.emit('success');
      };

      watch(
        () => props.value,
        () => {
          formateValue.value = props.value;
          if (Array.isArray(props.value)) {
            const names = [];
            props.value.forEach((item) => {
              names.push(`${item.realName}（${item.mobilePhone}）`);
            });
            // formateValue.value = names.join(';');

            formateValue.value = names.length;
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      return {
        handleEditStaff,
        registerAddModal,
        handleSuccess,
        formateValue,
      };
    },
  });
</script>
