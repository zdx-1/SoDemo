/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment, { unitOfTime } from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format);
}
export function strToDate(str: string, format = DATE_FORMAT): moment.MomentInput {
  return moment(str, format);
}
export function strToDateTime(str: string, format = DATE_TIME_FORMAT): moment.MomentInput {
  return moment(str, format);
}
/**
 * 计算相差时间
 * @param startTime
 * @param endTime
 * @returns
 */
export function diff(
  startTime: moment.Moment,
  endTime: moment.Moment,
  unitOfTime: unitOfTime.Diff = 'hours',
) {
  if (startTime && endTime) {
    return endTime.diff(startTime, unitOfTime);
  }
  return undefined;
}
/**
 * 格式化毫秒数
 * @param milliseconds
 * @returns
 */
export const formatMilliseconds = (milliseconds) => {
  // 定义各个时间单位的毫秒数
  const units = {
    month: 30 * 24 * 60 * 60 * 1000, // 假设一个月为30天
    week: 7 * 24 * 60 * 60 * 1000, // 一周为7天
    day: 24 * 60 * 60 * 1000, // 一天为24小时
    hour: 60 * 60 * 1000, // 一小时为60分钟
    minute: 60 * 1000, // 一分钟为60秒
    second: 1000, // 一秒
  };
  const uniNames = {
    month: '月',
    week: '周',
    day: '天',
    hour: '小时',
    minute: '分钟',
    second: '秒',
  };
  // 遍历时间单位，找到最接近的
  for (const unit in units) {
    if (milliseconds >= units[unit]) {
      const count = Math.floor(milliseconds / units[unit]);
      return count + '' + uniNames[unit];
    }
  }
  // 如果毫秒数小于一秒，返回"0秒"
  return '0秒';
};
export const dateUtil = moment;
