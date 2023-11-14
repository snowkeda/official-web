/* 监听localStorage变化 */

class WatchStorage {
    inited = null
    callback = null

    init() {
        if (window.addEventListener) window.addEventListener('storage', this.update, false);
        this.inited = true;
    }

    // 添加回调
    onChange(callback) {
        this.callback = callback;
    }

    // 触发回调
    update = (e) => {
        if (this.callback) this.callback(e.key);
    }

    // 组件销毁
    destroy() {
        if (this.inited && window.removeEventListener) window.removeEventListener('storage', this.update, false);
    }
}

export default new WatchStorage();
