const modules = (import.meta as any).globEager('./**/*.ts');

export const componentData: any[] = [];
export const componentPropsData: any[] = [
  {
    field: 'componentConfig',
    label: '组件配置',
    component: 'Divider',
    ifShow(e: any) {
      return componentData.some((item) => item?.props?.some((itemm) => itemm?.ifShow(e)));
    },
  },
];
Object.keys(modules).forEach((key) => {
  if (!key.endsWith('index.ts')) {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    componentData.push(...modList);
    modList.forEach((item) => {
      const props = item.props || [];
      props.forEach((itemm) => {
        if (!itemm.ifShow) {
          // 子项追加ifShow控制是否显示
          itemm.ifShow = (e: any) => {
            return e.model?.component == item.value;
          };
        }
        // 子项key增加组件名称前辍，例：ext.Input_type
        itemm.field = itemm.field.replace('ext.', 'ext.' + item.value + '_');
      });
      componentPropsData.push(...props);
      if (['ApiSelect', 'ApiDict', 'Select'].includes(item.value)) {
        componentPropsData.push({
          field: 'ext.popupContainerInBody',
          labelWidth: '110px',
          component: 'Checkbox',
          renderComponentContent: '是否设置popupContainer',
          defaultValue: false,
          colProps: {
            xl: 8,
            xxl: 8,
          },
          ifShow: (e: any) => {
            return e.model?.component == item.value;
          },
        });
      }
    });
  }
});
