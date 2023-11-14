import { useEffect, useState } from 'react'
import Web3 from 'web3';
import { hooks, metaMask } from '@/connectors/metaMask'
import Card from '@/components/web3React/Card'
let n = 0;
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks
function MetaMaskCard(props: any) {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)
  // const web3 = new Web3('https://goerli-rollup.arbitrum.io/rpc');
  // console.log(props)
  // if (accounts && accounts[0]) {
  //   // setAc(accounts[0])
  //   web3.eth.getBlockNumber().then(console.log)
  //   web3.eth.getBalance(accounts[0]).then((res) => {
  //     console.log(res)
  //   })
  // }
  // attempt to connect eagerly on mount
  useEffect(() => {
    const lsAccounts = localStorage.getItem('accounts')
    if (lsAccounts) {
      // 重新连接
      void metaMask.connectEagerly().catch(() => {
        console.debug('Failed to connect eagerly to metamask')
      })
    }
    
  }, [])
  
  const METAMASK_URL = 'https://metamask.io/';
  return (
    <>
      <Card
        installUrl={METAMASK_URL}
        connector={metaMask}
        activeChainId={CHAIN_ID}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
        accounts={accounts}
        provider={provider}
        ENSNames={ENSNames}
      />
    </>
  )
}
export const mapStateToProps = (state: any) => {
  return { web3Obj: state.web3}; // Model 层里面的 namespace
};
export default MetaMaskCard