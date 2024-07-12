import { Component } from 'vue';
import { filterUrlName } from '/@/utils/commonUtils';
import { OptionCoreData } from 'ant-design-vue/lib/vc-select/interface';

const taskFormComponentMap = new Map<String, Component>();
// 提供流程设计器表单字段下拉使用
const taskFormOptions: Array<OptionCoreData> = [];
// 引入自定义任务节点表单组件
const modules = import.meta.globEager('../../../views/**/*TaskForm.vue');

Object.keys(modules).forEach((key) => {
  const component = modules[key].default || {};
  let componentName = component.name || filterUrlName(key, false);
  const cArr = componentName.split('|');
  componentName = cArr[0];
  taskFormComponentMap.set(componentName, component);
  taskFormOptions.push({
    value: cArr[0],
    label: cArr.length >= 2 ? cArr[1] : cArr[0],
  });
});

export function add(compName: String, component: Component) {
  taskFormComponentMap.set(compName, component);
}

export function del(compName: String) {
  taskFormComponentMap.delete(compName);
}

export { taskFormComponentMap, taskFormOptions };
