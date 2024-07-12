import { filterUrlName } from '/@/utils/commonUtils';
import { useComponentRegister } from '/@/components/Form/src/hooks/useComponentRegister';

// 引入自定义组件
const modules = (import.meta as any).globEager('./**/*.vue');

Object.keys(modules).forEach((key) => {
  const component = modules[key].default || {};
  const componentName = component.name || filterUrlName(key, false);
  useComponentRegister(componentName, component);
});
