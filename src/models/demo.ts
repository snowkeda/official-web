
import apis from '@/fetch/index';
import { getRankList } from '@/fetch/apis';
import { request } from 'umi'
export default {
  namespace: 'demo',
  state: {
    num: 0,
    data: {}
  },
  reducers: {
    add(state: any,{ payload }): any {
      console.log(payload)
      return { ...state, ...payload }
    },
  },
  effects: {
    *appStatusChangeFunc({ payload }, { put, call, select }) {
      const res = yield call(getRankList, payload)
      console.log(res)
      // yield put({ type: 'add', payload: res });
      // return res
    },
    *addAsync(_action: any, { put }: any) {
      yield put({ type: 'add', payload: _action.payload });
    },
    *throwError(_action: any) {
      throw new Error('effect error');
    },
  },
/*   subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((obj) => {
        console.log(obj)
        // dispatch({
        //   type: 'appStatusChangeFunc', 
        //   payload: { ws: ws },
        // });
      })
    }
  }, */
}
