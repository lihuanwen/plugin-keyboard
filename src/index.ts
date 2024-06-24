import { KeyboardImpl } from './keyboard'

export class Keyboard {
  public name = 'keyboard'
  private keyboardImpl: KeyboardImpl
  public options: KeyboardImpl.Options

  constructor(container: HTMLElement, options: KeyboardImpl.Options = {}) {
    this.keyboardImpl = new KeyboardImpl(container, this.options)
    this.options = { enabled: true, ...options }
  }

  // #region api
  enable() {
    this.keyboardImpl.enable()
  }

  disable() {
    this.keyboardImpl.disable()
  }

  bindKey(
    keys: string | string[],
    callback: KeyboardImpl.Handler,
    action?: KeyboardImpl.Action,
  ) {
    this.keyboardImpl.on(keys, callback, action)
    return this
  }
  unbindKey(keys: string | string[], action?: KeyboardImpl.Action) {
    this.keyboardImpl.off(keys, action)
    return this
  }

  trigger(key: string, action?: KeyboardImpl.Action) {
    this.keyboardImpl.trigger(key, action)
    return this
  }

  clear() {
    this.keyboardImpl.clear()
    return this
  }

  // #endregion
  dispose() {
    this.keyboardImpl.dispose()
  }
}
