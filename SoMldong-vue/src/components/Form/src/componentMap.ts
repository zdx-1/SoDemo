import type { Component } from 'vue';
import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Slider,
  Rate,
  Divider,
} from 'ant-design-vue';

import ApiRadioGroup from './components/ApiRadioGroup.vue';
import RadioButtonGroup from './components/RadioButtonGroup.vue';
import ApiSelect from './components/ApiSelect.vue';
import ApiTreeSelect from './components/ApiTreeSelect.vue';
import ApiCascader from './components/ApiCascader.vue';
import { BasicUpload } from '/@/components/Upload';
import { StrengthMeter } from '/@/components/StrengthMeter';
import { IconPicker } from '/@/components/Icon';
import { CountdownInput } from '/@/components/CountDown';
import { Tinymce } from '/@/components/Tinymce';
import PageList from '/@/components/PageList/index.vue';
import { filterUrlName } from '/@/utils/commonUtils';
import MyInput from './Input.vue';
import MyDatePicker from './DatePicker.vue';
// 远程字典
import ApiDict from './components/ApiDict.vue';
// 远程自动完成
import ApiAutoComplete from './components/ApiAutoComplete.vue';
const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', MyInput);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', Switch);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('ApiCascader', ApiCascader);
componentMap.set('Cascader', Cascader);
componentMap.set('Slider', Slider);
componentMap.set('Rate', Rate);

componentMap.set('DatePicker', MyDatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('StrengthMeter', StrengthMeter);
componentMap.set('IconPicker', IconPicker);
componentMap.set('InputCountDown', CountdownInput);

componentMap.set('Upload', BasicUpload);
componentMap.set('Divider', Divider);
componentMap.set('ApiDict', ApiDict);
componentMap.set('Editor', Tinymce);
componentMap.set('PageList', PageList);
componentMap.set('ApiAutoComplete', ApiAutoComplete);

// 引入自定义组件
const modules = (import.meta as any).globEager('./components/CustomComponent/*.vue');

Object.keys(modules).forEach((key) => {
  const component = modules[key].default || {};
  const componentName = component.name || filterUrlName(key, false);
  componentMap.set(componentName, component);
});

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
