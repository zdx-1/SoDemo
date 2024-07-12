<template>
  <UploadModal
    v-bind="{
      maxSize: maxSize,
      maxNumber: 1,
      responseType: 'string',
      accept: accept,
      api: uploadApi,
      ...$attrs,
    }"
    :zIndex="2000"
    :previewFileList="fileList"
    @register="registerUploadModal"
    @change="handleChange"
    @delete="handleDelete"
  />
</template>
<script setup>
  import UploadModal from '/@/components/Upload/src/UploadModal.vue';
  import { useModal } from '/@/components/Modal';
  import { uploadApi } from '/@/api/sys/upload';
  import { ref } from 'vue';
  const opsObjRef = ref();
  const fileList = ref([]);
  const accept = ref(undefined);
  const maxSize = ref(1024);
  const handleChange = (e) => {
    if (!e?.length) return;
    const { callback } = opsObjRef.value;
    callback(e[0]);
  };
  const handleDelete = (e) => {
    console.log(e);
  };
  const [registerUploadModal, { openModal }] = useModal();
  defineExpose({
    show(opsObj) {
      opsObjRef.value = opsObj;
      const { meta } = opsObj;
      if (meta.filetype == 'media') {
        accept.value = ['mp4', 'avi', 'rmvb', 'mkv', 'flv', 'wmv', 'mov', 'webm'];
        maxSize.value = 1024;
        // callback('mypage.html', { text: 'My text' });
      } else if (meta.filetype == 'image') {
        accept.value = ['gif', 'jpg', 'jpeg', 'png', 'webp', 'svg'];
        maxSize.value = 2;
      } else {
        accept.value = undefined;
        maxSize.value = 1024;
      }
      openModal();
    },
  });
</script>
