class DocHidden {
    hidden = false
    callback = null
    documentHidden = null
    eventVisibilityChange = null

    constructor() {
        if (document.addEventListener) {
        // 页面隐藏属性
            if (typeof document.hidden !== 'undefined') {
                this.documentHidden = 'hidden';
                this.eventVisibilityChange = 'visibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                this.documentHidden = 'webkitHidden';
                this.eventVisibilityChange = 'webkitvisibilitychange';
            }
            if (this.documentHidden) {
                this.updateHidden();
                document.addEventListener(this.eventVisibilityChange, this.updateHidden, false);
            }
        }
    }

    // 页面显示隐藏状态变化
    onVisibilityChange(callback) {
        this.callback = callback;
    }

    // 更新状态
    updateHidden = () => {
        this.hidden = document[this.documentHidden];
        if (this.callback) this.callback(this.hidden);
    }

    destroy() {
        if (this.documentHidden) document.removeEventListener(this.eventVisibilityChange, this.updateHidden, false);
    }
}

export default new DocHidden();
