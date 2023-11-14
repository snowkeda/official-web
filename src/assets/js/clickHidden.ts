// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function matchesPolyfill() {
            return false;
        };
}

export default class ClickHidden {
    constructor(selector, callback) {
        this.selectorArray = Array.isArray(selector) ? selector : [selector];
        this.callback = callback;
        this.createEvent = this.createEvent.bind(this);
        this.eventFunc = this.eventFunc.bind(this);
        this.destroy = this.destroy.bind(this);
        this.createEvent();
    }
    createEvent() {
        if (document.addEventListener) {
            document.body.addEventListener('click', this.eventFunc, false);
        }
    }

    eventFunc(e) {
        if (this.selectorArray.some(selector => e.target.matches(selector))) {
            return;
        }
        this.callback();
    }

    destroy() {
        if (document.removeEventListener) {
            document.body.removeEventListener('click', this.eventFunc, false);
        }
    }
}
