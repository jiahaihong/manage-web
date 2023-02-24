/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 13:24:23
 * @LastEditors: Please set LastEditors
 * @Description: 全局公共方法文件
 */
import XLSX from 'xlsx'

/**
 * 是否为空
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
export const $isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
  // String or Array
  case '[object String]':
  case '[object Array]':
    return !val.length;

    // Map or Set or File
  case '[object File]':
  case '[object Map]':
  case '[object Set]': {
    return !val.size;
  }
  // Plain Object
  case '[object Object]': {
    return !Object.keys(val).length;
  }
  default: return false
  }
}

/**
 * 对象转为数组下拉框
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
export const $setObjectToArray = function(val) {
  if ($isEmpty(val)) {
    return []
  }
  return Object.keys(val).map(t => ({
    label: val[t],
    value: t,
  }))
}

/**
 * 全局过滤器
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
const $filter = function(value, group) {
  const type = Object.prototype.toString.call(value)
  const empty = ["[object Null]", "[object Undefined]"]
  if (empty.includes(type)) {
    return "--";
  } else {
    value = value.toString();
  }
  if (group) {
    const groupTemp = Object.entries(group);
    for (const i of groupTemp) {
      if (i[0] == value) {
        return i[1]
      }
    }
    return "--";
  }
};

/**
 * 深拷贝
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
export const $deepcopy = function(obj, type) {
  if (type === 'JSON') {
    return JSON.parse(JSON.stringify(obj))
  }
  if (typeof obj !== 'object' || obj == null) return obj;

  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    /* eslint-disable */
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] !== 'object' || obj == null ? obj[key] : $deepcopy(obj[key]);
    }
  }
  return newObj;
}

/**
 * 创建A标签下载
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
const $CreatDownload = function(param) {
  const { file, FileName, href } = param
  let url = null
  if (file) { // 文件流下载
    url = window.URL.createObjectURL(
      new Blob([file], { type: "octet/stream" })
    )
  }
  if (href) { // 地址下载
    url = href
  }
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = url;
  a.download = FileName;
  a.click();
  setTimeout(() => {
    a.remove();
  }, 0);
};

/**
 * JSON转XLSX表格导出
 * @param {Object | Array} target
 * @returns {Object | Array}
 */
const $ExportXLSX = function(data = [], FileName = "", params = {}) {
  const {
    SheetName = 'SheetJS'
  } = params
  // 定义excel文档的名称
  var ws_name = SheetName
  // 初始化一个excel文件
  var wb = XLSX.utils.book_new();
  // 初始化一个excel文档，此时需要传入数据
  var ws = XLSX.utils.aoa_to_sheet(data);
  // 将文档插入文件并定义名称
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  // 执行下载
  XLSX.writeFile(wb, FileName);
};

/**
 * @description: 设置表单校验配置 (有待优化)
 * @param {*} message 消息
 * @param {*} trigger 方式 blur/change
 * @return {*}
 */
export const $setRules = ({
  required = true,
  message = '', 
  trigger = 'change',
  validator = [],
  type,
  /**
   * @description: keepDecimal 和 numberRange 一起使用
   * @param {*}
   * @return {*}
   */
  keepDecimal = -1, // 保留小数点位数
  numberRange = []
}) => {
  const result = [
    { required, trigger, message }
  ]

  try {
    /**
     * @description: 自定义规则
     * @param {*}
     * @return {*}
     */
    if (!$isEmpty(validator)) {
      result.push(...validator)
      throw '下面不用执行'
    }
    /**
     * @description: 数字范围以及小数点
     * @param {*} isEmpty
     * @return {*}
     */
    if (!$isEmpty(numberRange) || keepDecimal !== -1) {
      if (keepDecimal !== -1 && !/^(0|[1-9][0-9]*)$/.test(`${keepDecimal}`)) {
        console.warn(`${keepDecimal} keepDecimal值必须为0和正整数`)
        return
      }

      const validateNumber = (rule, value, callback) => {
        if (Number.isNaN(Number(value)) || /\.$/.test(value)) {
          callback(new Error(`输入值必须为数字类型`))
          return
        }
        /**
         * @description: 校验 保留几位小数
         * @param {*} keepDecimal
         * @return {*}
         */
        if (keepDecimal >= 0 && `${value}`.includes('.')) {
          const arr = `${value}`.split('.')
          const len = arr[1].length
          const text = keepDecimal === 0 ? `请输入整数`: `请输入不超过${keepDecimal}位小数的数字`
          if (len > keepDecimal) {
            callback(new Error(text))
            return
          }

        }

        /**
         * @description: 校验 数字范围
         * @param {*} small 最小范围，null: 无最小值
         * @param {*} big 最大范围，null: 无最大值
         * @param {*} sText 最小值文案
         * @param {*} bText 最大值文案
         * @return {*}
         */
        const [small, big, sText, bText] = numberRange
        const smallText = sText ? sText : `请输入不能小于${small}的数字`
        const bigText = bText ? bText : `请输入大于${big}的数字`
        if (typeof small === 'number' && typeof big !== 'number') {
          if (value < small) {
            callback(new Error(smallText))
            return
          }
        } else if (typeof small !== 'number' && typeof big === 'number') {
          if (value > big) {
            callback(new Error(bigText))
            return
          }
        } else if (typeof small === 'number' && typeof big === 'number') {
          if (value < small || value > big) {
            callback(new Error(`请输入${small}-${big}之间的数字`))
            return
          }
        }
        callback()
      }
      // result[0].validator = validateNumber
      result.push({validator: validateNumber})
      throw '下面不用执行'
    }
    // message 和 numberRange不能同时有
    
    if (type === 'number') {
      result.push({ pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的正整数' })
    }
    if (type === 'number[2]') {
      result.push({ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入不超过两位小数的正整数' })
    }
    if (type === 'name') {
      result.push({ pattern: /^[\S]+(\s+[\S]+)*$/, message: '请输入字符，首尾不能存在空格' })
    }
    if (type === 'phone') {
      result.push({ pattern: /^1[3456789]\d{9}$/, message: '请输入格式正确的手机号' })
    }
    
  } catch (error) {
    // console.warn('$setRules', error)
  }
  return result;
}

/**
 * localStroage
 */
const $setLocalStorage = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
const $getLocalStorage = function(key) {
  return JSON.parse(window.localStorage.getItem(key) || null);
};
const $removeLocalStorage = function(key) {
  window.localStorage.removeItem(key);
};
const $clearLocalStorage = function() {
  window.localStorage.clear();
};

/**
 * @description: 部门级联数据去空
 * @param {*} data
 * @return {*}
 */
const $removeEmpty = function(data) {
  data.map((item) => {
    if (!Array.isArray(item.children) || !item.children.length) {
      delete item.children;
    } else if (item.children && item.children.length) {
      $removeEmpty(item.children);
    }
  });
  return data;
};
// base64转图片
const $dataURLtoFile = function(dataurl, filename = "file") {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const suffix = mime.split("/")[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime,
  });
};
// 将base64转换为blob
const $dataURLtoBlob = function(dataurl) {
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
// 将blob转换为file
const $blobToFile = function(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};
// base64 to ArrayBuffer
const $base64ToArrayBuffer = function(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export default {
  $isEmpty,
  $filter,
  $deepcopy,
  $CreatDownload,
  $ExportXLSX,
  $setRules,
  $setLocalStorage,
  $getLocalStorage,
  $removeLocalStorage,
  $clearLocalStorage,
  $removeEmpty,
  $dataURLtoFile,
  $dataURLtoBlob,
  $blobToFile,
  $base64ToArrayBuffer
};
