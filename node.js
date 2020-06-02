const EventEmitter = require("events");

let emitter = new EventEmitter();

/**

emitter.on('myEvent', () => {
  console.log('hi 1');
});

emitter.on('myEvent', () => {
  console.log('hi 2');
});

 *
 hi 1
 hi 2
 */

/**
emitter.on('myEvent', () => {
  console.log('hi 1');
  emitter.emit('myEvent');
});
*
RangeError: Maximum call stack size exceeded
*/

/**
emitter.on("myEvent", function fn() {
  console.log("hi");
  emitter.emit("myEvent", fn);
});
RangeError: Maximum call stack size exceeded
*/
emitter.emit("myEvent");

// curry

const curry1 = (fn) =>
  (judge = (...args) =>
    args.length >= fn.length ? fn(...args) : (...arg) => fn(...args, ...arg));

const test = curry1(function (a, b, c) {
  console.log(a + b + c);
});

// test(1, 2, 3);
// test(1, 2)(3);

const curry2 = (fn, arr = []) => (...args) =>
  ((arg) => (arg.length >= fn.length ? fn(...arg) : curry2(fn, arg)))([
    ...arr,
    ...args,
  ]);
function sum(a, b, c) {
  console.log(a, b, c);
}
// const add = curry2(sum);

// add(1, 2);
// add(1, 2)(3);

const arr = [
  [[100]],
  [20, [30]],
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];

Array.prototype.flat = function (arr) {
  return [].concat(
    ...this.map((item) => (Array.isArray(item) ? item.flat() : [item]))
  );
};

const flat = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};

const unique = (arr) => {
  const temp = [];
  for (let i = 0, ilen = arr.length; i < ilen; i++) {
    // if (temp.indexOf(arr[i]) < 0) {
    //   temp.push(arr[i]);
    // }
    if (arr.indexOf(arr[i]) === i) {
      temp.push(arr[i]);
    }
  }
  return temp;
};

const flat1 = (arr) =>
  arr.reduce(
    (acc, cur) => (Array.isArray(cur) ? [...acc, ...flat(cur)] : [...acc, cur]),
    []
  );
console.log(flat1(arr));

function cdd(...outer) {
  let result = 0;
  result = outer.reduce((acr, cur) => acr + cur, result);

  let ret = function (...inner) {
    result = inner.reduce((acr, cur) => acr + cur, result);
    return ret;
  };

  ret.toString = function () {
    return result;
  };
  ret.valueOf = function () {
    return result;
  };
  return ret;
}

console.log(cdd(1).toString());
console.log(cdd(1, 2).toString());
console.log(cdd(1, 2)(3).toString());

function findTwoSum(arr, target) {
  let result = [];
  for (let i = 0, ilen = arr.length; i < ilen; i++) {
    const another = target - arr[i];
    const index = arr.indexOf(another, i);
    if (index > 0) {
      result.push(i, index);
      // break;
    }
  }
  return result;
}

findTwoSum([2, 3, 4, 5], 7);
findTwoSum([2, 3, 4, 5], 4);
findTwoSum([2, 3, 4, 5], 9);

const reg = /^(?:(https?|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
const str = "https://www.baidu.com/index.php?tn=78040160_5_pg&ch=12#video";
console.log(reg.test(str));

function mid(arr1, arr2) {
  let arr = [];
  while (arr1.length && arr2.length) {
    if (arr1[0] < arr2[0]) {
      arr.push(arr1.shift());
    } else {
      arr.push(arr2.shift());
    }
  }
  arr = arr.concat(arr1, arr2);
  console.log(arr);
  const len = arr.length;
  if (len % 2) {
    return arr[Math.floor(len / 2)];
  } else {
    return (arr[len / 2 - 1] + arr[len / 2]) / 2;
  }
}

console.log(mid([1, 3], [2]));
console.log(mid([1, 3], [2, 4]));

const numRstr = (num) =>
  num != 0 ? `${num % 10}${numRstr((num / 10) >> 0)}` : "";
const numRstr1 = (num) => num.toString().split("").reverse().join("");
console.log(numRstr(1230102030));
console.log(numRstr1(1230102030));

const sliceArray = (arr, size) => {
  let result = [];
  const len = arr.length;
  const arr_ = [...arr];

  for (let i = 0; i < size; i++) {
    let key = Math.floor(Math.random() * arr_.length);
    result.push(arr_[key]);
    arr_.splice(key, 1);
  }
  console.log(result);
  return result;
};
sliceArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);

const flatObj = (obj, parentKey = "", result = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keyName = `${parentKey}${key}`;
      if (typeof obj[key] === "object") {
        flatObj(obj[key], `${keyName}.`, result);
      } else {
        result[keyName] = obj[key];
      }
    }
  }
  return result;
};
var entry = {
  a: {
    b: {
      c: {
        dd: "abcdd",
      },
    },
    d: {
      xx: "adxx",
    },
    e: "ae",
  },
};
console.log(flatObj(entry));

const reverseFlatObj = (obj, result = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const firstIndex = key.indexOf(".");
      if (firstIndex > 0) {
        const arr = key.split(".");
        const len = arr.length - 1;
        arr.reduce((acr, cur, index) => {
          if (index === len) {
            acr[cur] = obj[key];
            return;
          } else {
            acr[cur] = acr[cur] || {};
            return acr[cur];
          }
        }, result);
      } else {
        // result = { [key]: obj[key] };
      }
    }
  }
  return result;
};
console.log(
  reverseFlatObj({ "a.b.c.dd": "abcdd", "a.d.xx": "adxx", "a.e": "ae" })
);

const findOne = (n) => {
  let str = "";
  while (n > 0) {
    str += n;
    n--;
  }
  return str.split("").filter((item) => item === "1").length;
};

console.log(findOne(100));

const allObj = (arr) =>
  arr.reduce((acr, cur) => ((acr[cur.id] = Object.assign({}, cur)), acr), {});

const someObj = [
  { id: 1 },
  { id: 2, pid: 1 },
  { id: 3, pid: 2 },
  { id: 4, pid: 1 },
  { id: 5, pid: 3 },
  { id: 6, pid: 2 },
  { id: 6, pid: 2 },
  { id: 2, pid: 1 },
];
console.log(allObj(someObj));

var arr_sort = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
function mySort(arr) {
  let pre = [];
  while (arr.length > 1) {
    pre.push(arr.pop());
    pre.push(arr.shift());
  }
  pre.push(arr.pop());
  console.log(pre);
}
mySort(arr_sort);

const addComma = (str) => str.replace(/(\d)(?=(\d{3})+\b)/g, "$1,");

console.log(addComma("123421.34"));
console.log(addComma("123421.3"));
console.log(addComma("1233435421.33532535"));

function multiRequest(urls, maxNum, callback) {
  let urlCount = urls.length;
  let requestQueue = [];
  let result = [];
  let currentIndex = 0;
  const handleRequest = (url) => {
    const req = fetch(url)
      .then((res) => {
        const len = result.push(res);
        if (len < urlCount && currentIndex + 1 < urlCount) {
          requestQueue.shift();
          handleRequest(urls[++i]);
        } else if (len === urlCount) {
          typeof callback === "function" && callback(result);
        }
      })
      .catch((e) => result.push(e));
    if (requestQueue.push(req) < maxNum) {
      handleRequest(urls[++i]);
    }
  };
  handleRequest(urls[i]);
}

function normalize(str) {
  let result = {};
  const arr = str.split(/[\[\]]/).filter((item) => item);

  arr.reduce((acr, cur, index, arr) => {
    acr.value = cur;
    if (index !== arr.length - 1) {
      return (acr.children = {});
    }
  }, result);
  console.log(arr);
  console.log(result);
}
normalize("[abc[bcd[def]]]");

const validParentheses = (str) => {
  if (!str) return false;
  const len = str.length;
  if (len % 2 !== 0) return false;
  const maps = {
    "(": 1,
    "[": 2,
    "{": 3,
    ")": -1,
    "]": -2,
    "}": -3,
  };
  const stack = [];
  for (let i = 0; i < len; i++) {
    const cur = maps[str[i]];
    if (cur > 0) {
      stack.push(cur);
    } else {
      if (cur + stack.pop() !== 0) return false;
    }
  }
  if (stack.length === 0) return true;
  return false;
};
console.log("valid", validParentheses("["));
console.log("valid", validParentheses("[]"));
console.log("valid", validParentheses("[()]"));
console.log("valid", validParentheses("[(]"));
console.log("valid", validParentheses("[{({[[{{()}}]]})}]"));

class Events {
  constructor() {
    this.handlers = {};
    return this;
  }
  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
  }
  off(eventName, callback) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter(
      (item) => item !== callback
    );
  }
  emit(eventName, ...rest) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((cb) => cb.apply(this.rest));
    }
  }
  once(eventName, callback) {
    function fn() {
      callback();
      this.off(eventName, callback);
    }
    this.on(eventName, fn);
  }
}

const e1 = new Events();
const e2 = new Events();

e1.on("say", (...args) => console.log("e1 on", args));
e2.on("say", (...args) => console.log("e2 on", args));

e1.emit("say", "e1 emit");
e2.emit("say", "e2 emit");

function reverse(arr) {
  let len = arr.length - 1;
  while (len > 0) {
    arr.splice(len, 0, arr.shift());
    len--;
  }
  console.log(arr);
  return arr;
}
reverse([1, 2, 3, 4, 5, 6, 7]);

var originArrPrototype = Array.prototype;
var arrPrototype = Object.create(originArrPrototype);
["push", "pop", "shift", "unshift"].forEach((method) => {
  arrPrototype[method] = function () {
    originArrPrototype[method].call(this, ...arguments);
  };
});

function observer(target) {
  if (target === null || typeof target !== "object") {
    return target;
  }
  if (Array.isArray(target)) {
    target.__proto__ = arrPrototype;
  }
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}
function defineReactive(obj, key, value) {
  observer(value);
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get obj[${key}]: ${value}`);
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        observer(newVal);
        console.log(`set obj[${key}]=${newVal}`);
        value = newVal;
      }
    },
  });
}

var reactData = {
  name: "ioodu",
  age: 21,
  address: {
    city: "ShenZhen",
  },
};
observer(reactData);
reactData.name;
reactData.age = { num: 26 };
reactData.address.city = "ChengDu";
console.log(reactData);

function threeSumZero(arr) {
  const len = arr.length;
  if (len < 3) return [];
  const nums = arr.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) break;
    if (nums[i] === nums[i - 1]) continue;
    let l = i + 1;
    let r = len - 1;
    while (l < r) {
      let sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) {
          l++;
        }
        while (l < r && nums[r] === nums[r - 1]) {
          r--;
        }
        l++;
        r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  console.log(result);
  return result;
}

threeSumZero([-1, 0, 1, 2, -1, -4]);

async function showLight(color, duration) {
  console.log(color, new Date().getMilliseconds());
  await new Promise((resolve, reject) => setTimeout(resolve, duration));
}
async function main() {
  while (true) {
    await showLight("red", 3000);
    await showLight("green", 1000);
    await showLight("yellow", 2000);
  }
}
// main();

/**
//Promise 完整的实现
class Promise {
  callbacks = [];
  state = "pending"; //增加状态
  value = null; //保存结果
  constructor(fn) {
    fn(this._resolve.bind(this), this._reject.bind(this));
  }
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      this._handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject,
      });
    });
  }
  catch(onError) {
    return this.then(null, onError);
  }
  finally(onDone) {
    if (typeof onDone !== "function") return this.then();

    let Promise = this.constructor;
    return this.then(
      (value) => Promise.resolve(onDone()).then(() => value),
      (reason) =>
        Promise.resolve(onDone()).then(() => {
          throw reason;
        })
    );
  }
  static resolve(value) {
    if (value && value instanceof Promise) {
      return value;
    } else if (
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    ) {
      let then = value.then;
      return new Promise((resolve) => {
        then(resolve);
      });
    } else if (value) {
      return new Promise((resolve) => resolve(value));
    } else {
      return new Promise((resolve) => resolve());
    }
  }
  static reject(value) {
    if (
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    ) {
      let then = value.then;
      return new Promise((resolve, reject) => {
        then(reject);
      });
    } else {
      return new Promise((resolve, reject) => reject(value));
    }
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      let fulfilledCount = 0;
      const itemNum = promises.length;
      const rets = Array.from({ length: itemNum });
      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (result) => {
            fulfilledCount++;
            rets[index] = result;
            if (fulfilledCount === itemNum) {
              resolve(rets);
            }
          },
          (reason) => reject(reason)
        );
      });
    });
  }
  static race(promises) {
    return new Promise(function (resolve, reject) {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          function (value) {
            return resolve(value);
          },
          function (reason) {
            return reject(reason);
          }
        );
      }
    });
  }
  _handle(callback) {
    if (this.state === "pending") {
      this.callbacks.push(callback);
      return;
    }

    let cb =
      this.state === "fulfilled" ? callback.onFulfilled : callback.onRejected;

    if (!cb) {
      //如果then中没有传递任何东西
      cb = this.state === "fulfilled" ? callback.resolve : callback.reject;
      cb(this.value);
      return;
    }

    let ret;

    try {
      ret = cb(this.value);
      cb = this.state === "fulfilled" ? callback.resolve : callback.reject;
    } catch (error) {
      ret = error;
      cb = callback.reject;
    } finally {
      cb(ret);
    }
  }
  _resolve(value) {
    if (this.state !== "pending") return;
    if (value && (typeof value === "object" || typeof value === "function")) {
      var then = value.then;
      if (typeof then === "function") {
        then.call(value, this._resolve.bind(this), this._reject.bind(this));
        return;
      }
    }

    this.state = "fulfilled"; //改变状态
    this.value = value; //保存结果
    this.callbacks.forEach((callback) => this._handle(callback));
  }
  _reject(error) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.value = error;
    this.callbacks.forEach((callback) => this._handle(callback));
  }
}
 */

/**
 *
 * @param {Array} arr 输入数组
 * @param {Number} index 要删除第几位
 * @param {Number} count 要删除几位
 */
const delArrSomeIndexData = (arr, index, count) => {
  let idx = index - 1;
  while (arr.length > 1) {
    if (idx + count >= arr.length) {
      arr.splice(idx);
      arr.splice(0, idx + count - arr.length + 1);
    } else {
      arr.splice(idx, count);
    }
    idx = (idx + index - 1) % arr.length;
    console.log(arr, idx);
  }
  console.log("del", arr);
  return arr;
};
delArrSomeIndexData([1, 2, 3, 4, 5], 2, 1);

// 最大子段和
const maxSum = (arr) => {
  let current = 0;
  let sum = 0;
  for (let i = 0, ilen = arr.length; i < ilen; i++) {
    if (current > 0) {
      current += arr[i];
    } else {
      current = arr[i];
    }

    if (current > sum) {
      sum = current;
    }
  }
  console.log("max sum", sum);
  return sum;
};

maxSum([1, 2, -1, 3, -8, -4]);

const findSubstr = (str1, str2) => {
  if (str1.length > str2.length) {
    [str1, str2] = [str2, str1];
  }
  const len1 = str1.length;
  for (let j = len1; j > 0; j--) {
    for (let i = 0; i < len1 - j; i++) {
      const current = str1.substr(i, j);
      if (str2.indexOf(current) >= 0) {
        return current;
      }
    }
  }
  return "";
};

console.log(findSubstr("aaa3333", "baa333cc"));
console.log(findSubstr("baa333ccX3333333x", "aaaX3333--"));

function lcs(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = [new Array(len2 + 1).fill(0)];
  for (let i = 1; i <= len1; i++) {
    dp[i] = [0];
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[len1][len2];
}
console.log(lcs("ABCBDAB", "BDCABA"));

function loneSubStr(s) {
  const arr = s.split("");
  const len = arr.length;
  if (len === 1) return 1;
  let maxLen = 0;
  for (let i = 0; i < len - 1; i++) {
    let str = arr[i];
    for (let j = i + 1; j < len; j++) {
      if (str.indexOf(arr[j]) !== -1) {
        maxLen = str.length > maxLen ? str.length : maxLen;
        break;
      }
      str += arr[j];
      maxLen = str.length > maxLen ? str.length : maxLen;
      break;
    }
  }
  return maxLen;
}
console.log(loneSubStr("abcabcbb"));

function longFirstStr(strs) {
  if (strs === null || strs.length === 0) return "";
  let prevs = strs[0];
  for (let i = 0, ilen = strs.length; i < ilen; i++) {
    let j = 0;
    for (; j < prevs.length && j < strs[i].length; j++) {
      if (prevs.charAt(j) !== strs[i].charAt(j)) break;
    }
    prevs = prevs.substr(0, j);
    if (prevs === "") return "";
  }
  return prevs;
}

function formatNum(...nums) {
  const arr = nums.sort((a, b) => a - b);
  const len = arr.length;
  let idx = 0;
  let temp = [[arr[0]]];
  for (let i = 1; i < len; i++) {
    if (arr[i] - 1 === arr[i - 1]) {
      temp[idx].push(arr[i]);
    } else {
      temp[++idx] = [arr[i]];
    }
  }
  for (let j = 0, jlen = temp.length; j < jlen; j++) {
    const len = temp[j].length;
    if (len > 1) {
      temp[j] = `${temp[j][0]}->${temp[j][len - 1]}`;
    } else {
      temp[j] = `${temp[j][0]}`;
    }
  }
  console.log(temp.join(","));
}
formatNum(1, 3, 4, 5, 7, 8, 9, 10, 13, 15, 16);

function permute(...nums) {
  const res = [];
  nums.sort((a, b) => a - b);
  find(nums, []);
  return res;
  function find(nums, temp) {
    const len = nums.length;
    if (nums.length === 0) {
      res.push(temp.slice());
    }
    for (let i = 0; i < len; i++) {
      temp.push(nums[i]);
      const copy = nums.slice();
      copy.splice(i, 1);
      find(copy, temp);
      temp.pop();
    }
  }
}

console.log(permute(1));
console.log(permute(1, 2, 3));

function trans(str) {
  if (typeof str !== "string") return "";
  let len = str.length;
  if (len < 2) return str;
  let idx = 1;
  let nums = 1;
  let res = str[0];
  let last = res;
  while (idx < len) {
    if (str[idx] === last) {
      nums++;
      if (idx === len - 1) {
        res = res + nums;
        break;
      }
    } else {
      res = res + (nums > 1 ? nums : "") + str[idx];
      last = str[idx];
      nums = 1;
    }
    idx++;
  }
  return res;
}
console.log(trans("aaabcccaa"));

function debounce(fn, wait, immediate = false) {
  let timeout;
  let result;
  const debounced = function (...args) {
    const _self = this;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        result = fn.apply(_self, args);
      }
    } else {
      timeout = setTimeout(() => {
        result = fn.apply(_self, args);
      }, wait);
    }
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}

class Lazy {
  constructor(name) {
    this.name = name;
    console.log(`My name is ${name}`);
    this.queue = [];
    setTimeout(() => this.next(), 0);
  }
  next() {
    const fn = this.queue.shift();
    fn && fn();
  }
  eat(food) {
    const fn = () => {
      console.log(`Eated food ${food}`);
      this.next();
    };
    this.queue.push(fn);
    return this;
  }
  sleep(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`Sleeped ${time} times`);
        this.next();
      }, time);
    };
    this.queue.push(fn);
    return this;
  }
  sleepFirst(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`First sleeped ${time} times`);
        this.next();
      }, time);
    };
    this.queue.unshift(fn);
    return this;
  }
}

function lazyMan(name) {
  return new Lazy(name);
}
lazyMan("ioodu").eat("apple").sleep(1000).sleepFirst(2000).eat("pinapple");

/**
{
 type: 'h1',
 props: {
  className: "",
  style: "",
 },
 children: [] // 嵌套节点
}
*/

function create(vnode) {
  const props = vnode.props || {};
  const children = vnode.children || [];
  if (typeof vnode !== "object") {
    return document.createTextNode(vnode);
  }
  const el = document.createElement(vnode.type);
  for (let attr in props) {
    if (attr === "className") {
      el.setAttribute("class", props[attr]);
    } else if (attr === "htmlFor") {
      el.setAttribute("for", props[attr]);
    } else {
      el.setAttribute(attr, props[attr]);
    }
  }
  children.map(create).forEach(el.appendChild.bind(el));
  return el;
}

/** binary tree
       1
  2          3
4    5    6    7
*/
const root = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
    },
  },
  right: {
    val: 3,
    left: {
      val: 6,
    },
    right: {
      val: 7,
    },
  },
};

// 递归
// 先序
function rlr(root) {
  if (!root) return "";
  console.log(root.val);
  rlr(root.left);
  rlr(root.right);
}

// 中序
function lrr(root) {
  if (!root) return "";
  lrr(root.left);
  console.log(root.val);
  lrr(root.right);
}

// 后序
function lr(root) {
  if (!root) return "";
  lr(root.left);
  lr(root.right);
  console.log(root.val);
}

// 非递归前序遍历
function RLR(root) {
  const arr = [];
  const res = [];
  if (root) {
    arr.push(root);
  }
  while (arr.length) {
    const temp = arr.pop();
    res.push(temp.val);
    if (temp.right) {
      arr.push(temp.right);
    }
    if (temp.left) {
      arr.push(temp.left);
    }
  }
  return res;
}

// 非递归中序遍历
function LRR(root) {
  const arr = [];
  const res = [];
  while (true) {
    while (root) {
      arr.push(root);
      root = root.left;
    }
    if (arr.length === 0) break;
    const temp = arr.pop();
    res.push(temp.val);
    root = temp.right;
  }
  return res;
}

// 非递归后序遍历
function LR(root) {
  const arr = [];
  const res = [];
  arr.push(root);
  while (arr.length) {
    const temp = arr.pop();
    res.push(temp.val);
    if (temp.left) {
      arr.push(temp.left);
    }
    if (temp.right) {
      arr.push(temp.right);
    }
  }
  return res.reverse();
}

function dfs(root) {
  const res = [];
  const arr = [];
  if (!root) return [];
  arr.push(root);
  while (arr.length) {
    const temp = arr.pop();
    res.unshift(temp.val);
    temp.left && arr.push(temp.left);
    temp.right && arr.push(temp.right);
  }
  return res;
}

console.log(dfs(root));

function intersect(nums1, nums2) {
  nums1 = nums1.sort((a, b) => a - b);
  nums2 = nums2.sort((a, b) => a - b);
  const len1 = nums1.length;
  const len2 = nums2.length;
  let i = 0;
  let j = 0;
  let k = 0;
  while (i < len1 && j < len2) {
    if (nums1[i] < nums2[j]) {
      i++;
    } else if (nums1[i] > nums2[j]) {
      j++;
    } else {
      nums1[k++] = nums1[i];
      i++;
      j++;
    }
  }
  return nums1.slice(0, k);
}
console.log(intersect([1, 3, 2, 4, 5, 2], [2, 3, 4, 2]));

function triangleNumer(...nums) {
  const len = nums.length;
  if (len < 3) return 0;
  let res = 0;
  nums.sort((a, b) => a - b);
  for (let i = len - 1; i > 1; i--) {
    let l = 0;
    let r = i - 1;
    while (l < r) {
      if (nums[l] + nums[r] > nums[i]) {
        res += r - l;
        r--;
      } else {
        l++;
      }
    }
  }
  return res;
}

console.log(triangleNumer(3, 4, 5, 6));
/**
// koa-mini
const http = require("http");
// Context
class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
}
function compose(middlewares) {
  return (ctx) => {
    const dispatch = (i) => {
      const middleware = middlewares[i];
      if (!middleware) return;
      return middleware(ctx, () => dispatch(i + 1));
    };
    return dispatch(0);
  };
}
class Application {
  constructor() {
    this.middleware = [];
  }
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = new Context(req, res);
      const fn = compose(this.middlewares);
      await fn(ctx);
      ctx.res.end(ctx.body);
    });
    server.listen(...args);
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
}

// test
const app = new Application();
app.use(async (ctx) => {
  ctx.body = "hello world";
  await next();
});
app.use(async (ctx) => {
  ctx.body = "hello world 2";
  await next();
});
app.listen(8080);
 */

function isValidSortPoke(...nums) {
  const repeat = new Set();
  let min = 14;
  let max = 0;
  for (let i = 0, ilen = nums.length; i < ilen; i++) {
    if (nums[i] === 0) continue;
    max = Math.max(nums[i], max);
    min = Math.min(nums[i], min);
    if (repeat.has(nums[i])) return false;
    repeat.add(nums[i]);
  }
  console.log(repeat, max, min);
  return max - min < 5;
}

console.log("isvalidPoke", isValidSortPoke(1, 2, 3, 4, 5));
