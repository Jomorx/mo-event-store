import { isObject } from "../utils/index";
import { MoEventBus } from "../event-bus";
import { IOption, OnlyString } from "./types";
export class MoEventStore<
  S extends Record<string, any>,
  A extends Record<string, (ctx:S,...args:any)=>void>
> {
  public state: S;
  public event: MoEventBus;
  public eventV2: MoEventBus;
  public actions!: A;

  constructor(options: IOption<S, A>) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type");
    }
    //有action并且action是object
    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions);
      for (const value of values) {
        if (typeof value !== "function") {
          throw new TypeError("the value of actions must be a function");
        }
      }
      this.actions = options.actions;
    }
    //初始化
    this.state = options.state;
    this._observe(options.state);
    this.event = new MoEventBus();
    this.eventV2 = new MoEventBus();
  }

  _observe(state: S) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.event.emit(key, _value);
          // _this.eventV2.emit(key, { [key]: _value });
        },
      });
    });
  }

  onState<K extends OnlyString<keyof S>>(stateKey: K , stateCallback: (arg:S[K])=>void) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key");
    }
    // 存入eventBus
    this.event.on(stateKey, stateCallback);

    // callback
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    //拿到state的初始值
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  offState<K extends OnlyString<keyof S>>(stateKey: K, stateCallback: (arg:S[K])=>void) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key");
    }
    // 从bus中删除回调
    this.event.off(stateKey, stateCallback);
  }
  dispatch<K extends OnlyString<keyof A>>(actionName: K, ...args: any) {
    if (typeof actionName !== "string") {
      throw new TypeError("the action name must be string type");
    }
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error("this action name does not exist, please check it");
    }
    const actionFn = this.actions[actionName];
    actionFn.apply(this, [this.state, ...args]);
  }

}
