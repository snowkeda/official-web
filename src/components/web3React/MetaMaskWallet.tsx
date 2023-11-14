import React, { useState, useEffect } from 'react';
import { connect } from 'umi'
import { hooks, metaMask, metaMaskStore } from '@/connectors/metaMask'
import metamaskIcon from '@/assets/img/home/metamask.png'

function MetaMaskWallet(props) {
  const { name, desiredChainId } = props
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;
  const [error, setError] = useState(undefined)
  const accounts = useAccounts()
 
  useEffect(() => {
    props.dispatch({
      type: "wallet/set",
      payload: { 
        userAddressList: accounts ? accounts : [] ,
        userAddress: accounts ? accounts[0] : '',
      },
    })
  }, [accounts])
  const switchChain = async () => {
    const flagMate = window.ethereum ? true : false;
    const METAMASK_URL = 'https://metamask.io/';
    if (!flagMate) {
      console.log(`first`)
      alert('请安装metamask')
      return false;
    }
    try {
      await metaMask.activate(desiredChainId)
      setError(undefined)
      // 调用metaMask Injected provider（供应商）
      window.connectWallet = window.ethereum;
      props.loginHandle();
    } catch (error) {
      console.error(error)
      setError(error)
    }
  }
  if (accounts) {
    console.log(accounts)
    localStorage.setItem('accounts', JSON.stringify(accounts))
    // setTimeout(() => {
    //   localStorage.removeItem('accounts')
    //   metaMask.deactivate?.()
    //   metaMask.resetState()
    //   console.log('断开')
    //   return null
    // }, 2000);
  }
  return (
    <li key={name} onClick={() => switchChain()}>
      <img src={metamaskIcon} alt={name} />
      <span>{name}</span>
    </li>
  )
}

// class MetaMaskWallet extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount(): void {
//     console.log()
//     metaMask.activate(421613).then(() => {
//       const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks
//       const accounts = useAccounts();
//       console.log(accounts)
//     })
//   }


//   render() {
//     const { name } = this.props;
//     return (
//       <li key={name}>
//         <img src={metamask} alt={name} />
//         <span>{name}</span>
//       </li>
//     );
//   }
// }

export default connect(({wallet}) => ({
  wallet
}))(MetaMaskWallet);