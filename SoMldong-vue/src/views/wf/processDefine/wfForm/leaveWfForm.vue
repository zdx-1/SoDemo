<template>
  <a-card title="请假审批单">
    <BasicForm @register="registerForm" v-bind="$attrs" />
  </a-card>
</template>
<script setup name="leaveWfForm|请假表单">
  import { BasicForm, useForm } from '/@/components/Form';
  import * as dateUtil from '/@/utils/dateUtil';
  // 表单元数据配置
  const schemas = [
    {
      field: 'f_reasonType',
      label: '请假类型',
      component: 'ApiDict',
      rules: [{ required: true, message: '请选择请假类型', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请选择请假类型',
        code: 'biz_leave_reason_type',
        // renderType: 'RadioGroup',
      },
    },
    {
      field: 'f_startTime',
      label: '开始时间',
      component: 'LeaveDatePicker',
      defaultValue: [undefined, 'am'],
      rules: [
        {
          required: true,
          message: '请选择开始时间',
          trigger: 'blur',
          type: 'array',
        },
      ],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请选择开始时间',
        onChange(e) {
          const startTime = e;
          const endTime = formAction.getFieldsValue()['f_endTime'];
          let days = undefined;
          if (startTime[0] && endTime[0]) {
            const dHours = dateUtil.diff(startTime[0], endTime[0]);
            if (dHours == 0) {
              // 同一天，都是上午或下午，则说明为半天假
              if (startTime[1] == endTime[1]) {
                days = 0.5;
              } else {
                // 同一天，上午或下午都有，则为一天假
                days = 1;
              }
            } else {
              // 不是同一天
              if (startTime[1] == endTime[1]) {
                days = dHours / 24 + 0.5;
              } else {
                // 同一天，上午或下午都有，则为一天假
                days = dHours / 24 + 1;
              }
            }
          }
          formAction.setFieldsValue({
            f_day: days,
          });
        },
      },
    },
    {
      field: 'f_endTime',
      label: '结束时间',
      component: 'LeaveDatePicker',
      defaultValue: [undefined, 'pm'],
      rules: [
        {
          required: true,
          message: '请选择结束时间',
          trigger: 'blur',
          type: 'array',
        },
      ],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请选择开始时间',
        onChange(e) {
          const endTime = e;
          const startTime = formAction.getFieldsValue()['f_startTime'];
          let days = undefined;
          if (startTime[0] && endTime[0]) {
            const dHours = dateUtil.diff(startTime[0], endTime[0]);
            if (dHours == 0) {
              // 同一天，都是上午或下午，则说明为半天假
              if (startTime[1] == endTime[1]) {
                days = 0.5;
              } else {
                // 同一天，上午或下午都有，则为一天假
                days = 1;
              }
            } else {
              // 不是同一天
              if (startTime[1] == endTime[1]) {
                days = dHours / 24 + 0.5;
              } else {
                // 同一天，上午或下午都有，则为一天假
                days = dHours / 24 + 1;
              }
            }
          }
          formAction.setFieldsValue({
            f_day: days,
          });
        },
      },
    },
    {
      field: 'f_day',
      label: '请假天数',
      component: 'InputNumber',
      rules: [{ required: true, message: '请输入请假天数', trigger: 'blur', type: 'number' }],
      colProps: {
        xl: 12,
        xxl: 12,
      },
      componentProps: {
        placeholder: '请假天数由起止时间计算得出',
        style: {
          width: '100%',
        },
        readonly: true,
      },
    },
    {
      field: 'f_title',
      label: '请假原因',
      component: 'InputTextArea',
      rules: [{ required: true, message: '请输入请假标题', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        placeholder: '请输入请假原因',
      },
    },
    {
      field: 'f_attachment',
      label: '上传附件',
      component: 'Upload',
      required: false,
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {},
    },
  ];
  // 注册表单
  const [registerForm, formAction] = useForm({
    labelWidth: 100,
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  defineExpose({
    ...formAction,
    getFieldsValue() {
      const values = formAction.getFieldsValue();
      const startTime = values['f_startTime'];
      const endTime = values['f_endTime'];
      return {
        ...values,
        f_startTime: [dateUtil.formatToDate(startTime[0]), startTime[1]],
        f_endTime: [dateUtil.formatToDate(endTime[0]), endTime[1]],
      };
    },
    setFieldsValue(data) {
      const newData = {
        ...data,
        f_startTime: [dateUtil.strToDate(data.f_startTime[0]), data.f_startTime[1]],
        f_endTime: [dateUtil.strToDate(data.f_endTime[0]), data.f_endTime[1]],
      };
      return formAction.setFieldsValue(newData);
    },
  });
</script>
