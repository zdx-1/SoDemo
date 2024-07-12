import { OptionCoreData } from 'ant-design-vue/lib/vc-select/interface';
import { Component, markRaw } from 'vue';
import { filterUrlName } from '/@/utils/commonUtils';
const componentMap = new Map<String, Component>();
// 提供流程设计器表单字段下拉使用
const wfFormOptions: Array<OptionCoreData> = [];
// 引入自定义流程表单组件
const modules = import.meta.globEager('../../../views/**/*WfForm.vue');
Object.keys(modules).forEach((key) => {
  const component = modules[key].default || {};
  let componentName = component.name || filterUrlName(key, false);
  const cArr = componentName.split('|');
  componentName = cArr[0];
  if (!['defaultWfForm'].includes(componentName)) {
    wfFormOptions.push({
      value: cArr[0],
      label: cArr.length >= 2 ? cArr[1] : cArr[0],
    });
  }
  componentMap.set(componentName, markRaw(component));
});

export function add(compName: String, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: String) {
  componentMap.delete(compName);
}

export { componentMap, wfFormOptions };
