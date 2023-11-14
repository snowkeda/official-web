import { getOrderRecordRankEpoch, getOrderRecordRankTime } from '@/fetch/apis';
export default {
  namespace: 'record',
  state: {
  },
  reducers: {

  },
  effects: {
    *getOrderRecordRankEpoch({payload}, { put, call, select }) {
      return yield call(getOrderRecordRankEpoch, payload)
    },
    *getOrderRecordRankTime({payload}, { put, call, select }) {
      return yield call(getOrderRecordRankTime, payload)
    },
  }
}