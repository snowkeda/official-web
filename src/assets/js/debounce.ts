// 函数去抖节流优化
export default function debounce(func, wait = 0, options) {
    let maxWait;
    let timerId;
    let context;
    let args;
    let result;
    let previous = 0;

    if (options) {
        maxWait = options.maxWait || 0;
    }
    maxWait = maxWait || wait;

    function later() {
        timerId = null;
        result = func.apply(context, args);
        context = null;
        args = null;
    }

    return function debounced(..._args) {
        const now = Date.now();
        if (!previous) previous = now;
        context = this;
        args = _args;
        if (timerId) clearTimeout(timerId);
        if (now - previous < maxWait) {
            timerId = setTimeout(later, wait);
        } else {
            previous = now;
            result = func.apply(context, args);
            context = null;
            args = null;
        }
        return result;
    };
}
