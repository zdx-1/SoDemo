import type { Component } from 'vue';
const components = (import.meta as any).globEager('./components/**/*.vue');
const componentMap = new Map<string | String, Component>();
Object.keys(components).forEach((key) => {
  const component: any = components[key];
  componentMap.set(component?.default?.__name || component?.default?.name, component.default);
});
export function add(compName: string | String, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: string | String) {
  componentMap.delete(compName);
}
export { componentMap };
