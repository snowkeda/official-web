// v1.7.1.fota.20190723
import React from 'react';

export const sdkConfig = {
    socketHost: '/apioption/wsoption',
    httpHost: '/apioption',
    webApiHost: '/api',
    isDevelopment: false,
    brokerId: '2',
    // 腾讯验证码服务appid
    captchaAppid: '2073564755',
    // 跳转路由
    mapUrl: {
        home: '/home',
        login: '/common/login?hrefLink=/option/',
        deposit: '/comm/fund/wallet',
        allorder: '/comm/fund/history/wallet/optionhistory', // TODO
    },
    // 左上角logo 以icon开头使用icon字体，否则引用 assets/img/logo.png
    logo: 'MINIFI', // 'icon-logo-fota',
    // 是否监听本地缓存
    isLoadLocalStorage: true,
    // 开启右上角活动图标
    showActAccount: true,
    // 开启缩放
    showZoom: true,
    // 开启排行榜
    showRank: true,
    // 开启教学视频
    showVideo: true,
};

export const apiConfig = {
    assign() {},
};

// 深拷贝
function deepCopy(obj0, obj2) {
    const obj1 = obj0;
    Object.keys(obj2).forEach((one) => {
        obj1[one] = typeof obj2[one] === 'object' ? deepCopy(obj1[one], obj2[one]) : obj2[one];
    });
    return obj1;
}
export const i18nConfig = {
    assign(resources) {
        Object.keys(this.resources).forEach((one) => {
            deepCopy(resources[one].translation, this.resources[one]);
        });
    },
    resources: {
        en: {
            title: 'MINIFI.com: Option Trading',
            spots: {
                moreUrl: 'https://fota.zendesk.com/hc/en-us/categories/360001126033-Guide-to-Trading',
            },
        },
        zh: {
            title: 'MINIFI.com: 期权交易',
            spots: {
                moreUrl: 'https://fota.zendesk.com/hc/zh-cn/sections/360002657034-%E6%95%B0%E5%AD%97%E6%9C%9F%E6%9D%83',
            },
        },
        ko: {
            title: 'MINIFI.com: 디지털옵션',
            spots: {
                moreUrl: 'https://fota.zendesk.com/hc/ko/sections/360002825213-%EC%98%B5%EC%85%98%EA%B3%84%EC%95%BD',
            },
        },
        hindi: {
            title: 'MINIFI.com: विकल्प ट्रेडिंग',
            spots: {
                moreUrl: 'https://fota.zendesk.com/hc/en-us/categories/360001126033-Guide-to-Trading',
            },
        },
        malay: {
            title: 'MINIFI.com: Dagangan Pilihan',
            spots: {
                moreUrl: 'https://fota.zendesk.com/hc/en-us/categories/360001126033-Guide-to-Trading',
            },
        },
    },
};

// export const domConfig = {
//     spotView_more: () => {
//         return <a href={t('spots.moreUrl')} target="_blank" rel="noopener noreferrer">{t('spots.moreInfo')}</a>
//     }
// };
