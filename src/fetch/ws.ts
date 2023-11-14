import SDK from './sdk';

function getWsUrl() {
    return `${SDK.config.socketHost}?brokerId=${SDK.config.brokerId}`;
}
export default {
    getWsUrl,
};
