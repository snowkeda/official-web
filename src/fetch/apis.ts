import request from './request';

export async function getRankList(params) {
    return request(`/apioption/v1/option/order/rank`, {
        params
    });
}

export async function getSpotList() {
    return request(`/api/spot/list`, {});
}
export async function getDashboard() {
    return request(`/api/dashboard`, {});
}
export async function getDashboardHome() {
    return request(`/api/dashboard/home`, {});
}
export async function getOrderRecord(params) {
    return request(`/api/order/record/page/user`, {params});
}
// 按epoch排行榜 epoch和user查询金额
export async function getOrderRecordRankEpoch(params) {
    return request(`/api/order/record/rank/epoch`, {params});
}
// epoch=147945400&user=0xd5bc84cf9685ad61e868a33a9a4d721e4caec816
export async function getUserRecordRankEpoch(params) {
    return request(`/api/order/record/score/epoch`, {params});
}
// 时间排行榜
export async function getOrderRecordRankTime(params) {
    return request(`/api/order/record/rank/time`, {params});
}
// 查询 type=WEEK&user=0xd5bc84cf9685ad61e868a33a9a4d721e4caec816
export async function getUserRecordRankTime(params) {
    return request(`/api/order/record/score/time`, {params});
}
