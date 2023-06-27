import { extend, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

// Relect 的优点
// 1.后续Object的方法属性会往Reflect迁移
// 2.如果用target[key] = value 方式设置值可能会失败，并不会报异常，也没有返回值标识
// 2.Reflect 方法具备返回值,判断是否设置成功

// 是否是仅读的，是的话set时会报异常
// 是否是深度的
function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
  // target: 目标对象 key: 属性名 receiver: Proxy
  return function get(target, key, receiver) {
    // 使用 reflect获取结果
    // target: 需要取值的目标对象 key: 需要获取的值的键值 receiver: 如果target对象中指定了getter，receiver则为getter调用时的this值
    // 相当于 target[key]
    const res = Reflect.get(target, key, receiver);

    // 如果是非仅读的，进行依赖收集，等会数据变化后更新对应视图
    if (!isReadonly) {
    }

    // 如果是浅层的
    if (shallow) return res;
    // vue2是初始化就直接递归代理，vue3是取值时会进行代理（懒代理）
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter(isShallow: boolean = false) {
  // target: 目标对象 key: 属性名 value: 新属性值 receiver: Proxy
  return function set(target, key, value, receiver) {
    // target: 需要取值的目标对象 key: 需要获取的值的键值 value: 设置的值 receiver: 如果target对象中指定了getter，receiver则为getter调用时的this值
    const result = Reflect.set(target, key, value, receiver);
    return result;
  };
}

// 生成 getter
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 生成 setter
const set = createSetter();
const shallowSet = createSetter(true);

// readonly Setter
const readonlyObj = {
  set: (target, key) => {
    console.warn(`set ${target} on key ${key} failed`);
  },
};

export const mutableHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};
export const readonlyHandlers = extend({
  get: readonlyGet
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj);
