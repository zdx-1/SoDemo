import { ref } from 'vue';
import { dynamicDisabled, handleIfShow, buildDescGroup } from '/@/utils/action';
import { useSchemaStore } from '/@/store/modules/schema';
/**
 * 转成组件属性
 * @param column
 */
export function toComponentProps(column: any) {
  const componentProps = {} as any;
  // 组件属性的配置规则为 组件名_属性名
  Object.keys(column.ext)
    .filter((item) => {
      return item.startsWith(column.component + '_');
    })
    .filter((item) => {
      componentProps[item.replace(column.component + '_', '')] = column.ext[item];
    });
  componentProps.placeholder = column.ext?.placeholder || '请输入' + column.remark;
  if (
    [
      'ApiDict',
      'ApiSelect',
      'Select',
      'AutoComplete',
      'ApiCascader',
      'ApiTreeSelect',
      'Upload',
    ].includes(column.component)
  ) {
    componentProps.placeholder = column.ext?.placeholder || '请选择' + column.remark;
  }
  if (column.component === 'RangePicker') {
    if (column.placeholder) {
      componentProps.placeholder = column.ext.placeholder.split(',');
    } else {
      componentProps.placeholder = ['开始日期', '结束日期'];
    }
  } else if (column.component == 'CustomComponent') {
    // 自定义组件需要特殊处理
    column.component = componentProps.componentName;
    delete componentProps.componentName;
  } else if (column.component === 'Switch') {
    if (componentProps.dataType == 'number') {
      componentProps.unCheckedValue = Number(componentProps.unCheckedValue || 0);
      componentProps.checkedValue = Number(componentProps.checkedValue || 1);
    }
  }
  if (column.ext.popupContainerInBody) {
    componentProps.getPopupContainer = () => document.body;
  }
  return componentProps;
}
/**
 * 将schema转成vben表格元数据
 * @param columns
 * @returns
 */
export function schemaToTableColumns(columns: any[]) {
  return [
    ...columns
      ?.filter((column: { ext: { listHide: number } }) => {
        return column.ext.listHide !== 1;
      })
      .map((column: any) => {
        return {
          title: column.remark,
          dataIndex: column.fieldCamelName,
          component: column.component,
          componentProps: toComponentProps(column),
        };
      }),
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
}
/**
 * 将schema转成表格导出excel元数据
 * @param columns
 * @returns
 */
export function schemaToTableExportColumns(columns: any[]) {
  return columns
    ?.filter((column: { ext: { listHide: number } }) => {
      return column.ext.listHide !== 1;
    })
    .map((column: any) => {
      return {
        name: column.remark,
        key: column.fieldCamelName,
        component: column.component,
        handlerType: column.ext.excelColumnHandlerType,
        componentProps: toComponentProps(column),
      };
    });
}
/**
 * 将schema转成vben表格搜索表单元数据
 * @param columns
 * @returns
 */
export function schemaToSearchFormSchemas(columns: any[]) {
  return columns
    ?.filter((column: { ext: { search: number; searchType: string } }) => {
      return column.ext.search == 1 && column.ext.searchType;
    })
    .map((column: any) => {
      return {
        field: `m_${column.ext.searchType}_${column.fieldCamelName}`,
        label: column.remark,
        component: column.component,
        colProps: {
          xl: column.ext.searchSpan || 6,
          xxl: column.ext.searchSpan || 6,
        },
        componentProps: toComponentProps(column),
      };
    });
}
/**
 * 将schema转成vben表单元数据
 * @param columns
 * @returns
 */
export function schemaToFormSchemas(columns: any[]) {
  return [
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
    ...columns
      ?.filter((column) => {
        return column.fieldCamelName !== 'id';
      })
      .map((column: any) => {
        const componentProps = toComponentProps(column);
        const colSpan =
          column.component == 'Input' && componentProps.type == 'hidden'
            ? 0
            : column.ext.span || 24;
        return {
          field: column.fieldCamelName,
          label: column.remark,
          defaultValue: column.defaultValue ? column.defaultValue : undefined,
          component: column.component,
          rules: [
            {
              required: column.ext.required == true,
              message: `请输入${column.remark}`,
              trigger: 'blur',
              type: componentProps.dataType ? componentProps.dataType : undefined,
            },
          ],
          colProps: {
            xl: colSpan,
            xxl: colSpan,
          },
          helpMessage: column.ext.help ? column.ext.help.split('\n') : [],
          componentProps: componentProps,
          ifShow(e) {
            return handleIfShow(e, column.ext);
          },
          dynamicDisabled(e) {
            return dynamicDisabled(e, column.ext);
          },
        };
      }),
  ];
}
/**
 * 将schema转成详情元数据
 * @param columns
 * @returns
 */
export function schemaToDetailSchemas(columns: any[]) {
  return columns
    ?.filter((column: { ext: { viewHide: number } }) => {
      return column.ext.viewHide !== 1;
    })
    .map((column: any) => {
      return {
        field: column.fieldCamelName,
        label: column.remark,
        component: column.component,
        span: column.ext.span || 24,
        componentProps: toComponentProps(column),
        ext: column.ext,
      };
    });
}
/**
 * 表格元数据
 * @param param
 */
export function useTableSchema({ tableName, tableRef }) {
  const tableColumns = ref<any[]>([]);
  const searchFormSchemas = ref<any[]>([]);
  const schemaStore = useSchemaStore();
  return new Promise((resolve, reject) => {
    schemaStore
      .requestData(tableName)
      .then((res: any) => {
        // 设置表格元数据
        tableColumns.value = schemaToTableColumns(res.columns);
        tableRef?.setColumns(tableColumns.value);
        searchFormSchemas.value = schemaToSearchFormSchemas(res.columns);
        // 设置搜索表单元数据
        tableRef?.getForm()?.setProps({
          schemas: searchFormSchemas.value,
        });
        resolve({
          tableColumns: tableColumns.value,
          searchFormSchemas: searchFormSchemas.value,
          schema: res,
        });
      })
      .catch(reject);
  });
}
/**
 * 表格导出元数据
 * @param param
 */
export function useTableExportSchema({ tableName, tableRef }) {
  const tableData = ref<any[]>([]);
  const schemaStore = useSchemaStore();
  return new Promise((resolve, reject) => {
    schemaStore
      .requestData(tableName)
      .then((res: any) => {
        // 设置表格导出元数据
        tableData.value = schemaToTableExportColumns(res.columns);
        tableRef?.setTableData(tableData.value);
        tableRef?.setSelectedRowKeys(tableData.value.map((item: any) => item.key));
        resolve({
          //dataSource: tableData.value,
          schema: res,
        });
      })
      .catch(reject);
  });
}
/**
 * 表单元数据
 * @param param
 */
export function useFormSchema({ tableName, formRef }) {
  const formSchemas = ref<any[]>([]);
  const schemaStore = useSchemaStore();
  return new Promise((resolve, reject) => {
    schemaStore
      .requestData(tableName)
      .then((res: any) => {
        formSchemas.value = schemaToFormSchemas(res.columns);
        // 设置表单元数据
        formRef?.setProps({
          schemas: formSchemas.value,
        });
        resolve({
          formSchemas: formSchemas.value,
          schema: res,
        });
      })
      .catch(reject);
  });
}
/**
 * 详情元数据
 * @param param
 */
export function useDetailSchema({ tableName, detailCard, detailData }) {
  const detailSchemas = ref<any[]>([]);
  const schemaStore = useSchemaStore();
  return new Promise((resolve, reject) => {
    schemaStore
      .requestData(tableName)
      .then((res: any) => {
        detailSchemas.value = schemaToDetailSchemas(res.columns);
        if (detailData) {
          detailCard.value = buildDescGroup(detailSchemas.value, detailData);
        }
        resolve({
          detailSchemas: detailSchemas.value,
          schema: res,
        });
      })
      .catch(reject);
  });
}
