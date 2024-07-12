<template>
  <BasicForm @register="registerForm" v-bind="$attrs" />
</template>
<script setup name="schemaWfForm|元数据表单">
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  const props = defineProps({
    flowData: {
      type: Object,
    },
  });
  const mFlowData = ref(props.flowData);
  const defaultSchemaStr = `{
          "labelWidth": 100,
            "showResetButton": false,
            "showSubmitButton": false,
            "actionColOptions": {
              "span": 24
            },
          "schemas": []
        }`;
  // 该表单元数据后续可以根据流程定义信息去获取
  const schema = JSON.parse(mFlowData.value?.formSchemaJsonStr || defaultSchemaStr);
  // 注册表单
  const [registerForm, formAction] = useForm(schema);
  defineExpose({
    ...formAction,
  });
</script>
