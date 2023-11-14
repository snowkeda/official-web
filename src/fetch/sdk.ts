// 对外的SDK接口
// 依赖log、authStore、audioStore

import { sdkConfig } from './config';

class SDKStore {
    ready = false
}

const FOTA_SDK = {
    CACHE_ACCOUNTID: 'option_accountId',
    CACHE_LANGAUGE: 'option_lang',
    LANGAUGE_ENGLISH: 'en',
    LANGAUGE_SIMPLE_CHINESE: 'zh',
    LANGAUGE_KOREAN: 'ko',
    LANGAUGE_VIETNAM: 'vi',
    config: {
        ver: 'v0.7.1.20190723',
        ...sdkConfig,
    },
    init(rootStore) {
        this.rootStore = rootStore;
        this.store = new SDKStore();
        return this;
    },
    ready() {
        this.store.ready = true;
        if (this.config.ready) this.config.ready(this);
        this.log('sdkready');
    },
    log(event, data, isForce, isCache) {
    // 播放音频
        const eventAudio = event;
        if (['click', 'error', 'message', 'trade', 'settleSucc', 'settleFail'].includes(eventAudio)) {
            if (eventAudio === 'click') {
                if (data === 'document') this.playAudio(eventAudio, data);
            } else {
                this.playAudio(eventAudio, data);
            }
        }

        // 触发回调
        const eventOn = event;
        if (['sdkready', 'home', 'login', 'deposit', 'allorder', 'click_asset', 'rich', 'trade', 'tradeSucc', 'settle', 'lang'].includes(eventOn)) { // 'tradeUnsettled', 'tradeSettled'
            this.on(eventOn, data);
        }

        // 埋点记录
        let eventLog = event;
        let eventData = data;
        if (['click', 'open', 'close'].includes(eventLog)) {
            // eslint-disable-next-line no-param-reassign
            if (eventLog === 'open') isCache = true;
            if (eventLog === 'close') {
                const eventLogOpen = `open_${eventData}`;
                const cacheOpen = this.rootStore.log.cache[eventLogOpen];
                eventData = cacheOpen ? { staytime: Date.now() - cacheOpen.time } : null;
            } else {
                eventData = null;
            }
            eventLog = `${event}_${data}`; // TODO
        }
        if ([
            'open_page', 'close_page', 'click_home', 'click_login', 'click_deposit', 'click_account', 'click_btc/usd_digital', 'click_eth/usd_digital', 'click_btc/usd_gamma', 'click_eth/usd_gamma', 'open_spot', 'close_spot', 'open_history', 'close_history', 'open_rank', 'close_rank', 'open_video', 'close_video', 'click_time_2m', 'click_time_5m', 'click_time_15m', 'click_time_30m', 'click_time_3h', 'click_time_1d', 'click_time_7d', 'open_price', 'close_price', 'click_price_otm', 'click_price_gamma', 'change_input', 'click_input_add', 'click_input_sub', 'click_lookup', 'click_lookdown', 'click_outside', 'click_inside', 'click_lang', 'zoom_out', 'zoom_in'
        ].includes(eventLog)) {
            this.logSvr(eventLog, eventData, isForce, isCache);
        }
    },
    logSvr(event, data, isForce, isCache) {
        this.rootStore.log.push({
            event,
            data,
            userId: this.rootStore.authStore.userId, // TODO
        }, isForce, isCache);
    },
    // message(content, type = 'success') {
    //     message[type](content);
    //     if (type === 'error') {
    //         this.log('error', content);
    //     } else {
    //         this.log('message', content);
    //     }
    // },
    error(data) {
        this.rootStore.setError(data);
        if (this.config.error) this.config.error(data);
    },
    goto(data, local) {
        const url = this.config.mapUrl[data];
        if (url) {
            if (local) window.location.href = url;
            else window.open(url);
        }
    },
    on(event, data) {
        if (this.config.on) this.config.on(event, data);
    },
    setLanguege(data) {
        this.rootStore.setLang(data);
    },
    clearCache() {
        this.rootStore.clearCache();
    },
    playAudio(data) {
        this.rootStore.audioStore.play(data);
    },
};

const mapType = {
    0: {
        op: 'api',
        url: 'v1/login', // 登录绑定
    },
    1: {
        op: 'subscribe',
        url: 'v1/spot/index/timely', // 实时点+下单结果
    },
    2: {
        op: 'api',
        url: '', // 指定时间的现货历史
    },
    3: {
        op: 'api',
        url: 'v1/spot/index/history', // 全量现货历史
    },
    4: {
        op: 'subscribe',
        url: 'v1/account/balance', // 用户资产
    },
    5: {
        op: 'api',
        url: 'v1/order', // 下单
    },
    6: {
        op: 'subscribe',
        url: 'v1/traded/history', // 全量订单
    },
    7: {
        op: 'api',
        url: 'v1/unsettled/trade', // 未结算订单
    },
    8: {
        op: 'subscribe',
        url: 'v1/exchange/spot/index', // 现货指数
    },
    9: {
        op: 'subscribe',
        url: 'v1/exercise/price', // 订阅行权价
    },
    10: {
        op: 'api',
        url: 'v1/account/balance/reset', // 重置模拟账户
    },
    11: {
        op: 'unsubscribe',
        url: '', // 取消订阅
    },
    12: {
        op: 'subscribe',
        url: 'v1/settled/trade', // 订阅结算数据
    },
    13: {
        op: 'subscribe',
        url: 'v1/front/config', // 前端配置推送
    },
    14: {
        op: 'api',
        url: 'v1/account/username', // 设置昵称
    },
    15: {
        op: 'subscribe',
        url: 'v1/antimachine/status', // 订阅人机识别开关
    },
    51: {
        op: 'api',
        url: 'v1/currency/config', // 获取资产币种列表
    },
};
const mapUrl = {};
Object.keys(mapType).forEach((one) => {
    mapUrl[mapType[one].url] = +one;
});
FOTA_SDK.mapType = mapType;
FOTA_SDK.mapUrl = mapUrl;

export default window.FOTA_SDK = FOTA_SDK;
