// 获取小数位数
export function getNumPoint(num) {
    const str = String(num);
    return (str.split('.')[1] || '').length;
}
// 时间格式转换
export function timestampToTime(timestamp, f) {
    const date = new Date(Number(timestamp));
    const y = date.getFullYear();
    const u = date.getMonth();
    const d = date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    if (f === 1) {
        return `${h}:${m}:${s}`;
    }
    return `${y}.${u + 1}.${d} ${h}:${m}:${s}`;
}
// 判断是否ie浏览器
export function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true;
    }
    return false;
}

// 线上nginx代理之后，html里的imgUrl无法正确指向option下的static，这里修正
export function getRealUrl(url) {
    window.console.log(process.env.NODE_ENV, '修改URL');
    if (process.env.NODE_ENV === 'production') {
        const [, b] = url.split('/static/');
        if (b) {
            return `/option/static/${b}`;
        }
    }
    return url;
}
