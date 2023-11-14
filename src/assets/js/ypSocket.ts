/* socket功能封装 v20190530 */

// 监听网络状态
let isOnline = true;
function offline() { isOnline = false; }
function online() { isOnline = true; }
window.addEventListener('offline', offline);
window.addEventListener('online', online);
export function destroy() {
    window.removeEventListener('offline', offline);
    window.removeEventListener('online', online);
}

export default class YPSocket {
    constructor({
        url,
        heartBeatRate = 10, // 心跳频率，默认 10 秒
        heartBeatSend = '', // 心跳数据包
        heartBeatBack, // 心跳返回数据包验证函数
        messageRate, // 3，接收数据频率，可以比心跳短，提高响应速度
        autoConnect = true,
    }) {
        let wsUrl = url;
        if (wsUrl.indexOf('ws') !== 0) {
            const wsProtocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
            const host = wsUrl.indexOf('/') === 0 ? window.location.host : '';
            wsUrl = `${wsProtocol}//${host}${wsUrl}`;
        }
        // 服务器地址
        this.url = wsUrl;
        // 设置心跳频率
        this.heartBeatRate = heartBeatRate;
        // 设置心跳数据包
        this.heartBeatSend = heartBeatSend;
        // 心跳返回数据包验证函数
        this.heartBeatBack = heartBeatBack;
        // 设置接收数据频率
        this.messageRate = messageRate || heartBeatRate;
        // 是否重连
        this.isReconnect = true;
        // 重连次数
        this.reconnectCount = 0;
        // 重连次数最大值
        this.reconnectCountMax = 10;
        // 重连间隔
        this.reconnectRate = 5;
        // 未发送消息队列
        this.messageQueue = [];
        // 消息订阅函数
        this.mapSubscribe = {};
        'message ready close packData unpackData'
            .split(' ')
            .forEach((one) => { this.mapSubscribe[one] = []; });
        // socket连接状态
        this.isConnected = false;
        // socket整体可用状态
        this.isReady = false;

        // 最近接收数据包时间戳
        this.lastOnmessage = null;
        // 最近接收数据包时间间隔
        this.lastOnmessageDiff = 0;
        // 最近发送心跳包时间戳
        this.lastHeartBeatSend = null;
        // 最近收到心跳包时间间隔
        this.lastHeartBeatDiff = 0;
        // 心跳定时器
        this.heartbeatTimer = null;
        // 发送超时定时器
        this.sendTimer = null;

        // 开始连接
        if (autoConnect) this.connect();

        // 页面关闭时通知服务端，减少服务端报错日志
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    // 新建连接
    connect() {
        this.isReconnect = true;
        this.lastOnmessage = null;
        this.lastOnmessageDiff = 0;

        window.WebSocket = window.WebSocket || window.MozWebSocket;
        this.socket = new WebSocket(this.url);
        // this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        return this;
    }

    // 重新连接
    reconnect() {
        const delay = isOnline ? 1 : this.reconnectCount; // this.reconnectRate
        setTimeout(() => {
            if (!this.isConnected) this.connect();
        }, 1000 * delay);
    }

    // 检测状态
    ready() {
        if (this.isConnected) {
            const key = 'ready';
            if (this.mapSubscribe[key][0]) this.mapSubscribe[key][0]();
            this.isReady = true;
            this.reconnectCount = 0;

            // 开启心跳
            this.startHeartBeat();
            // 发送缓存区消息
            // console.log(this.messageQueue)
            this.messageQueue.forEach(pack => this.send(pack));
            this.messageQueue = [];
        }
    }

    // 关闭连接
    close(isReconnect) {
        this.isReconnect = isReconnect;
        this.isConnected = false;
        this.isReady = false;
        if (this.socket) {
            this.socket.close();
            // 等待服务端响应
            setTimeout(() => {
                // 断网场景，提前手动触发
                if (this.socket && this.socket.readyState === WebSocket.CLOSING) {
                    this.onclose({
                        code: 1006,
                        reason: '连接超时',
                    });
                }
            }, 1000);
        }
        return this;
    }

    // 发送消息
    send({ data, isCache = true }) {
        if (data) {
            // readyState：0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。
            if (this.isReady) { // this.socket.readyState === WebSocket.OPEN
                this.socket.send(this.packData(data));
            } else if (isCache) { // 消息缓存区
                this.messageQueue.push({ data, isCache });
            }
        }
        // 心跳超时，关闭连接并重连
        if (data === this.heartBeatSend && isOnline && !this.sendTimer) {
            this.sendTimer = setTimeout(() => {
                console.log(this.socket.readyState)
                this.isConnected = false;
                this.close(true);
            }, 1000 * this.messageRate);
        }
        return this;
    }

    // 打包发送消息
    packData(data) {
        const key = 'packData';
        if (this.mapSubscribe[key][0]) return this.mapSubscribe[key][0](data);
        return data && typeof data === 'object' ? JSON.stringify(data) : (data || '');
    }

    // 解包接收消息
    unpackData(data) {
        const key = 'unpackData';
        if (this.mapSubscribe[key][0]) return this.mapSubscribe[key][0](data);
        return data ? JSON.parse(data) : {};
    }

    // 发送心跳包
    heartBeat() {
        this.send({ data: this.heartBeatSend, isCache: false });
        this.lastHeartBeatSend = Date.now();
    }

    // 开启心跳包轮询
    startHeartBeat() {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
            this.heartBeat();
        }, 1000 * this.heartBeatRate);
    }

    // 加入消息订阅队列
    on(key = 'message', callback) {
        this.mapSubscribe[key] = [callback].concat(this.mapSubscribe[key]);
        if (key === 'ready' && this.isReady) {
            callback();
        }
        return this;
    }

    // 移除消息订阅队列
    off(key = 'message', callback) {
        if (this.mapSubscribe[key]) {
            this.mapSubscribe[key] = callback ? this.mapSubscribe[key].filter(one => one !== callback) : [];
        }
        return this;
    }

    // 触发消息队列回调
    trigger(key, data) {
        if (this.mapSubscribe[key]) return this.mapSubscribe[key].map(fn => fn(data));
        return null;
    }

    // 销毁，移除监听事件
    destroy() {
        if (window.removeEventListener) window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload = () => {
        if (this.socket) this.socket.close();
    }

    onopen() {
        console.log(`onopen`)
        this.isConnected = true;
        this.ready();
    }

    onmessage(e) {
        const dataUnpacked = this.unpackData(e.data);
        let isHeartBeatBack;
        // 检测网速
        const now = Date.now();
        if (this.lastOnmessage) this.lastOnmessageDiff = now - this.lastOnmessage;
        this.lastOnmessage = now;
        // 心跳包响应速度
        if (this.heartBeatBack && this.heartBeatBack(dataUnpacked)) {
            isHeartBeatBack = true;
            if (this.lastHeartBeatSend) {
                this.lastHeartBeatDiff = now - this.lastHeartBeatSend;
                this.lastHeartBeatSend = null;
            }
        }

        if (!isHeartBeatBack) {
            const key = 'message';
            if (this.mapSubscribe[key]) {
                this.mapSubscribe[key].forEach(one => one(dataUnpacked));
            }
        }

        // 重置心跳检测
        clearTimeout(this.sendTimer);
        this.sendTimer = null;
        this.isConnected = true;
    }

    onerror() {
        // 检测重连次数
        if (this.reconnectCount < this.reconnectCountMax) {
        // 动态调整频率
            this.reconnectCount = (this.reconnectCount + 1) % this.reconnectCountMax;
        } else {
        // this.isReconnect = false;
        }
    }

    onclose(e) {
        const key = 'close';
        if (this.mapSubscribe[key][0]) this.mapSubscribe[key][0](e);
        this.isReady = false;
        this.isConnected = false;
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
        clearTimeout(this.sendTimer);
        this.sendTimer = null;

        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            this.socket = null;
        }
        console.log(e)
        // if (this.isReconnect || e.code === 1006) this.reconnect();
        // else this.destroy();
    }
}
