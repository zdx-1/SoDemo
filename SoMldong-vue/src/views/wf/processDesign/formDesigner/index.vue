<template>
  <BasicModal
    width="80%"
    @register="register"
    title="表单设计"
    :canFullscreen="false"
    :defaultFullscreen="true"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <component :is="formKey" v-if="flowData?.instanceUrl !== 'schemaWfForm'" />
    <a-row v-else>
      <a-col :span="16">
        <a-card :title="formSchema.title ? formSchema.title : '元数据表单'">
          <BasicForm @register="registerForm" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <BasicTable @register="registerTable">
          <!--左上角按钮-->
          <template #tableTitle>
            <TableAction
              :actions="[
                {
                  label: '新增',
                  type: 'primary',
                  size: 'middle',
                  icon: 'ant-design:plus-outlined',
                  onClick: handleAdd.bind(null),
                },
                {
                  label: '表单属性',
                  type: 'primary',
                  size: 'middle',
                  icon: 'ant-design:setting-outlined',
                  onClick: handleOpenFormSchema.bind(null),
                },
              ]"
            />
          </template>
          <!--操作项-->
          <template #action="{ record, index }">
            <TableAction
              :stopButtonPropagation="true"
              :actions="[
                {
                  label: '上移',
                  onClick: handleUpDown.bind(null, index, 'up'),
                  disabled: index == 0,
                },
                {
                  label: '下移',
                  onClick: handleUpDown.bind(null, index, 'down'),
                  disabled: index == dataSource.length - 1,
                },
                {
                  label: '编辑',
                  onClick: handleEdit.bind(null, record),
                },
                {
                  label: '删除',
                  popConfirm: {
                    title: '确定删除吗？',
                    confirm: handleDelete.bind(null, record),
                  },
                },
              ]"
            />
          </template>
        </BasicTable>
      </a-col>
    </a-row>
  </BasicModal>
  <FormSchemaDrawer ref="formSchemaDrawerRef" @ok="handleFormSchemaDrawerOk" />
  <FormItemSchemaDrawer ref="formItemSchemaDrawerRef" @ok="handleFormItemSchemaDrawerOk" />
</template>
<script setup>
  import { ref, nextTick, computed } from 'vue';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { wfProcessDesignDetail, updateDefine } from '/@/api/wf/processDesign';
  import { componentMap } from '../../processDefine/componentMap';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import FormSchemaDrawer from './formSchemaDrawer.vue';
  import FormItemSchemaDrawer from './formItemSchemaDrawer.vue';
  import { message } from 'ant-design-vue';
  const emits = defineEmits(['success']);

  const schemas = ref([]);
  const formSchema = ref({});
  const formSchemaDrawerRef = ref();
  const formItemSchemaDrawerRef = ref();
  const dataSource = computed(() => {
    return schemas.value || [];
  });
  // 注册表格
  const [registerTable] = useTable({
    columns: [
      {
        title: '字段',
        dataIndex: 'field',
      },
      {
        title: '标签',
        dataIndex: 'label',
      },
      {
        // flag: 'ACTION',
        title: '操作',
        key: 'ACTION',
        dataIndex: 'ACTION',
        slots: { customRender: 'action' },
      },
    ],
    dataSource: dataSource,
    canResize: false,
    showIndexColumn: false,
  });
  // 注册表单
  const [registerForm, { setProps, setFieldsValue }] = useForm({
    schemas: schemas,
  });
  const [register, modalAction] = useModal();
  const currentRecord = ref({});
  const flowData = ref({});
  const formKey = ref();
  const defaultSchemaStr = `{
          "labelWidth": 100,
            "showResetButton": false,
            "showSubmitButton": false,
            "actionColOptions": {
              "span": 24
            },
          "schemas": [{
            "field": "f_title",
            "label": "标题",
            "component": "Input",
            "rules":[{"required": true,"message": "请输入标题", "trigger": "blur"}],
            "colProps": {
              "xl": 12,
              "xxl": 12
            },
            "componentProps": {
              "placeholder": "请输入标题"
            }
          },{
            "field": "f_desc",
            "label": "描述",
            "component": "Input",
            "rules":[{"required": true,"message": "请输入描述", "trigger": "blur"}],
            "colProps": {
              "xl": 12,
              "xxl": 12
            },
            "componentProps": {
              "placeholder": "请输入描述"
            }
          }]
        }`;
  const handleAdd = () => {
    handleOpenFormItemSchema();
  };
  const handleEdit = (record) => {
    handleOpenFormItemSchema(record);
  };
  const handleDelete = ({ field }) => {
    const schemaList = cloneDeep(schemas.value);
    const index = schemaList.findIndex((schema) => schema.field === field);
    if (index !== -1) {
      schemaList.splice(index, 1);
      schemas.value = schemaList;
    }
  };
  /**
   * 打开表单属性配置
   */
  const handleOpenFormSchema = () => {
    formSchemaDrawerRef.value?.show({
      ...formSchema.value,
      title: formSchema.value?.title ? formSchema.value?.title : '元数据表单',
    });
  };
  /**
   * 打开表单项属性配置
   */
  const handleOpenFormItemSchema = (record) => {
    formItemSchemaDrawerRef.value?.show({
      ...record,
    });
  };
  // 表单属性抽屉确定事件处理，主要传入抽屉表单值
  const handleFormSchemaDrawerOk = (values) => {
    formSchema.value = {
      ...formSchema.value,
      ...values,
    };
    setProps(formSchema.value);
  };
  // 表单项属性抽屉确定事件处理，主要传入抽屉表单值
  const handleFormItemSchemaDrawerOk = (values) => {
    const schemaList = cloneDeep(schemas.value);
    const index = schemaList.findIndex((schema) => schema.field === values.field);
    if (index !== -1) {
      schemaList[index] = {
        ...schemaList[index],
        ...values,
      };
    } else {
      schemaList.push(values);
    }
    schemas.value = schemaList;
    // 设置默认值
    const defaultValues = {};
    schemaList.forEach((item) => {
      if (item.defaultValue != undefined) {
        defaultValues[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(defaultValues);
  };
  const handleUpDown = (index, type) => {
    const schemaList = cloneDeep(schemas.value);
    if (type == 'up' && index > 0) {
      const temp = schemaList[index];
      schemaList[index] = schemaList[index - 1];
      schemaList[index - 1] = temp;
    } else if (type == 'down' && index < schemaList.length - 1) {
      const temp = schemaList[index];
      schemaList[index] = schemaList[index + 1];
      schemaList[index + 1] = temp;
    }
    schemas.value = schemaList;
  };
  const handleOk = () => {
    const formSchemaJsonStr = JSON.stringify({
      ...formSchema.value,
      schemas: schemas.value,
    });
    updateDefine({
      processDesignId: currentRecord.value.id,
      displayName: currentRecord.value.displayName,
      name: currentRecord.value.name,
      type: currentRecord.value.type,
      ...flowData.value,
      formSchemaJsonStr,
    }).then(() => {
      message.success('保存成功');
      emits('success');
    });
  };
  defineExpose({
    ...modalAction,
    show(record) {
      currentRecord.value = record;
      wfProcessDesignDetail({
        id: record.id,
      }).then((data) => {
        flowData.value = data.jsonObject;
        formSchema.value = JSON.parse(data.jsonObject?.formSchemaJsonStr || defaultSchemaStr);
        formKey.value =
          componentMap.get(data?.jsonObject?.instanceUrl) || componentMap.get('defaultWfForm');
        nextTick(() => {
          // 更新属性
          setProps(formSchema.value);
          // 更新字段
          schemas.value = formSchema.value?.schemas;
        });
      });
      modalAction.openModal();
    },
  });
</script>
