import { Modal } from 'ant-design-vue';
import { h } from 'vue';
import { downloadByData, downloadByUrl } from '/@/utils/file/download';
import { defHttp } from '/@/utils/http/axios';
// import { getToken } from '/@/utils/auth';

const imgs = ['png', 'jpg', 'gif', 'jpeg', 'svg'];

/**
 * 预览文件（微软插件）
 */
export function previewMicrosoft(record) {
  window.open(
    'https://view.officeapps.live.com/op/view.aspx?src=' +
      import.meta.env.VITE_FILE_PUBILC_PATH +
      '/sysFileInfo/download?id=' +
      record.fileInfoId || record.id,
  );
}
/**
 * 获取文件的预览地址
 * @param {文件实体} record
 * @param {实体的url字段名} field
 * @returns
 */
export function getFileUrl(record, field = 'fileUrl') {
  let url = `${import.meta.env.VITE_FILE_PUBILC_PATH}/sysFileInfo/download?id=${
    record.fileInfoId || record.id
  }&fullfilename=${record.fileOriginName || record.name}`;
  let arr = [];

  if (record[field]) {
    arr = record[field].split('.');
    if (record[field].includes('http')) {
      url = record[field];
    } else {
      if (record[field].charAt(0) == '/') {
        url = import.meta.env.VITE_FILE_PUBILC_PATH + record[field];
      } else {
        url = import.meta.env.VITE_FILE_PUBILC_PATH + '/' + record[field];
      }
    }
  }

  // 拼接token
  // const token = getToken();
  // url = url + '?token=' + token;

  const fileSuffix = record.fileSuffix || (Array.isArray(arr) && arr[arr.length - 1]);

  if (imgs.indexOf((fileSuffix || '').toLowerCase()) > -1) {
    return url;
  } else {
    return `${import.meta.env.VITE_FILE_PREVIEW_PUBLIC_PATH}/onlinePreview?url=${encodeURIComponent(
      Base64.encode(url),
    )}`;
  }
}
/**
 * 预览文件（kkfileview插件）
 */
export function previewBykkfileview(record) {
  let url = getFileUrl(record);
  let arr = record.fileUrl ? record.fileUrl.split('.') : [];
  const fileSuffix = record.fileSuffix || (Array.isArray(arr) && arr[arr.length - 1]);
  if (imgs.indexOf((fileSuffix || '').toLowerCase()) > -1) {
    const modal = Modal.info({
      title: () => record.fileOriginName || '图片预览',
      width: 620,
      closable: true,
      icon: null,
      okText: '关闭',
      content: () => h('div', { class: 'img-wrap' }, [h('img', { src: url, class: 'img-con' })]),
      onOk() {
        modal.destroy();
      },
    });
  } else {
    // eslint-disable-next-line no-undef
    window.open(url);
  }
}

/**
 * 预览文件（kkfileview插件）
 */
export function previewImage(url) {
  if (url) {
    console.log(url.fileSuffix);
    const modal = Modal.info({
      title: () => url.fileOriginName || '图片预览',
      width: 620,
      closable: true,
      icon: null,
      okText: '关闭',
      content: () => h('div', { class: 'img-wrap' }, [h('img', { src: url, class: 'img-con' })]),
      onOk() {
        modal.destroy();
      },
    });
  }
}
/**
 * 通过id下载文件
 */
export function downloadFileById(id, file) {
  console.log(file);
  defHttp
    .request({
      method: 'get',
      //timeout: 10 * 60 * 1000,
      url: '/sysFileInfo/getDownloadUrl',
      params: { id },
      //responseType: 'blob',
    })
    .then((res) => {
      downloadByUrl({
        url: res.url,
        fileName: res.fileOriginName,
      });
    });
}

/**
 * 通过文件流下载文件
 */
export function downloadfile(res, isImg) {
  console.log(isImg);
  const contentDisposition = res.headers['content-disposition'];
  let filename = window.decodeURI(contentDisposition.split('=')[1], 'UTF-8');
  // if (!filename.includes('.xlsx') && !isImg) {
  //   filename += '.xlsx';
  // }
  filename = filename.replace(/\"/g, '');
  downloadByData(res.data, filename);
}

/**
 * 接口文件实体转前端上传组件数据结构
 * field:{
 *  key(当前file的字段名):val(转换目标字段名)
 * }
 */
export function fileFieldConversion(
  files,
  field = {
    uid: 'id',
    id: 'id',
    name: 'fileOriginName',
    url: 'fileUrl',
  },
) {
  let cFiles = [];
  if (!files) {
    return cFiles;
  }
  let newField = { ...field };

  cFiles = Array.isArray(files) ? files : [files];

  return cFiles.map((item) => {
    let newObj = {};
    for (const key in newField) {
      if (key.includes('url')) {
        newObj[key] = getFileUrl(item, newField[key]);
      } else {
        newObj[key] = item[newField[key]];
      }
    }
    return newObj;
  });
}

/**
 * 禁用树状选择的枝节点
 */
export function disabledBranchNode(tree) {
  let newTree = [];
  if (Array.isArray(tree) && tree.length) {
    newTree = tree.map((item) => {
      let single = {};
      // 如果存在子项则禁用当前节点
      if (Array.isArray(item.children) && item.children.length) {
        single = {
          ...item,
          disabled: true,
          children: disabledBranchNode(item.children),
        };
      } else {
        single = item;
      }
      return single;
    });
  }
  return newTree;
}

/**
 * 多行文本换行
 */
export function buildContent(content) {
  if (!content) return '';
  return content.replaceAll('\n', '</br>');
}

// apiselect将json字符串转对象
export const parseJsonStr = (strObj) => {
  let componentPropsJson = {
    apiParams: null, // 接口请求参数
    type: '', //组件类型（单选多选）
  };
  if (strObj) {
    try {
      let componentPropsJsonStr = strObj.replace(/\r\n\s/g, '');
      const jsonObj = JSON.parse(componentPropsJsonStr);
      componentPropsJson = jsonObj;
    } catch (error) {
      console.log('error', error);
    }
  }
  return componentPropsJson;
};

/**
 * 根据路径获取文件名
 * @param {url} url 路径
 * @param {hasSuffix} 是否包含后缀
 * @returns 文件名
 */
export const filterUrlName = (url, hasSuffix) => {
  let name = '';
  if (url) {
    const pos = url.lastIndexOf('/'); // '/'所在的最后位置
    name = url.substr(pos + 1);
    if (!hasSuffix) {
      name = name.substring(0, name.lastIndexOf('.'));
    }
  }
  return name;
};

export const numFormat = (num) => {
  const c =
    num.toString().indexOf('.') !== -1
      ? num.toLocaleString()
      : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

  return c;
};

export const rmbChange = (rmb) => {
  let f_number = parseFloat(rmb).toFixed(2);
  let rmb_number = new String(Math.round(f_number * 100));
  let chineseValue = '';
  let String1 = '零壹贰叁肆伍陆柒捌玖';
  let String2 = '万仟佰拾亿仟佰拾万仟佰拾元角分';
  let len = rmb_number.length;
  let Ch1;
  let Ch2;
  let nZero = 0;
  let String3;

  if (len > 15) {
    return rmb;
  }
  if (rmb_number == 0) {
    chineseValue = '零元整';
    return chineseValue;
  }

  String2 = String2.substr(String2.length - len, len);
  for (let i = 0; i < len; i++) {
    String3 = parseInt(rmb_number.substr(i, 1), 10);
    if (i != len - 3 && i != len - 7 && i != len - 11 && i != len - 15) {
      if (String3 == 0) {
        Ch1 = '';
        Ch2 = '';
        nZero = nZero + 1;
      } else if (String3 != 0 && nZero != 0) {
        Ch1 = '零' + String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      }
    } else {
      if (String3 != 0 && nZero != 0) {
        Ch1 = '零' + String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 != 0 && nZero == 0) {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 == 0 && nZero >= 3) {
        Ch1 = '';
        Ch2 = '';
        nZero = nZero + 1;
      } else {
        Ch1 = '';
        Ch2 = String2.substr(i, 1);
        nZero = nZero + 1;
      }
      if (i == len - 11 || i == len - 3) {
        Ch2 = String2.substr(i, 1);
      }
    }
    chineseValue = chineseValue + Ch1 + Ch2;
  }
  if (rmb_number.substr(len - 2, 2) == '00') {
    chineseValue = chineseValue + '整';
  }
  return chineseValue;
};
