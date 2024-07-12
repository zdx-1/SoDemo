<template>
  <BasicModal
    v-model:visible="modalVisible"
    title="修改密码"
    :destroyOnClose="true"
    :canFullscreen="false"
    :maskClosable="false"
    :footer="null"
    width="600px"
    class="draftsItems"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item has-feedback label="原密码" name="password">
              <a-input-password v-model:value="form.password" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback label="新密码" name="newPassword">
              <a-input-password v-model:value="form.newPassword" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback label="重复新密码" name="checkPass">
              <a-input-password v-model:value="form.checkPass" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24" class="footer">
            <a-button type="primary" ghost @click="cancel">取消</a-button>
            <a-button type="primary" @click="handleSubmit">确定</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </BasicModal>
</template>
<script>
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal } from '/@/components/Modal';
  import { updatePwd } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicModal },
    setup() {
      const userStore = useUserStore();
      const formRef = ref();
      const state = reactive({
        confirmLoading: false,
        modalVisible: false,
        form: {
          password: '',
          newPassword: '',
          checkPass: '',
        },
      });

      let validatePass = async (rule, value) => {
        if (value === '' || value.length < 6) {
          return Promise.reject('请输入6位以上密码');
        } else {
          if (state.form.checkPass !== '') {
            formRef.value.validateFields('checkPass');
          }

          return Promise.resolve();
        }
      };

      let validatePass2 = async (rule, value) => {
        if (value === '') {
          return Promise.reject('请输入重复新密码');
        } else if (value !== state.form.newPassword) {
          return Promise.reject('重复新密码不相同');
        } else {
          return Promise.resolve();
        }
      };

      const rules = {
        password: [{ required: true, trigger: 'change', message: '请输入密码' }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'change' }],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
      };
      const show = () => {
        state.form = {
          password: '',
          newPassword: '',
          checkPass: '',
        };
        state.modalVisible = true;
      };

      const cancel = () => {
        state.confirmLoading = false;
        state.modalVisible = false;
      };

      const submitData = () => {
        state.confirmLoading = true;
        updatePwd({
          id: userStore.getUserInfo.userId,
          password: state.form.password,
          newPassword: state.form.newPassword,
        })
          .then(() => {
            message.success('密码修改成功！');
            cancel();
          })
          .catch(() => {
            state.confirmLoading = false;
          });
      };

      const handleSubmit = () => {
        if (state.confirmLoading) {
          return;
        }
        formRef.value.validate().then(() => {
          submitData();
        });
      };

      return {
        ...toRefs(state),
        handleSubmit,
        show,
        cancel,
        formRef,
        rules,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
<style lang="less" scoped>
  .footer {
    text-align: center;
    .ant-btn {
      margin: 0 10px;
    }
  }
</style>
