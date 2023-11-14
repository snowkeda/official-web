import { useState, useEffect } from 'react';
import { connect } from 'umi'
import { hooks, walletConnectV2 } from '@/connectors/walletConnectV2'
import { MAINNET_CHAINS } from '@/utils/chains'
import { URI_AVAILABLE } from '@web3-react/walletconnect-v2'

const WalletConnect = (props) => {
  console.log(URI_AVAILABLE)
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks
  console.log(useIsActivating())
  const { desiredChainId } = props;
  useEffect(() => {
    walletConnectV2.events.on(URI_AVAILABLE, (uri: string) => {
      console.log(`uri: ${uri}`)
    })
  }, [])
  // attempt to connect eagerly on mount
/*   useEffect(() => {
    walletConnectV2.connectEagerly().catch((error) => {
      console.debug('Failed to connect eagerly to walletconnect', error)
    })
  }, []) */
  const getAccounts = async () => {
    await walletConnectV2.activate(desiredChainId).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <div>
      <button type='button' onClick={() => getAccounts()}>WalletConnectV2</button>
    </div>
  )
}

export default WalletConnect;