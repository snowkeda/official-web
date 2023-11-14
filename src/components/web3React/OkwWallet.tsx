import { useState, useEffect } from 'react';
import { connect } from 'umi'
import OkxIcon from '@/assets/img/home/OKX.png'

function OkwWallet(props) {
  const { name, desiredChainId } = props
  const getAccounts = async () => {
    const flagMate = window.ethereum ? true : false;
    if (typeof window.okxwallet === 'undefined') {
      window.open('https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge', '_blank');
      return false;
    }
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log(chainId)
   /*  window.ethereum.on('chainChanged', handleChainChanged(DESIRED_CHAINID));

    function handleChainChanged(chainId) {
      console.log(chainId)
      // We recommend reloading the page, unless you must do otherwise.
      // window.location.reload();
    } */
    // 切链
    if (chainId !== DESIRED_CHAINID) {
      await window.okxwallet.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: DESIRED_CHAINID }]
      });
    }
    await window.okxwallet.request({ method: 'eth_requestAccounts' }).then((res) => {
      console.log(res)
      // 调用okxwallet Injected provider（供应商）
      props.dispatch({
        type: "wallet/set",
        payload: { 
          userAddressList: res ? res : [],
          userAddress: res ? res[0] : '',
        },
      })
      window.connectWallet = window.okxwallet;
      props.loginHandle();
    }).catch((err) => {
      console.log(err)
    });
    // setTimeout( async () => {
    //   try {
    //     await okxwallet.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: '0xf00' }],
    //     });
    //   } catch (switchError) {
    //     // This error code indicates that the chain has not been added to OKX.
    //     if (switchError.code === 4902) {
    //       try {
    //         await okxwallet.request({
    //           method: 'wallet_addEthereumChain',
    //           params: [
    //             {
    //               chainId: '0xf00',
    //               chainName: '...',
    //               rpcUrls: ['https://...'] /* ... */,
    //             },
    //           ],
    //         });
    //       } catch (addError) {
    //         // handle "add" error
    //       }
    //     }
    //     // handle other "switch" errors
    //   }
    // }, 3000);
    // try {
    //   await metaMask.activate(desiredChainId)
    //   setError(undefined)
    //   props.loginHandle();
    // } catch (error) {
    //   setError(error)
    // }
  }
  return (
    <li onClick={() => getAccounts()}>
      <img src={OkxIcon} alt='OKX' />
      <span>OKX</span>
    </li>
  )
}

export default connect(({wallet}) => ({
  wallet
}))(OkwWallet);