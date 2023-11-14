// ws请求封装类
// 依赖authStore、pageHidden
import YPSocket from '@/assets/js/ypSocket';

class WsStore {
    wsObj = null
    socketTimer = null
    isConnected = false
    wsData = {} // TODO

    constructor(config) {
        this.config = config;

        const wsData = {};
        Array(30).fill().forEach((v, i) => { wsData[`ws${i + 1}`] = 0; });
        this.wsData = wsData;
    }

    setIsConnected(data) {
        this.isConnected = data;
    }
    setWsData(data) {
        Object.assign(this.wsData, data);
    }
    clearWsData() {
        this.wsData = {};
    }

    // init() {
    //     return this;
    // }

    init(rootStore, config) {
        this.rootStore = rootStore;
        this.wsObj = new YPSocket({
        // url: 'ws://192.168.10.15:8093/wsoption',
            url: WS_URL, // TODO
            // url: `ws://192.168.101.15:8094/ws`, // TODO
            // url: `${config.socketHost}?brokerId=${config.brokerId}`, // TODO
            // url: `ws://www.mini-fi.com${config.socketHost}?brokerId=${config.brokerId}`, // TODO
            ...this.config,
        });
        const { SDK } = this.rootStore;

        this.on('ready', () => {
            this.setIsConnected(true);
        });
        this.on('close', () => {
            this.setIsConnected(false);
        });
        let timeType6 = 0;
        let timeType12 = 0;
        this.on('message', (res) => {
            if (res.code != null) {
                let data = {};
                if (res.code === 0) {
                    ({ data } = res);
                } else {
                    SDK.error(res);
                }
                const type = res.reqType || res.type;
                if (type) {
                    // 临时处理登录过期的code不统一的问题
                    if (String(type) === '4' && res.code !== 0) {
                        this.rootStore.clearCache();
                    }
                    // 临时屏蔽多次结算消息
                    if (String(type) === '6') {
                        const timeType6New = Date.now();
                        if (timeType6New - timeType6 < 10000) return;
                        timeType6 = timeType6New;
                    } else if (String(type) === '12') {
                        const timeType12New = Date.now();
                        if (timeType12New - timeType12 < 10000) return;
                        timeType12 = timeType12New;
                        // 结算后重新获取账户信息(主要是余额)
                        this.sendReq(4, null, true);
                    }
                    // 后期可以去抖优化
                    this.setWsData({
                        [`ws${type}`]: data
                    });
                }
            }
        });
        // this.reaction1 = reaction(
        //     () => this.rootStore.pageHidden,
        //     (pageHidden) => {
        //         if (pageHidden) {
        //             this.socketTimer = setTimeout(() => {
        //                 this.close();
        //             }, 1000 * 60);
        //         } else {
        //             clearTimeout(this.socketTimer);
        //             this.open();
        //         }
        //     }
        // );
        return this;
    }

    open() {
        this.wsObj.reconnect();
    }

    send(data) {
        this.wsObj.send(data);
        return data;
    }

    // 发送业务请求
    sendReq(reqType, param, authcheck, isCache = false) {
        // 自动监听联网状态
        if (this.isConnected) {
            const data = { reqType };
            if (param) data.param = param;
            // if (authcheck) {
            //     const { sessionId } = this.rootStore.authStore;
            //     const lSessionId = localStorage.getItem('sessionId');
            //     if (!sessionId && !lSessionId) return;
            //     data.sessionId = sessionId || lSessionId;
            // }
            const isPost = authcheck && param;
            this.send({
                data,
                isCache: isCache || !isPost,
            });
            return data;
        }
    }

    close(flag) {
        this.wsObj.close(flag);
    }

    on(key, callback) {
        this.wsObj.on(key, callback);
    }

    off(key, callback) {
        this.wsObj.off(key, callback);
    }

    destroy() {
        this.off('ready');
        this.off('close');
        this.off('message');
        this.close(false);
        this.wsObj.destroy()
        // this.reaction1();
    }
}

const wsStore = new WsStore({
    messageRate: 3,
    heartBeatRate: 10,
    heartBeatSend: { event: 'ping' },
    heartBeatBack: res => res.event === 'pong',
});

window.wsStore = wsStore;

window.emitWs12 = () => {
    const profit = Number((Math.random()).toFixed(2));
    wsStore.setWsData({
        ws12: {
            assetCode: 1,
            currency: 15,
            optionType: 1,
            profit: profit > 0.5 ? profit : (`-${profit}`)
        }
    });
};

export default wsStore;
