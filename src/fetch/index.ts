// http请求封装类
// 依赖SDK.message

import axios from 'axios';
import api from './api';
import { request } from 'umi'

const myApi = {};
// Object.entries(api).forEach((item) => {
//     const options = item[1];
//     myApi[item[0]] = request(options.url, {
        
//     });
// });
// console.log(myApi)
// option 请求
const apis = {
    init(rootStore, config) {
        const { httpHost, brokerId } = config;
        const { SDK } = rootStore;

        // 公共参数配置
        const instance = axios.create({
            baseURL: httpHost,
            timeout: 10000, // TODO
            headers: { 'content-type': 'application/json' },
        });
        // 拦截请求
        instance.interceptors.request.use((options) => {
            const { lang } = rootStore; // 取最新值
            const { headers } = options;
            Object.assign(options.headers, {
                'Accept-Language': lang === 'portugues' ? (headers['Accept-Language'] || lang) : lang,
                Platform: 1,
                'Platform-Type': 'pc',
                'Broker-Id': brokerId,
                brokerId
            });
            return options;
        }, (err) => {
            SDK.error({ code: 1000 }); // 统一提示，系统异常
            return err;
        });
        instance.interceptors.response.use((res) => {
            if (!res) return {};
            if (res.data.code !== 0) {
                SDK.error(res.data);
                // return Promise.reject(res.data);
            }
            return res.data;
        });

        // 创建单个请求
        function createApi(options) {
            return (data = {}) => {
                const keyData = options.method === 'post' ? 'data' : 'params';
                const t = Date.now();
                return instance({
                    ...options,
                    [keyData]: {
                        ...data,
                        brokerId, // TODO
                        t,
                    },
                }).catch((e) => {
                    SDK.message(e.message || e.msg, 'error');
                    return e;
                });
            };
        }
        // 批量注册方法
        Object.entries(api).forEach(([name, options]) => {
            apis[name] = createApi(options);
        });

        return apis;
    }
};

// web请求
export const webApis = {
    init(rootStore, config) {
        const { webApiHost } = config;

        // 公共参数配置
        const instance = axios.create({
            baseURL: webApiHost,
            timeout: 10000, // TODO
            headers: { 'content-type': 'application/json' },
        });

        // 拦截请求 添加 Authorization
        instance.interceptors.request.use((options) => {
            const { auth } = window.localStorage;
            const { lang } = rootStore; // 取最新值
            Object.assign(options.headers, {
                'Accept-Language': lang,
                Authorization: auth || '',
            });
            return options;
        }, err => err);

        instance.interceptors.response.use((res) => {
            if (!res) return {};
            return res.data;
        }, err => err);

        // 创建单个请求
        function createApi(options) {
            return (data = {}) => {
                const keyData = options.method === 'post' ? 'data' : 'params';
                const t = Date.now();
                return instance({
                    ...options,
                    [keyData]: {
                        ...data,
                        t,
                    },
                }).catch(e => e);
            };
        }
        // 批量注册方法
        Object.entries(webApi).forEach(([name, options]) => {
            webApis[name] = createApi(options);
        });
        return webApis;
    }
};

window.axios = axios; // TODO
export default apis;
