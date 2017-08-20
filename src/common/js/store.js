export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {// 如果localStorage未存储过seller的话，需要创建这两个对象
    seller = {};
    seller[id] = {};
  } else {
    // 因为localStroge存储的是JSON字符串，所以需要把JSON字符串转换成JS对象
    seller = JSON.parse(seller);
    if (!seller[id]) {//如果seller有了，但是seller[id]没有，也需要单独创建这个对象
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
