import { cloneDeep } from 'lodash-es';
import { componentMap } from '/@/components/view/componentMap';
import { h } from 'vue';
// 生成分组
export const buildDescGroup = (detailSchemas, data) => {
  const copyDetailSchemas = cloneDeep(detailSchemas);
  const descGroup = [];
  if (Array.isArray(copyDetailSchemas) && copyDetailSchemas.length) {
    copyDetailSchemas
      .filter(({ ext }) => {
        if (ext?.controlledFieldName && data?.record) {
          return ext?.controlledFieldValue
            ?.split(',')
            .includes(data?.record[ext?.controlledFieldName] + '');
        }
        return true;
      })
      .forEach((item) => {
        if (item.component == 'Divider') {
          descGroup[descGroup.length] = {
            title: item.label,
            list: [],
          };
        } else {
          if (!descGroup.length) {
            descGroup[0] = {
              title: '基本信息',
              list: [],
            };
          }
          // 处理样式
          item.span = item.ext?.span || item.span || 24;
          item.render = (record) => {
            let text = record;
            // if (text === '' || text === null || text === 'undefined') {
            //   text = '';
            // }
            const viewComponent = componentMap.get(item.component) || componentMap.get('Default');
            return h(viewComponent, {
              data: {
                text,
                record: data.record,
              },
              column: item,
            });
          };
          descGroup[descGroup.length - 1].list.push(item);
        }
      });
  }
  return descGroup;
};
/**
 * 处理显示隐藏
 * @param {*} e
 * @param {*} ext
 */
export const handleIfShow = (e, ext) => {
  // 存在受控件字段
  if (ext?.controlledFieldName) {
    return ext?.controlledFieldValue?.split(',').includes(e.model[ext?.controlledFieldName] + '');
  }
  const isUpdate = e.model?.id ? true : false;
  if (isUpdate) {
    return !ext?.editHide;
  } else {
    return !ext?.addHide;
  }
};
/**
 * 动态disabled
 * @param {*} e
 * @param {*} ext
 */
export const dynamicDisabled = (e, ext) => {
  const isUpdate = e.model?.id ? true : false;
  if (isUpdate) {
    return ext?.editDisabled == 1;
  } else {
    return ext?.addDisabled == 1;
  }
};
