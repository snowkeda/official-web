import { Link, Outlet, connect } from 'umi';
import { useEffect, useState } from 'react';

import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { coinbaseWallet, hooks as coinbaseWalletHooks } from '@/connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '@/connectors/metaMask'
import { hooks as networkHooks, network } from '@/connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '@/connectors/walletConnect'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from '@/connectors/walletConnectV2'
import MetaMaskCard from '@/components/web3React/connectorCards/MetaMaskCard'

// import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

import { getName } from '@/utils/walletUtils'
import SDK from '@/fetch/sdk';
import WsStore from '@/services/WsStore';

import '@/assets/iconfont/iconfont';
import '@/assets/iconfont/iconfont-pc.scss';
import '@/global-pc.scss';
import { error } from 'highcharts';
import moment from "moment";
// 时间语言
moment.locale('en');

const connectors: [MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  // [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]

function Child() {
  const { connector } = useWeb3React();
  console.info(`Priority Connector is: ${getName(connector)}`)
  return null
}

// export default function ProviderExample() {
//   return (
//     <Web3ReactProvider connectors={connectors}>
//       <Child />
//     </Web3ReactProvider>
//   )
// }
// const initialState = {
//   appName: 'web3React'
// }
function Layout(props: any) {
  window.t = (str: string) => {
    return str
  }
  // const client = new ApolloClient({
  //   uri: 'https://api.thegraph.com/subgraphs/name/bgcmdev/binax',
  //   cache: new InMemoryCache(),
  // });
  // const getgql = gql`
  // query($orderBy: BigInt, $orderDirection: String) {
  //   betCs(where: {user: "0x1Fd71Bb2021e784E72315F9093539b3547695FDb", status: "settled"}, orderBy: $orderBy, orderDirection: $orderDirection) {
  //     amount
  //     epoch
  //     blockNumber
  //     placePrice
  //     pnl
  //     rate
  //     settledPrice
  //     symbol
  //     status
  //     transactionHash
  //     user
  //   }
  //   betPs(where: {user: "0x1Fd71Bb2021e784E72315F9093539b3547695FDb", status: "settled"} , orderBy: $orderBy, orderDirection: $orderDirection) {
  //     amount
  //     epoch
  //     blockNumber
  //     placePrice
  //     pnl
  //     rate
  //     settledPrice
  //     symbol
  //     status
  //     transactionHash
  //     user
  //   }
  // }`
  // client.query({
  //   query: getgql,
  //   variables: {
  //     orderBy: 'blockNumber',
  //     orderDirection: 'desc',
  //   }
  // }).then(res => {
  //   console.log(res)
  // }).catch((error) => {
  //   console.log(error)
  // })\
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
      {/* <div className={styles.navs}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/docs">Docs</Link>
          </li>
        </ul>
      </div> */}
      {/* <MetaMaskCard /> */}
      <div className='out-let'>
        <Outlet />
      </div>
    </Web3ReactProvider>
    
  );
}
export default Layout
