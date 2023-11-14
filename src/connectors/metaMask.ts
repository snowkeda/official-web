import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

export const [metaMask, hooks, metaMaskStore] = initializeConnector<MetaMask>((actions) => {
  return new MetaMask({ 
    actions,
    onError: (error: Error) => {
      console.debug(`web3-react error: ${error}`)
    }
  })
})
