import moment from 'moment';
import { isObject, isArray, isEmpty, isNull, isNumber } from '/@/utils/is';
import { defHttp } from '/@/utils/http/axios';

// 必填项校验
const validateRequired = (rule, data) => {
  if (rule.required && (isEmpty(data) || isNull(data) || (!isNumber(data) && !data))) {
    return true;
  }
  return false;
};
// 重复项校验
const validateUnique = (rule, data, key, uniqueData) => {
  if (rule.unique) {
    if (!uniqueData[key]) {
      uniqueData[key] = [];
    }
    // 判断是否有值
    if (uniqueData[key].includes(data)) {
      return true;
    } else {
      uniqueData[key].push(data);
    }
  }
  return false;
};
// 区间组件只能当年
const validateSingleYear = (rule, data) => {
  if (rule.singlgYear && Array.isArray(data) && data.length) {
    return moment(data[0]).year() != moment(data[1]).year();
  }
};

const validateRegExp = (rule, data) => {
  if (rule.RegExp) {
    const reg = new RegExp(rule.RegExp);
    return !reg.test(data);
  }
};

const buildMessage = (message, index, key) => {
  return { message, index, key };
};
/**
 *
 * @param {object} rule 单条校验规则
 * @param {string|Number|object} data 数据值
 * @param {*} index 当前行
 * @param {*} key 当前字段名
 * @returns Array[string] message
 */
const validateAll = (rule, data, index, key, uniqueData) => {
  const messages = [];
  // 必填校验
  if (validateRequired(rule, data)) {
    messages.push(buildMessage(rule.message, index, key));
  }
  // 校验唯一
  if (validateUnique(rule, data, key, uniqueData)) {
    messages.push(buildMessage(rule.message, index, key));
  }
  // 判断区间日期不能跨年
  if (validateSingleYear(rule, data)) {
    messages.push(buildMessage(rule.message, index, key));
  }
  // 正则表达式校验
  if (validateRegExp(rule, data)) {
    messages.push(buildMessage(rule.message, index, key));
  }
  return messages;
};

const buildAllMsg = (data, rules, row) => {
  const messages = [];
  const uniqueData = {};

  if (isArray(data) && !isEmpty(rules) && isObject(rules)) {
    data.forEach((item, index) => {
      let lineNum = index + 1;
      // 树状结构数据校验
      if (Array.isArray(item['items']) && item['items'].length) {
        messages.push(...buildAllMsg(item['items'], rules['valiSubItems'], lineNum));
      }
      for (const key in rules) {
        if (key == 'valiSubItems') {
          return;
        }
        if (isNumber(row)) {
          lineNum = `${row}-${lineNum}`;
        }

        if (isArray(rules[key])) {
          rules[key].forEach((single) => {
            messages.push(...validateAll(single, item[key], lineNum, key, uniqueData));
          });
        } else if (isObject(rules[key])) {
          messages.push(...validateAll(rules[key], item[key], lineNum, key, uniqueData));
        }
      }
    });
  }
  console.log('messages', messages);
  return messages;
};

// 表单数据校验
export const validateData = (data, rules, isObj) => {
  const messages = buildAllMsg(data, rules);
  if (isObj) {
    return messages || [];
  } else {
    let msgStr = [];
    if (messages.length) {
      messages.forEach((item) => {
        msgStr.push(`第${item.index}行:${item.message}`);
      });
    }
    return msgStr.join(',');
  }
};

/**
 * 日期组件禁用部分日期
 * @param {String} component 组件名
 * @param {String} disDate 禁用标识
 * @returns {disabledDate}
 */
export const buildDatePickerDisabled = (component, disDate) => {
  if (!component.includes('Picker')) {
    return {};
  }
  return {
    disabledDate: (current) => {
      const idToday = moment().format('YYYY-MM-DD') == current.format('YYYY-MM-DD');
      // 禁用今天
      if (disDate == '1') {
        return idToday;
      }
      // 禁用今天及之后
      if (disDate == '2') {
        return idToday || current > moment().endOf('day');
      }
      // 禁用今天及之前
      if (disDate == '3') {
        return idToday || current < moment().endOf('day');
      }
      // 禁用今天之后（不包括今天）
      if (disDate == '4') {
        return current > moment().endOf('day');
      }
      // 禁用今天之前（不包括今天）
      if (disDate == '5') {
        return current < moment().endOf('day');
      }
      return false;
    },
  };
};

// 远程组件接口包装
const getData = (api, component, data) => {
  if (component == 'Dict') {
    return defHttp.get({ url: api, params: data });
  } else if (component == 'Upload') {
    return import.meta.env.VITE_GLOB_API_URL + api;
  } else {
    return defHttp.post({ url: api, data: { ...data, includeType: 1 } });
  }
};

const buildApi = (data) => {
  if (!data || !data.props) {
    return {};
  } else if (data.props.api) {
    return {
      api: () => getData(data.props.api, data.compName, data.props.params),
    };
  } else {
    return {};
  }
};

export const buildCompFuncItems = (data) => {
  let options = {};

  const disDate = buildDatePickerDisabled(data.compName, data.props && data.props.disDate);

  const apiObj = buildApi(data);

  options = { ...disDate, ...apiObj };

  if (data.compName == 'Dict' && data.props.params && data.props.params.code) {
    options.code = data.props.params.code;
  }
  return options;
};
