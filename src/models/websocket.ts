import WsStore from '@/services/WsStore'
import SDK from '@/fetch/sdk';

export default {
  namespace: 'websocket',
  state: {
      messages: undefined,
      client_id: undefined,
      wsStore: undefined,
      SDK: SDK,
      wsData: {},
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   const { location, listen } = history;
    //   if (location.pathname === '/home') {
    //     console.log('订阅setup')
    //       const { config } = SDK
    //       const wsStore = WsStore.init(SDK, config)
    //       wsStore.sendReq(2, {
    //         currency: 'ETH'
    //       })
    //       wsStore.sendReq(1, {
    //         currency: 'ETH'
    //       }) 
    //       dispatch({ type: 'set', payload: { wsStore } })
    //       wsStore.on('message', (res) => {
    //         // ws1 实时
    //         // ws2 历史
    //         // 更新ws数据
    //         dispatch({ type: 'setWsData', payload: { [`ws${res.reqType}`]: res.data } })
    //       })
    //   }
    // },
  },
  effects: {
    *open({payload}, {put, call}) {
      const { config } = SDK
      let wsStore = WsStore;
      console.log(payload)
      console.log(WsStore.isConnected, 'open')
      if (!WsStore.isConnected) {
        wsStore = yield WsStore.init(SDK, config)
      }
      const nIntervId = yield setInterval(() => {
        wsStore.sendReq(2, payload)
        wsStore.sendReq(1, payload)
        WsStore.isConnected && clearInterval(nIntervId)
      }, 100)
      // yield wsStore.sendReq(2, payload)
      // yield wsStore.sendReq(1, payload)
      yield put({ type: 'set', payload: { wsStore } })
      return true
      // wsStore.on('message', (res) => {
      //   console.log(res)
      //   // ws1 实时
      //   // ws2 历史
      //   // 更新ws数据
      //   yield put({ type: 'setWsData', payload: { [`ws${res.reqType}`]: res.data } })
      // })
     
      // const data = yield call(WsStore, config);
      // console.log(data)
    },
    *realTimeData(obj, {put, call, select}) {
      const { wsStore } = yield select(state => state.websocket )
      const { wsData } = wsStore;
      yield put({ type: 'set', payload: {wsData} });
    }
  },
  reducers: {
    set(state: any,{ payload }): any {
      return { ...state, ...payload }
    },
    setIsConnected(state, { payload } ) {
      return { ...state, ...payload }
    },
    setWsData(state, { payload }) {
        return { ...state,  wsData: {...state.wsData, ...payload}}
    },
    clearWsData(state) {
      return { ...state,  wsData: {}}
    },
    destroy(state) {
      state.wsStore && state.wsStore.destroy();
      return { ...state,  wsStore: undefined, wsData: {} }
    }
  }
}