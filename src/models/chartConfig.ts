
export default {
  namespace: 'chartConfig',
  state: {
    // 间距
    spacing: 60,
    // 结算周期
    epochPeriod: 200,
    // 结算起始块
    oldEpoch: 0,
    // 交易币种
    assetName: 'BTC',
  },
  reducers: {
    set(state: any,{ payload }): any {
      return { ...state, ...payload }
    },
  },
  effects: {
  },
}
