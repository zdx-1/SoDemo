<template>
  <div class="clearfix">
    <a-alert :message="getHelpText" type="info" banner class="upload-modal-toolbar__text" />
    <a-spin :spinning="isUploadingRef">
      <a-upload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        list-type="picture-card"
        v-model:file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < maxNumber">
          <plus-outlined />
          <div class="ant-upload-text">上传</div>
        </div>
      </a-upload>
    </a-spin>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { defineComponent, ref, toRefs, unref, watch } from 'vue';
  import { basicProps } from './props';
  import { useUploadType } from './useUpload';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { buildUUID } from '/@/utils/uuid';
  import { UploadResultStatus } from './typing';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';

  import { checkFileType, checkImgType, getBase64WithFile } from './helper';

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  export default defineComponent({
    components: {
      PlusOutlined,
    },
    props: {
      ...basicProps,
      previewFileList: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['change', 'delete'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const previewVisible = ref(false);
      const previewImage = ref('');
      const { createMessage } = useMessage();
      const fileListRef = ref([]);
      const fileList = ref([]);
      const isUploadingRef = ref(false);

      const handleCancel = () => {
        previewVisible.value = false;
      };
      const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
      };
      const handleChange = ({ fileList: newFileList, file }) => {
        if (file.status == 'removed') {
          const newUrl = props.previewFileList.filter((item) => item != file.url);
          emit('delete', newUrl);
          return;
        }
        // const successFileList = newFileList.filter(
        //   (item) => item.status == UploadResultStatus.SUCCESS,
        // );
        // console.log('successFileList', successFileList);
        fileList.value = newFileList;
      };
      const { accept, helpText, maxNumber, maxSize } = toRefs(props);
      const { getAccept, getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      async function uploadApiByItem(item) {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;
          const { data } = await props.api?.(
            {
              data: {
                ...(props.uploadParams || {}),
              },
              file: item.file,
              name: props.name,
              filename: props.filename,
            },
            function onUploadProgress(progressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            },
          );
          if (data.code != 0) {
            item.status = UploadResultStatus.ERROR;
            return {
              success: false,
              error: data.msg,
            };
          }
          item.status = UploadResultStatus.SUCCESS;
          console.log('data', data);
          item.responseData = data.data;
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }
      // 点击开始上传
      async function handleStartUpload() {
        const { maxNumber } = props;
        if ((fileListRef.value.length + props.previewFileList?.length ?? 0) > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          const uploadFileList =
            fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            }),
          );
          isUploadingRef.value = false;
          // 生产环境:抛出错误
          const errorList = data.filter((item) => !item.success);
          if (errorList.length > 0) throw errorList;

          handleOk();
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }
      // 上传前校验
      function beforeUpload(file) {
        const { size, name } = file;
        const { maxSize } = props;
        const accept = unref(getAccept);
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        // 设置类型,则判断
        if (accept.length > 0 && !checkFileType(file, accept)) {
          createMessage.error(t('component.upload.acceptUpload', [accept.join(',')]));
          return false;
        }
        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };
        // 生成图片缩略图
        if (checkImgType(file)) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                thumbUrl,
                ...commonItem,
              },
            ];
            handleStartUpload();
          });
        } else {
          fileListRef.value = [...unref(fileListRef), commonItem];
          handleStartUpload();
        }
        return false;
      }
      // 提交保存数据到组件
      function handleOk() {
        const { maxNumber } = props;

        if (fileListRef.value.length > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        if (isUploadingRef.value) {
          return createMessage.warning(t('component.upload.saveWarn'));
        }
        const fileList = [];

        for (const item of fileListRef.value) {
          const { status, responseData } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            fileList.push(responseData.fullUrl);
          }
        }
        // 存在一个上传成功的即可保存
        if (fileList.length <= 0) {
          return createMessage.warning(t('component.upload.saveError'));
        }
        fileListRef.value = [];
        fileListRef.value = [];
        emit('change', fileList);
      }

      watch(
        () => props.previewFileList,
        (val) => {
          let files = [];
          if (Array.isArray(val) && val.length) {
            val.forEach((item, index) => {
              const itemSplit = item.split('/');
              files.push({
                uid: index,
                name: itemSplit[itemSplit.length - 1],
                status: 'success',
                url: item,
              });
            });
          }
          console.log('files', files);
          fileList.value = files;
        },
        {
          immediate: true,
        },
      );
      return {
        previewVisible,
        previewImage,
        fileList,
        handleCancel,
        handlePreview,
        handleChange,
        getStringAccept,
        beforeUpload,
        getHelpText,
        isUploadingRef,
      };
    },
  });
</script>
<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
