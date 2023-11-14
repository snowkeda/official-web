import { getBetPs, getBetCs, getBetPsCs } from '@/fetch/graphqlApi'
import { getOrderRecord } from '@/fetch/apis';
export default {
  namespace: 'trade',
  state: {
    // 是否轮询未结算订单
    searchSettle: false,
    // 买涨买跌点
    betCPList: [],
    // 未结算订单记录
    epochInfoList: [],
    // 结算订单
    settlementEpoch: 0,
    // 结算金额 utb
    totalAmount: 0, 
    // 触发结算次数
    settlementFlag: 0,
  },
  reducers: {
    set(state: any,{ payload }): any {
      if (payload.betCPObj) {
        let betCPList = [...state.betCPList, payload.betCPObj];
        delete payload.betCPObj;
        return { ...state, ...payload, betCPList }
      }
      return { ...state, ...payload }
    },
  },
  effects: {
    *getBetPsCs({ payload }, { put, call, select }) {
      const res = yield call(getBetPsCs, payload)
      // yield put({ type: 'add', payload: res });
      return res
    },
    *getBetCs({ payload }, { put, call, select }) {
      const res = yield call(getBetCs, payload)
      // yield put({ type: 'add', payload: res });
      return res
    },
    *getHistory({payload}, { put, call, select }) {
      return yield call(getOrderRecord, payload)
    }
  },
}
