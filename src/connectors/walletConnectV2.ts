import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
console.log('@web3-react/walletconnect-v2')
export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        // projectId: process.env.walletConnectProjectId,
        projectId: WALLETCONNECT_PROJECTID,
        chains: [CHAIN_ID],
        optionalChains: [CHAIN_ID],
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark'
        }
      },
    })
)
