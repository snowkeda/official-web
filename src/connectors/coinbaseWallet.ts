import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'

import { URLS } from '@/utils/chains'

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) => {

    return new CoinbaseWallet({
      actions,
      options: {
        url: URLS[CHAIN_ID][0],
        appName: 'web3-react',
      },
    })
  }
    
)
