/**
 * 工具函数（H5 版，与小程序 utils/util.js 逻辑一致）
 */
var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function fmtDate(ts) {
  var d = new Date(ts);
  return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function fmtWeek(ts) { return WEEK[new Date(ts).getDay()]; }

function fmtTime(ts) {
  var d = new Date(ts);
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function fmtFull(ts) { return fmtDate(ts) + ' ' + fmtWeek(ts) + ' ' + fmtTime(ts); }

function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function parseDateTime(dateStr, timeStr) {
  return new Date(dateStr.replace(/-/g, '/') + ' ' + timeStr + ':00').getTime();
}

function toDateStr(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function toTimeStr(ts) { return fmtTime(ts); }

var util = { pad: pad, fmtDate: fmtDate, fmtWeek: fmtWeek, fmtTime: fmtTime, fmtFull: fmtFull, uid: uid, parseDateTime: parseDateTime, toDateStr: toDateStr, toTimeStr: toTimeStr };
