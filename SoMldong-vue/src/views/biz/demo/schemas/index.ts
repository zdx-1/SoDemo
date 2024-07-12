/* eslint-disable */
import { handleIfShow, dynamicDisabled } from '/@/utils/action';
// 是否异步元数据
// 当为异步时，进入页面会通过接口重新获取元数据
// 当为同步时，只使用代码生成的本地元数据
export const async = true;
// 表单元数据配置
export const formSchemas = [
  {
    field: 'id',
    label: '主键',
    component: 'Input',
    colProps: {
      xl: 0,
      xxl: 0,
      xs: 0, 
      sm: 0, 
      md: 0, 
      lg: 0,
    },
  },
  {
    field: 'autoComplete',
    label: '自动完成',
    component: 'ApiAutoComplete',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      api: "/sys/user/select",
      immediate: true,
      placeholder: "请输入自动完成",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiAutoComplete_api":"/sys/user/select","ApiAutoComplete_immediate":true,"span":12,"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiAutoComplete_api":"/sys/user/select","ApiAutoComplete_immediate":true,"span":12,"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'mSwitch',
    label: '开关',
    component: 'Switch',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      dataType: "string",
      checkedValue: "是",
      unCheckedValue: "否",
      placeholder: "请输入开关",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Switch_dataType":"string","Switch_checkedValue":"是","Switch_unCheckedValue":"否","span":12};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Switch_dataType":"string","Switch_checkedValue":"是","Switch_unCheckedValue":"否","span":12};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      placeholder: "请输入名称",
    },
    ifShow(e) {
      const ext = {"searchType":"LIKE","addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":1};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"searchType":"LIKE","addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":1};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'baseInfo',
    label: '基本信息',
    component: 'Divider',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      dashed: false,
      plain: false,
      placeholder: "请输入基本信息",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_plain":false};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_plain":false};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'inputTextArea',
    label: '多行文本',
    component: 'InputTextArea',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      placeholder: "请输入多行文本",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"showCount":true,"autoSize":{"minRows":3,"maxRows":5}};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"showCount":true,"autoSize":{"minRows":3,"maxRows":5}};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'divider',
    label: '分割线',
    component: 'Divider',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      dashed: false,
      orientation: "center",
      type: "horizontal",
      plain: false,
      placeholder: "请输入分割线",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_orientation":"center","Divider_type":"horizontal","Divider_plain":false};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_orientation":"center","Divider_type":"horizontal","Divider_plain":false};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'apiSelect',
    label: '远程下拉',
    component: 'ApiSelect',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      immediate: true,
      api: "/sys/user/select",
      params: {"labelKey":"realName","valueKey":"id"},
      placeholder: "请选择远程下拉",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiSelect_immediate":true,"ApiSelect_api":"/sys/user/select","excelColumnHandlerType":"relIdExcelColumnHandler","popupContainerInBody":false,"ApiSelect_params":{"labelKey":"realName","valueKey":"id"}};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiSelect_immediate":true,"ApiSelect_api":"/sys/user/select","excelColumnHandlerType":"relIdExcelColumnHandler","popupContainerInBody":false,"ApiSelect_params":{"labelKey":"realName","valueKey":"id"}};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'dict',
    label: '字典',
    component: 'ApiDict',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      code: "wf_process_type",
      dataType: "string",
      placeholder: "请选择字典",
      getPopupContainer: () => document.body,
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiDict_code":"wf_process_type","ApiDict_dataType":"string","popupContainerInBody":true,"excelColumnHandlerType":"apiDictExcelColumnHandler"};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiDict_code":"wf_process_type","ApiDict_dataType":"string","popupContainerInBody":true,"excelColumnHandlerType":"apiDictExcelColumnHandler"};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'apiTreeSelect',
    label: '远程树',
    component: 'ApiTreeSelect',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      api: "/sys/dept/tree",
      immediate: true,
      replaceFields: {"title":"name","value":"id","key":"id","children":"children"},
      placeholder: "请选择远程树",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiTreeSelect_api":"/sys/dept/tree","ApiTreeSelect_immediate":true,"ApiTreeSelect_replaceFields":{"title":"name","value":"id","key":"id","children":"children"},"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiTreeSelect_api":"/sys/dept/tree","ApiTreeSelect_immediate":true,"ApiTreeSelect_replaceFields":{"title":"name","value":"id","key":"id","children":"children"},"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'datePicker',
    label: '日期',
    component: 'DatePicker',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      mode: "date",
      placeholder: "请输入日期",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"DatePicker_mode":"date","span":12};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"DatePicker_mode":"date","span":12};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'apiCheckboxGroup',
    label: '自定义组件',
    component: 'DemoCustomInput',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      params: "666",
      placeholder: "请输入自定义组件",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCheckboxGroup_api":"/sys/user/select","ApiCheckboxGroup_immediate":true,"CustomComponent_componentName":"DemoCustomInput","CustomComponent_params":"666","span":12};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCheckboxGroup_api":"/sys/user/select","ApiCheckboxGroup_immediate":true,"CustomComponent_componentName":"DemoCustomInput","CustomComponent_params":"666","span":12};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'apiRadioGroup',
    label: '远程单选组',
    component: 'ApiRadioGroup',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      api: "/sys/user/select",
      immediate: true,
      params: {"labelKey":"realName","valueKey":"id"},
      placeholder: "请输入远程单选组",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiRadioGroup_api":"/sys/user/select","ApiRadioGroup_immediate":true,"span":12,"ApiRadioGroup_params":{"labelKey":"realName","valueKey":"id"},"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiRadioGroup_api":"/sys/user/select","ApiRadioGroup_immediate":true,"span":12,"ApiRadioGroup_params":{"labelKey":"realName","valueKey":"id"},"excelColumnHandlerType":"relIdExcelColumnHandler"};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'rangePicker',
    label: '日期区间选择',
    component: 'RangePicker',
    colProps: {
      xl: 12,
      xxl: 12,
    },
    componentProps: {
      placeholder: ["开始日期","结束日期"],
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"span":12};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"span":12};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'apiCascader',
    label: '远程级联选择',
    component: 'ApiCascader',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      api: "/sys/user/select",
      showSearch: true,
      immediate: true,
      placeholder: "请选择远程级联选择",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCascader_api":"/sys/user/select","ApiCascader_showSearch":true,"ApiCascader_immediate":true};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCascader_api":"/sys/user/select","ApiCascader_showSearch":true,"ApiCascader_immediate":true};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'upload',
    label: '文件上传',
    component: 'Upload',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      maxSize: 2,
      multiple: false,
      pictureCard: false,
      placeholder: "请选择文件上传",
    },
    ifShow(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Upload_maxSize":2,"Upload_multiple":false,"Upload_pictureCard":false};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Upload_maxSize":2,"Upload_multiple":false,"Upload_pictureCard":false};
      return dynamicDisabled(e, ext);
    },
  },
  {
    field: 'updateTime',
    label: '修改时间',
    component: 'DatePicker',
    colProps: {
      xl: 24,
      xxl: 24,
    },
    componentProps: {
      format: "YYYY-MM-DD HH:mm:ss",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      placeholder: "请输入修改时间",
    },
    ifShow(e) {
      const ext = {"addHide":1,"editHide":1,"listHide":0,"viewHide":1,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"DatePicker_format":"YYYY-MM-DD HH:mm:ss","DatePicker_valueFormat":"YYYY-MM-DD HH:mm:ss","excelColumnHandlerType":"dateExcelColumnHandler"};
      return handleIfShow(e, ext);
    },
    dynamicDisabled(e) {
      const ext = {"addHide":1,"editHide":1,"listHide":0,"viewHide":1,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"DatePicker_format":"YYYY-MM-DD HH:mm:ss","DatePicker_valueFormat":"YYYY-MM-DD HH:mm:ss","excelColumnHandlerType":"dateExcelColumnHandler"};
      return dynamicDisabled(e, ext);
    },
  },
];
// 详情元数据配置
export const detailSchemas = [
  {
    field: 'autoComplete',
    label: '自动完成',
    component: 'ApiAutoComplete',
    span: 12,
    componentProps: {
      api: "/sys/user/select",
      immediate: true,
      placeholder: "请输入自动完成",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiAutoComplete_api":"/sys/user/select","ApiAutoComplete_immediate":true,"span":12,"excelColumnHandlerType":"relIdExcelColumnHandler"},
  },
  {
    field: 'mSwitch',
    label: '开关',
    component: 'Switch',
    span: 12,
    componentProps: {
      dataType: "string",
      checkedValue: "是",
      unCheckedValue: "否",
      placeholder: "请输入开关",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Switch_dataType":"string","Switch_checkedValue":"是","Switch_unCheckedValue":"否","span":12},
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    span: 24,
    componentProps: {
      placeholder: "请输入名称",
    },
    ext: {"searchType":"LIKE","addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":1},
  },
  {
    field: 'baseInfo',
    label: '基本信息',
    component: 'Divider',
    span: 24,
    componentProps: {
      dashed: false,
      plain: false,
      placeholder: "请输入基本信息",
    },
    ext: {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_plain":false},
  },
  {
    field: 'inputTextArea',
    label: '多行文本',
    component: 'InputTextArea',
    span: 24,
    componentProps: {
      placeholder: "请输入多行文本",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"showCount":true,"autoSize":{"minRows":3,"maxRows":5}},
  },
  {
    field: 'divider',
    label: '分割线',
    component: 'Divider',
    span: 24,
    componentProps: {
      dashed: false,
      orientation: "center",
      type: "horizontal",
      plain: false,
      placeholder: "请输入分割线",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Divider_dashed":false,"Divider_orientation":"center","Divider_type":"horizontal","Divider_plain":false},
  },
  {
    field: 'apiSelect',
    label: '远程下拉',
    component: 'ApiSelect',
    span: 24,
    componentProps: {
      immediate: true,
      api: "/sys/user/select",
      params: {"labelKey":"realName","valueKey":"id"},
      placeholder: "请选择远程下拉",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiSelect_immediate":true,"ApiSelect_api":"/sys/user/select","excelColumnHandlerType":"relIdExcelColumnHandler","popupContainerInBody":false,"ApiSelect_params":{"labelKey":"realName","valueKey":"id"}},
  },
  {
    field: 'dict',
    label: '字典',
    component: 'ApiDict',
    span: 24,
    componentProps: {
      code: "wf_process_type",
      dataType: "string",
      placeholder: "请选择字典",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiDict_code":"wf_process_type","ApiDict_dataType":"string","popupContainerInBody":true,"excelColumnHandlerType":"apiDictExcelColumnHandler"},
  },
  {
    field: 'apiTreeSelect',
    label: '远程树',
    component: 'ApiTreeSelect',
    span: 24,
    componentProps: {
      api: "/sys/dept/tree",
      immediate: true,
      replaceFields: {"title":"name","value":"id","key":"id","children":"children"},
      placeholder: "请选择远程树",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiTreeSelect_api":"/sys/dept/tree","ApiTreeSelect_immediate":true,"ApiTreeSelect_replaceFields":{"title":"name","value":"id","key":"id","children":"children"},"excelColumnHandlerType":"relIdExcelColumnHandler"},
  },
  {
    field: 'datePicker',
    label: '日期',
    component: 'DatePicker',
    span: 12,
    componentProps: {
      mode: "date",
      placeholder: "请输入日期",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"DatePicker_mode":"date","span":12},
  },
  {
    field: 'apiCheckboxGroup',
    label: '自定义组件',
    component: 'DemoCustomInput',
    span: 12,
    componentProps: {
      params: "666",
      placeholder: "请输入自定义组件",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCheckboxGroup_api":"/sys/user/select","ApiCheckboxGroup_immediate":true,"CustomComponent_componentName":"DemoCustomInput","CustomComponent_params":"666","span":12},
  },
  {
    field: 'apiRadioGroup',
    label: '远程单选组',
    component: 'ApiRadioGroup',
    span: 12,
    componentProps: {
      api: "/sys/user/select",
      immediate: true,
      params: {"labelKey":"realName","valueKey":"id"},
      placeholder: "请输入远程单选组",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiRadioGroup_api":"/sys/user/select","ApiRadioGroup_immediate":true,"span":12,"ApiRadioGroup_params":{"labelKey":"realName","valueKey":"id"},"excelColumnHandlerType":"relIdExcelColumnHandler"},
  },
  {
    field: 'rangePicker',
    label: '日期区间选择',
    component: 'RangePicker',
    span: 12,
    componentProps: {
      placeholder: ["开始日期","结束日期"],
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"span":12},
  },
  {
    field: 'apiCascader',
    label: '远程级联选择',
    component: 'ApiCascader',
    span: 24,
    componentProps: {
      api: "/sys/user/select",
      showSearch: true,
      immediate: true,
      placeholder: "请选择远程级联选择",
    },
    ext: {"addHide":0,"editHide":0,"listHide":0,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"ApiCascader_api":"/sys/user/select","ApiCascader_showSearch":true,"ApiCascader_immediate":true},
  },
  {
    field: 'upload',
    label: '文件上传',
    component: 'Upload',
    span: 24,
    componentProps: {
      maxSize: 2,
      multiple: false,
      pictureCard: false,
      placeholder: "请选择文件上传",
    },
    ext: {"addHide":0,"editHide":0,"listHide":1,"viewHide":0,"addDisabled":0,"editDisabled":0,"required":0,"search":0,"Upload_maxSize":2,"Upload_multiple":false,"Upload_pictureCard":false},
  },
];
// 表格列定义
export const tableColumns = [
    // 列定义
    {
      title: '自动完成',
      dataIndex: 'autoComplete',
      component: 'ApiAutoComplete',
      componentProps: {
        api: "/sys/user/select",
        immediate: true,
        placeholder: "请输入自动完成",
      },
    },
    {
      title: '开关',
      dataIndex: 'mSwitch',
      component: 'Switch',
      componentProps: {
        dataType: "string",
        checkedValue: "是",
        unCheckedValue: "否",
        placeholder: "请输入开关",
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      component: 'Input',
      componentProps: {
        placeholder: "请输入名称",
      },
    },
    {
      title: '多行文本',
      dataIndex: 'inputTextArea',
      component: 'InputTextArea',
      componentProps: {
        placeholder: "请输入多行文本",
      },
    },
    {
      title: '分割线',
      dataIndex: 'divider',
      component: 'Divider',
      componentProps: {
        dashed: false,
        orientation: "center",
        type: "horizontal",
        plain: false,
        placeholder: "请输入分割线",
      },
    },
    {
      title: '远程下拉',
      dataIndex: 'apiSelect',
      component: 'ApiSelect',
      componentProps: {
        immediate: true,
        api: "/sys/user/select",
        params: {"labelKey":"realName","valueKey":"id"},
        placeholder: "请选择远程下拉",
      },
    },
    {
      title: '字典',
      dataIndex: 'dict',
      component: 'ApiDict',
      componentProps: {
        code: "wf_process_type",
        dataType: "string",
        placeholder: "请选择字典",
      },
    },
    {
      title: '远程树',
      dataIndex: 'apiTreeSelect',
      component: 'ApiTreeSelect',
      componentProps: {
        api: "/sys/dept/tree",
        immediate: true,
        replaceFields: {"title":"name","value":"id","key":"id","children":"children"},
        placeholder: "请选择远程树",
      },
    },
    {
      title: '日期',
      dataIndex: 'datePicker',
      component: 'DatePicker',
      componentProps: {
        mode: "date",
        placeholder: "请输入日期",
      },
    },
    {
      title: '自定义组件',
      dataIndex: 'apiCheckboxGroup',
      component: 'DemoCustomInput',
      componentProps: {
        params: "666",
        placeholder: "请输入自定义组件",
      },
    },
    {
      title: '远程单选组',
      dataIndex: 'apiRadioGroup',
      component: 'ApiRadioGroup',
      componentProps: {
        api: "/sys/user/select",
        immediate: true,
        params: {"labelKey":"realName","valueKey":"id"},
        placeholder: "请输入远程单选组",
      },
    },
    {
      title: '日期区间选择',
      dataIndex: 'rangePicker',
      component: 'RangePicker',
      componentProps: {
        placeholder: ["开始日期","结束日期"],
      },
    },
    {
      title: '远程级联选择',
      dataIndex: 'apiCascader',
      component: 'ApiCascader',
      componentProps: {
        api: "/sys/user/select",
        showSearch: true,
        immediate: true,
        placeholder: "请选择远程级联选择",
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      component: 'DatePicker',
      componentProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        placeholder: "请输入修改时间",
      },
    },
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
// 表格导出列定义
export const tableExportColumns = [
    // 列定义
    {
      name: '自动完成',
      key: 'autoComplete',
      component: 'ApiAutoComplete',
      handlerType: 'relIdExcelColumnHandler',
      componentProps: {
        api: "/sys/user/select",
        immediate: true,
        placeholder: "请输入自动完成",
      },
    },
    {
      name: '开关',
      key: 'mSwitch',
      component: 'Switch',
      handlerType: 'undefined',
      componentProps: {
        dataType: "string",
        checkedValue: "是",
        unCheckedValue: "否",
        placeholder: "请输入开关",
      },
    },
    {
      name: '名称',
      key: 'name',
      component: 'Input',
      handlerType: 'undefined',
      componentProps: {
        placeholder: "请输入名称",
      },
    },
    {
      name: '多行文本',
      key: 'inputTextArea',
      component: 'InputTextArea',
      handlerType: 'undefined',
      componentProps: {
        placeholder: "请输入多行文本",
      },
    },
    {
      name: '分割线',
      key: 'divider',
      component: 'Divider',
      handlerType: 'undefined',
      componentProps: {
        dashed: false,
        orientation: "center",
        type: "horizontal",
        plain: false,
        placeholder: "请输入分割线",
      },
    },
    {
      name: '远程下拉',
      key: 'apiSelect',
      component: 'ApiSelect',
      handlerType: 'relIdExcelColumnHandler',
      componentProps: {
        immediate: true,
        api: "/sys/user/select",
        params: {"labelKey":"realName","valueKey":"id"},
        placeholder: "请选择远程下拉",
      },
    },
    {
      name: '字典',
      key: 'dict',
      component: 'ApiDict',
      handlerType: 'apiDictExcelColumnHandler',
      componentProps: {
        code: "wf_process_type",
        dataType: "string",
        placeholder: "请选择字典",
      },
    },
    {
      name: '远程树',
      key: 'apiTreeSelect',
      component: 'ApiTreeSelect',
      handlerType: 'relIdExcelColumnHandler',
      componentProps: {
        api: "/sys/dept/tree",
        immediate: true,
        replaceFields: {"title":"name","value":"id","key":"id","children":"children"},
        placeholder: "请选择远程树",
      },
    },
    {
      name: '日期',
      key: 'datePicker',
      component: 'DatePicker',
      handlerType: 'undefined',
      componentProps: {
        mode: "date",
        placeholder: "请输入日期",
      },
    },
    {
      name: '自定义组件',
      key: 'apiCheckboxGroup',
      component: 'DemoCustomInput',
      handlerType: 'undefined',
      componentProps: {
        params: "666",
        placeholder: "请输入自定义组件",
      },
    },
    {
      name: '远程单选组',
      key: 'apiRadioGroup',
      component: 'ApiRadioGroup',
      handlerType: 'relIdExcelColumnHandler',
      componentProps: {
        api: "/sys/user/select",
        immediate: true,
        params: {"labelKey":"realName","valueKey":"id"},
        placeholder: "请输入远程单选组",
      },
    },
    {
      name: '日期区间选择',
      key: 'rangePicker',
      component: 'RangePicker',
      handlerType: 'undefined',
      componentProps: {
        placeholder: ["开始日期","结束日期"],
      },
    },
    {
      name: '远程级联选择',
      key: 'apiCascader',
      component: 'ApiCascader',
      handlerType: 'undefined',
      componentProps: {
        api: "/sys/user/select",
        showSearch: true,
        immediate: true,
        placeholder: "请选择远程级联选择",
      },
    },
    {
      name: '修改时间',
      key: 'updateTime',
      component: 'DatePicker',
      handlerType: 'dateExcelColumnHandler',
      componentProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        placeholder: "请输入修改时间",
      },
    },
  ];
// 搜索表单元数据
export const searchFormSchemas = [
    {
      field: 'm_LIKE_name',
      label: '名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: "请输入名称",
      },
    },
  ];
/* eslint-disable */