// 日志类
// 依赖apis

import UUID from '@/assets/js/uuid';

const FOTA_LOG = {
    CACHE_UUID: 'option_uuid',
    CACHE_EVENTLIST: 'option_eventlist',
    config: {
        lengthMax: 10,
        timeMax: 60,
    },
    uuid: null,
    msgList: [],
    cache: {},
    init(rootStore) {
        this.rootStore = rootStore;
        this.uuid = this.getUUID();
        this.loadStorage();
        // 定时处理缓存
        const { timeMax } = this.config;
        setInterval(() => {
            if (this.msgList.length) this.sendSvr();
        }, 1000 * timeMax);
        return this;
    },
    // 加载缓存
    loadStorage() {
        const msgList = window.localStorage.getItem(this.CACHE_EVENTLIST);
        if (msgList) {
            this.msgList = JSON.parse(msgList);
            this.sendSvr();
        }
    },
    // 获取uuid
    getUUID() {
        let uuid = window.localStorage.getItem(this.CACHE_UUID);
        if (uuid) return uuid;

        uuid = UUID('fota.com'); // TODO
        window.localStorage.setItem(this.CACHE_UUID, uuid);
        return uuid;
    },
    // 添加到缓存
    push({ event, data, userId }, isForce, isCache) {
        const time = Date.now();
        const msg = {
            eventCode: event,
            eventData: data && JSON.stringify(data),
            userId,
            time,
        };
        this.msgList.push(msg);
        if (isForce) this.sendSvr();
        else this.checkSend();
        if (isCache) this.cache[event] = msg;
    },
    // 清空缓存
    clear() {
        this.msgList = [];
        this.cache = {};
        window.localStorage.removeItem(this.CACHE_EVENTLIST);
    },
    // 检查是否符合发送条件
    checkSend() {
        const { lengthMax } = this.config;
        if (this.msgList.length >= lengthMax) this.sendSvr();
        else window.localStorage.setItem(this.CACHE_EVENTLIST, JSON.stringify(this.msgList));
    },
    // 发送请求
    reportEvent(data) {
        // this.rootStore.apis.postUserEvent(data);
    },
    // 上传数据
    sendSvr() {
        const { msgList } = this;
        this.clear();
        this.reportEvent({ eventList: msgList, uuid: this.uuid });
    },
    // 销毁
    destroy() {
        if (this.msgList.length) this.sendSvr();
    },
};

export default FOTA_LOG;
