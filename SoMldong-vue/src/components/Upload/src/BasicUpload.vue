<template>
  <div>
    <UploadImages
      v-bind="bindValue"
      v-if="pictureCard"
      :previewFileList="fileList"
      @change="handleChange"
      @delete="handlePreviewChange"
    />
    <a-button-group v-else>
      <a-button type="primary" @click="openUploadModal" preIcon="carbon:cloud-upload">
        {{ t('component.upload.upload') }}
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview">
        <template #title>
          {{ t('component.upload.uploaded') }}
          <template v-if="fileList.length">
            {{ fileList.length }}
          </template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="fileList.length && showPreviewNumber">
            {{ fileList.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileList"
      @register="registerUploadModal"
      @change="handleChange"
      @delete="handleDelete"
    />

    <UploadPreviewModal
      :value="fileList"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
      @delete="handlePreviewDelete"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref, computed } from 'vue';
  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';
  import UploadImages from './UploadImages.vue';
  import { Icon } from '/@/components/Icon';
  import { Tooltip } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { uploadContainerProps } from './props';
  import { omit } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { uploadApi } from '/@/api/sys/upload';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip, UploadImages },
    props: {
      ...uploadContainerProps,
      pictureCard: Boolean,
    },
    emits: ['change', 'delete', 'preview-delete', 'update:value'],

    setup(props, { emit, attrs }) {
      const { t } = useI18n();
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();

      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

      const fileList = ref<string[]>([]);

      const showPreview = computed(() => {
        const { emptyHidePreview } = props;
        if (!emptyHidePreview) return true;
        return emptyHidePreview ? fileList.value.length > 0 : true;
      });

      const bindValue = computed(() => {
        const value = { ...attrs, ...props };
        if (!value.api || !isFunction(value.api)) {
          value.api = uploadApi;
        }
        return omit(value, 'onChange');
      });

      watch(
        () => props.value,
        (value = []) => {
          if (value) {
            if (isArray(value)) {
              fileList.value = value;
            } else {
              fileList.value = value.split(',');
            }
          } else {
            fileList.value = [];
          }
          // fileList.value = isArray(value) ? value : [];
        },
        { immediate: true },
      );

      // 上传modal保存操作
      function handleChange(urls: string[]) {
        fileList.value = [...unref(fileList), ...(urls || [])];
        if (props.responseType && props.responseType.toLocaleLowerCase() == 'string') {
          const fileListStr = fileList.value.join(',');
          emit('update:value', fileListStr);
          emit('change', fileListStr);
        } else {
          emit('update:value', fileList.value);
          emit('change', fileList.value);
        }
      }

      // 预览modal保存操作
      function handlePreviewChange(urls: string[]) {
        fileList.value = [...(urls || [])];
        emit('update:value', fileList.value);
        emit('change', fileList.value);
      }

      function handleDelete(record: Recordable) {
        emit('delete', record);
      }

      function handlePreviewDelete(url: string) {
        console.log('url', url);
        emit('preview-delete', url);
      }

      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        handlePreviewChange,
        registerPreviewModal,
        openPreviewModal,
        fileList,
        showPreview,
        bindValue,
        handleDelete,
        handlePreviewDelete,
        t,
      };
    },
  });
</script>
