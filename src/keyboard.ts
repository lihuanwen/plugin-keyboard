import Mousetrap from 'mousetrap'

export class KeyboardImpl {
  public readonly target: HTMLElement | Document
  private readonly container: HTMLElement
  private readonly mousetrap: Mousetrap.MousetrapInstance

  constructor(container: HTMLElement, private readonly options: KeyboardImpl.Options) {
    this.container = container

    if (container) {
      this.target = this.container
      if (!this.disabled) {
        // ensure the container focusable
        this.target.setAttribute('tabindex', '-1')
      }
    } else {
      this.target = document
    }

    this.mousetrap = KeyboardImpl.createMousetrap(this)
  }

  get disabled() {
    return this.options.enabled !== true
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      if (this.target instanceof HTMLElement) {
        this.target.setAttribute('tabindex', '-1')
      }
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      if (this.target instanceof HTMLElement) {
        this.target.removeAttribute('tabindex')
      }
    }
  }

  on(
    keys: string | string[],
    callback: KeyboardImpl.Handler,
    action?: KeyboardImpl.Action,
  ) {
    this.mousetrap.bind(this.getKeys(keys), callback, action)
  }

  off(keys: string | string[], action?: KeyboardImpl.Action) {
    this.mousetrap.unbind(this.getKeys(keys), action)
  }

  clear() {
    this.mousetrap.reset()
  }

  trigger(key: string, action?: KeyboardImpl.Action) {
    this.mousetrap.trigger(key, action)
  }

  private getKeys(keys: string | string[]) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) =>
      this.formatkey(key),
    )
  }

  protected formatkey(key: string) {
    const formated = key
      .toLocaleLowerCase()
      .replace(/\s/g, '')
      .replace('delete', 'del')
      .replace('cmd', 'command')
      .replace('arrowup', 'up')
      .replace('arrowright', 'right')
      .replace('arrowdown', 'down')
      .replace('arrowleft', 'left')

    return formated
  }

  protected isGraphEvent(e: KeyboardEvent) {
    const target = e.target as Element
    const currentTarget = e.currentTarget as Element
    if (target) {
      if (
        target === this.target ||
        currentTarget === this.target ||
        target === document.body
      ) {
        return true
      }
    }

    return false
  }

  isInputEvent(e: KeyboardEvent) {
    const target = e.target as Element
    const tagName = target?.tagName?.toLowerCase()
    let isInput = ['input', 'textarea'].includes(tagName)
    return isInput
  }

  isEnabledForEvent(e: KeyboardEvent) {
    const allowed = !this.disabled && this.isGraphEvent(e)
    const isInputEvent = this.isInputEvent(e)
    if (allowed) {
      if (isInputEvent && (e.key === 'Backspace' || e.key === 'Delete')) {
        return false
      }
    }
    return allowed
  }

  dispose() {
    this.mousetrap.reset()
  }
}

export namespace KeyboardImpl {
  export type Action = 'keypress' | 'keydown' | 'keyup'
  export type Handler = (e: KeyboardEvent) => void

  export interface Options {
    enabled?: Boolean
  }
}

export namespace KeyboardImpl {
  export function createMousetrap(keyboard: KeyboardImpl) {
    const mousetrap = new Mousetrap(keyboard.target as Element)
    const stopCallback = mousetrap.stopCallback
    mousetrap.stopCallback = (
      e: KeyboardEvent,
      elem: HTMLElement,
      combo: string,
    ) => {
      if (keyboard.isEnabledForEvent(e)) {
        if (stopCallback) {
          return stopCallback.call(mousetrap, e, elem, combo)
        }
        return false
      }
      return true
    }

    return mousetrap
  }
}
