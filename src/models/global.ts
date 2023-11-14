import { web3, utbContract, utbAddress, wethContract, oracleContractPromise, wethAddress, wethDecimal, 
  utbDecimal, usdtAddress, usdtContract, usdtAmount, usdtDecimal, usdtOracleAmount, usdtOracleDecimal,
  wethAmount, utbAmount, oracleDecimal } from '@/utils/utbEx'
import usdtIcon from '@/assets/img/trade/usdt-icon.png'
import utbIcon from '@/assets/img/trade/utb-icon.png'
import wethIcon from '@/assets/img/trade/weth-icon.png'

export default {
  namespace: 'global',
  state: {
    siteName: 'binax',
    currencyList: [
      {label: 'WETH', key: 0, value: 0, address: wethAddress, contract: wethContract, amount: wethAmount, decimal: wethDecimal, icon: wethIcon, decimalNum: 18},
      {label: 'UTB', key: 1, value: 1, address: utbAddress, contract: utbContract, amount: utbAmount, decimal: utbDecimal, icon: utbIcon, decimalNum: 18},
      {label: 'USDT', key: 2, value: 2, address: usdtAddress, contract: usdtContract, amount: usdtAmount, decimal: usdtDecimal, icon: usdtIcon,
      decimalNum: 6},
    ],
  },
  reducers: {
  },
  effects: {
  },
}
