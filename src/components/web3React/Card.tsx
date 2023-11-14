import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { connect } from 'umi'
import Web3 from 'web3';

import { useCallback, useEffect, useState } from 'react'

import { CHAINS, getAddChainParameters } from '@/utils/chains'
import hexer from '@/utils/hexer'
import { getName } from '@/utils/walletUtils'
import { Accounts } from './Accounts'
import { Chain } from './Chain'
import { ConnectWithSelect } from './ConnectWithSelect'
import { Status } from './Status'
import styles from './index.scss'

interface Props {
  installUrl: string | undefined
  connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  // setError: React.Dispatch<React.SetStateAction<undefined>>
  // setError: any | (error: Error | undefined) => void
  setError: any
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accounts?: string[]
}

function ChainSelect({
  activeChainId,
  switchChain,
  chainIds = Object.keys(CHAINS).map(Number),
}: {
  activeChainId: number
  switchChain: (chainId: number) => void
  chainIds: number[]
}) {
  return (
    <select
      value={activeChainId}
      onChange={(event) => {
        switchChain(Number(event.target.value))
      }}
      disabled={switchChain === undefined}
    >
      <option hidden disabled selected={activeChainId === undefined}>
        Select chain
      </option>
      <option value={-1} selected={activeChainId === -1}>
        Default
      </option>
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId} selected={chainId === activeChainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  )
}


function Card(props: Props) {
  const {
    installUrl,
    connector,
    activeChainId,
    chainIds,
    isActivating,
    isActive,
    error,
    setError,
    ENSNames,
    accounts,
    provider,
  }  = props
  const [desiredChainId, setDesiredChainId] = useState<number>(undefined)
  try {
  // 请求用户授权
    // window.ethereum.enable().then((res) => {
    //   console.log(res)
    // });
  } catch (error) {
  // 用户不授权时
      console.error("User denied account access")
  }
  useEffect(() => {
    props.dispatch({
      type: "wallet/set",
      payload: { userAddressList: accounts ? accounts : [] },
    })
  }, [accounts])
  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId)
    }
  }, [desiredChainId, activeChainId])

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId)
      try {
        if (
          // If we're already connected to the desired chain, return
          desiredChainId === activeChainId ||
          // If they want to connect to the default chain and we're already connected, return
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          await connector.activate(desiredChainId)
          console.log('go')
          setError(undefined)
          return
        }
        console.log(connector instanceof GnosisSafe)
        if (desiredChainId === -1 || connector instanceof GnosisSafe) {
          console.log(-1)
          await connector.activate()
        } else if (
          connector instanceof WalletConnectV2 ||
          connector instanceof WalletConnect ||
          connector instanceof Network
        ) {
          await connector.activate(desiredChainId)
        } else {
          console.log('4')
          await connector.activate(getAddChainParameters(desiredChainId))
        }

        setError(undefined)
      } catch (error) {
        setError(error)
      }
    },
    [connector, activeChainId, setError]
  )
  if (accounts) {
    console.log(accounts)
    localStorage.setItem('accounts', JSON.stringify(accounts))
  }
  const handleBtn = () => {
    if (connector instanceof GnosisSafe) {
      connector.activate().then((res) => {
        setError(undefined)
      }).catch(setError)
    } else {
      switchChain(desiredChainId)
    }
  }
  // 断开
  const handleDisconnect = async () => {
    // if (connector?.deactivate) {
    //   connector.deactivate()
    // } else {
    //   connector.resetState()
    // }
    // setDesiredChainId(undefined)
    localStorage.removeItem('accounts')
    connector.deactivate?.()
    connector.resetState()
    return null
    // console.log(window.ethereum.isConnected())
  }
  // const web3 = new Web3('https://goerli-rollup.arbitrum.io/rpc');
  const handlePermissions = () => {
    if (accounts) {
      window.ethereum.request({ 
        method: 'wallet_requestPermissions', 
        params: [
          {
            "eth_accounts": {}
          }
        ]
      }).then((res) => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      }) 
    }
  }
  const handleSign = () => {
    if (accounts) {
      console.log(hexer('helw'))
      console.log(accounts[0])
      window.ethereum.request({ 
        method: 'personal_sign', 
        params: [accounts[0], hexer('helw')]
      }).then((res) => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      }) 
    }
  }
  const flagMate = window.ethereum ? true : false;
  return (
    <div className={styles['card-box']}>
      {/* <div>{getName(connector)}</div>
      {
        flagMate ? '' : <a href={installUrl} target='_blank' >MetaMask not Installed</a>
      }
      <div style={{ marginBottom: '1rem' }}>
        <Status isActivating={isActivating} isActive={isActive} error={error} />
      </div> */}
      {/* <Chain chainId={activeChainId} /> */}
      {/* <div style={{ marginBottom: '1rem' }}>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div> */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* {!(connector instanceof GnosisSafe) && (
          <ChainSelect activeChainId={desiredChainId} switchChain={switchChain} chainIds={chainIds} />
        )} */}
        {isActive ? (
          error ? (
            <button onClick={() => switchChain(desiredChainId)}>Try again?</button>
          ) : (
            <button
              onClick={handleDisconnect}
            >
              断开
            </button>
          )
        ) : (
          <button
            onClick={handleBtn}
            disabled={isActivating || !desiredChainId}
          >
            {error ? 'Try again?' : '登录'}
          </button>
        )}
      </div>
      {/* {
        accounts?.length > 0 ? <>
          <button onClick={handlePermissions}>权限请求</button>
          <button onClick={handleSign}>签名</button>
        </> : ''
      } */}
      
      {/* <ConnectWithSelect
        installUrl={installUrl}
        connector={connector}
        activeChainId={activeChainId}
        chainIds={chainIds}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
      /> */}
    </div>
  )
}

export default connect(({wallet}) => ({
  wallet
}))(Card)
