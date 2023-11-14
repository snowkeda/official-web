
import apis from '@/fetch/index';
import { getRankList } from '@/fetch/apis';
import Decimal from 'decimal.js'
import { web3, utbContract, oracleContractPromise, usdtOracleDecimal, wethContract, wethAddress, wethDecimal, utbDecimal, wethAmount, utbAmount, oracleDecimal } from '@/utils/utbEx'
import { divided, multiply } from '@/utils/calculate' 
export default {
  namespace: 'wallet',
  state: {
    userAddressList: [],
    userAddress: '',
    utbBalance: 0,
    openWallet: false,
  },
  reducers: {
    set(state: any,{ payload }): any {
      return { ...state, ...payload }
    },
  },
  effects: {
    *getUtbBalance({ payload }, { put, call, select }) {
      const { userAddressList } = yield select(state => state.wallet);
      const res = yield utbContract.methods.balanceOf(userAddressList[0]).call()
      const num = web3.utils.toNumber(res.toString()/utbDecimal)
      yield put({ 
        type: 'set',
        payload: { utbBalance: num }  
      });
      return num
      
    },
    *setOpenWallet({ payload }, { put, call, select }) {
      yield put({ 
        type: 'set',
        payload: { ...payload }  
      });
    },
    // 获取 $
    *getOraclePrice({ payload }, { put, call, select }) {
      const { currencyList } = yield select(state => state.global);
      const {balanceCurrency, balanceValue, receiveValue, balanceInputValue, receiveInputValue, otherPrice, utbPrice} = payload
      const ocpRes = yield oracleContractPromise
      console.log(ocpRes)
      console.log(payload)
      // 例 eth 兑换币在右 false  左 true
      const typeFlag = balanceCurrency === 'UTB' ? false : true
      const option = typeFlag ? currencyList[balanceValue] : currencyList[receiveValue]
      console.log(option)
      const res = yield ocpRes.methods.getPrice(option.address, typeFlag).call()
      console.log(res) 
      const oracleD = option.label === 'USDT' ? usdtOracleDecimal : oracleDecimal
      const unit = divided(res.toString(), oracleD);
      console.log(typeFlag)
      if (!typeFlag) {
        const bd = new Decimal(balanceInputValue).mul(otherPrice)
        const dollar = {
          balanceDollar: multiply(bd, unit, 6),
          receiveDollar: multiply(unit, receiveInputValue, 6),
        }
        yield put({ 
          type: 'set',
          payload: { dollar }  
        });
        return dollar
      } else {
        const ud = new Decimal(receiveInputValue).div(utbPrice)
        const dollar = {
          balanceDollar: multiply(unit, balanceInputValue, 6),
          receiveDollar: multiply(unit, ud, 6),
        }
        yield put({ 
          type: 'set',
          payload: { dollar }  
        });
        return dollar
      }
    },
    // Price utb => 其他币 
    *getOtherPrice({ payload }, { put, call, select }) {
      const { options } = payload;
      const res = yield utbContract.methods  
      .calcRemoveLiquidity(options.address, web3.utils.toBigInt(utbDecimal))
      .call()
      const { outAmountAfterFee } = res;
      return divided(outAmountAfterFee.toString(), options.decimal, 6)
    },
    // Price 其他币 => utb
    *getUtbPrice({ payload }, { put, call, select }) {
      const { options } = payload
      const res = yield utbContract.methods  
      .calcAddLiquidity(options.address, web3.utils.toBigInt(options.decimal))
      .call()
      // .then((res) => {
      //   console.log(res)
      //   const { lpAmount } = res;
      //   this.setState({
      //     utbPrice: divided(web3.utils.toBigInt(lpAmount).toString(), utbDecimal, 6)
      //   })
      // });
      const { lpAmount } = res;
      return divided(web3.utils.toBigInt(lpAmount).toString(), utbDecimal, 6)
    }
    // *appStatusChangeFunc({ payload }, { put, call, select }) {
    //   const res = yield call(getRankList, payload)
    //   console.log(res)
    //   // yield put({ type: 'add', payload: res });
    //   // return res
    // },
    // *addAsync(_action: any, { put }: any) {
    //   yield put({ type: 'add', payload: _action.payload });
    // },
    // *throwError(_action: any) {
    //   throw new Error('effect error');
    // },
  },
}
