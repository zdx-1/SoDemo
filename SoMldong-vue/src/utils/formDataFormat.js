// 需要将数组转换成字符串的组件或者字符串回转数组
const needChangeDataCom = [
  'Dict',
  'ApiTreeSelect',
  'ApiCascader',
  'ApiSelect',
  'RangePicker',
  'ApiRadioGroup',
  'ApiCheckboxGroup',
  'ApiTree',
  'PageList',
];
// 判断当前字段是否为上传组件
// const isUploadComp = (key, schemas) => {
//   let bol = false;
//   schemas.forEach((item) => {
//     if (item.field == key && item.component == 'Upload') {
//       bol = true;
//     }
//   });
//   return bol;
// };
// 获取组件类型
export const getComponent = (key, schemas) => {
  let component = '';
  schemas.forEach((item) => {
    if (item.field == key) {
      component = item.component;
    }
  });
  return component;
};

// 判断字段是否需要转换
const isNeedChange = (key, schemas) => {
  let bol = false;
  schemas.forEach((item) => {
    if (item.field == key && needChangeDataCom.includes(item.component)) {
      bol = true;
    }
  });
  return bol;
};
// 筛选出"ApiCascader"
const filterApiCascader = (data, schemas) => {
  let keys = [];
  const newData = { ...data };
  schemas.forEach((item) => {
    if (item.component == 'ApiCascader') {
      keys.push(item.field);
    }
  });
  keys.forEach((key) => {
    if (
      (data[key] == '' && data[key] != 0) ||
      typeof data[key] == 'undefined' ||
      data[key] == null
    ) {
      newData[key] = -1;
    }
  });
  return newData;
};
/**
 *
  1. 提交统一为字符串，如果为数组，则使用英文逗号分割
  2. 如果值为空，使用默认值-1提交
  3. 数据回显时，数据接口原样返回
  3.1 前端根据需要自行处理英文逗号的情况(string-->array)
  3.2 前端根据需要自行处理默认值为-1的数据(-1-->undefined)
 */
// 格式化提交数据体
export const formateSubmitData = (data, schemas) => {
  const newData = { ...filterApiCascader(data, schemas) };
  for (let key in data) {
    if (isNeedChange(key, schemas)) {
      if (Array.isArray(data[key])) {
        if (data[key].length) {
          newData[key] = data[key].join(',');
        } else {
          newData[key] = -1;
        }
      } else {
        if (
          (data[key] == '' && data[key] != 0) ||
          typeof data[key] == 'undefined' ||
          data[key] == null
        ) {
          newData[key] = -1;
        }
      }
    }
    // else if (isUploadComp(key, schemas)) {
    //   if (!data[key]) {
    //     newData[key] = [];
    //   }
    // }
  }
  return newData;
};
// 格式化回显数据体，根据元数据类型筛选，如果是逗号隔开的字符串数组转成真数组
export const formateResponeData = (data, schemas) => {
  const newData = { ...data };
  for (let key in data) {
    if (isNeedChange(key, schemas)) {
      if (data[key] == -1) {
        newData[key] = undefined;
      } else if (data[key] && typeof data[key] == 'string' && data[key].includes(',')) {
        if (getComponent(key, schemas) != 'RangePicker') {
          newData[key] = data[key].split(',');
        }
      } else if (data[key] == null) {
        newData[key] = undefined;
      }
    }
  }
  return newData;
};
