export function formatDate (date, fmt) {
  // test() 方法用于检测一个字符串是否匹配某个模式
  // 这里判断字符串是否匹配包含至少一个y的字符串，如传入的'yyyy-MM-dd hh:mm'包含'yyyy'字符串
  if ((/(y+)/).test(fmt)) {
    // replace()用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
    // RegExp.$n，n的值介于[1,9]，为String类型，返回上一次正则不表达式匹配中，第n个子表达式所匹配的文本，这里$1匹配的文本为'yyyy'
    // substr(start,length)在字符串中抽取从 start 下标开始的指定数目的字符，length可选
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};
