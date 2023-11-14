import { apiConfig } from './config';

// 配置简化转换
function conversion(url, method, headers = {}) {
    return {
        url,
        method,
        headers,
    };
}

// ajax通用配置
export default {
    getConfig: conversion('v2/option/config', 'get'), // 获取配置
    getAssets: conversion('v1/option/order/listAsset', 'get'), // 获取币种列表
    getRankList: conversion('v1/option/order/rank', 'get'), // 获取排行榜列表
    getVideoList: conversion('v1/option/teach', 'get', {
        'Accept-Language': 'pt-PT'
    }), // 获取视频列表
    postCaptcha: conversion('v1/antimachine/verify', 'post'), // 发送验证码结果
    postUserEvent: conversion('v1/option/user/behavior', 'post'), // 发送事件埋点
    ...apiConfig.assign(conversion),
};
