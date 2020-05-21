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
  emit(eventName, obj) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((cb) => cb(obj));
    }
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
