/* 手势功能 */

class Gesture {
    dom = null
    eventName = null
    callback = null

    on(dom, eventName = 'mousewheel', callback, capture) {
        this.eventName = eventName;
        this.dom = dom;
        this.callback = callback;

        if (document.addEventListener) {
            if (this.eventName === 'mousewheel' && document.mozFullScreen !== undefined) this.eventName = 'DOMMouseScroll';
            this.dom.addEventListener(this.eventName, this.mousewheelEvent, capture || false);
        }
    }

    off() {
        if (this.dom) {
            this.dom.removeEventListener(this.eventName, this.mousewheelEvent, false);
            this.dom = null;
        }
    }

    mousewheelEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        this.callback(delta);
    }

    destroy() {
        this.off();
    }
}

export default new Gesture();
