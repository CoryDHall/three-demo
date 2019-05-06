interface _TimelineFn {
  start(...args: any): void
  stop(): void
}

export class Utils {
  static throttle(fn: Function, wait: number = 50) {
    let id: number | null = null;

    return (...args: any) => {
      if (typeof id === 'number') return;
      id = setTimeout(() => id = null, wait);
      fn(...args)
    }
  }

  static debounce(fn: Function, wait: number = 50) {
    let id: number | null = null;

    return (...args: any) => {
      if (typeof id === 'number') clearTimeout(id);
      id = setTimeout(() => {
        fn(...args)
        id = null;
      }, wait);
    }
  }

  static repeatTime(fn: Function, wait: number = 50): _TimelineFn {
    let id: number;

    return {
      start: (...args: any) => {
        (function loop() {
          id = setTimeout(loop, wait);
          fn(...args)
        })()
      },
      stop: () => {
        clearTimeout(id)
      }
    }
  }

  static repeatAnimation(fn: Function): _TimelineFn {
    let id: number;

    return {
      start: (...args: any) => {
        (function loop() {
          id = requestAnimationFrame(loop);
          fn(...args)
        })()
      },
      stop: () => {
        cancelAnimationFrame(id)
      }
    }
  }

  static biRandom(): number { return 2 * Math.random() - 1 }
}
