import React, { useEffect,  useState, useCallback, useMemo, memo } from "react";
import { CHAINS } from "@/utils/chains"
import { Modal, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import successIcon from '@/assets/img/home/success.png'
import shareIcon from '@/assets/img/home/share.png'
import clockIcon from '@/assets/img/home/clock.png'
import swapIcon from '@/assets/img/home/swap.png'
import styles from './index-pc.scss'

const SwapModal = (props) => {
  const ProgressBar = require('progressbar.js');
  const [waitConfim, setWaitConfim ] = useState(false)
  const [successTran, setSuccessTran ] = useState(false)
  const [orderHash, setOrderHash ] = useState('')
  const { 
    swapModal, balanceCurrency, balanceInputValue, receiveCurrency, balanceValue,
    receiveInputValue, otherPrice, feeSwap, Fee, currencyList, swapLoading,
    minRecaived, receiveValue, utbPrice, balanceDollar, receiveDollar
  } = props.data;
  const handleModalVisible = (str) => {
    if (str === 'wait') {
      setWaitConfim(false);
    }
    if (str === 'success') {
      setSuccessTran(false);
    }
  } 
  const confirm = async () => {
   const con = await props.onConfirm();
   console.log(`confirm: ${con}`)
   if (con) {
     setOrderHash(con)
    await props.onClose();
    setWaitConfim(true)
    setTimeout(() => {
      const bar = new ProgressBar.Path('#fangkuai', {
        easing: 'easeInOut',
        duration: 3500
      });
      bar.set(0);
      bar.animate(1);
    });
    setTimeout(() => {
      setWaitConfim(false);
      setSuccessTran(true);
    }, 3000);
   }
    
  }
  let bIcon, rIcon;
  currencyList.map((item) => {
    if (item.label === balanceCurrency) {
      bIcon = item.icon
    }
    if (item.label === receiveCurrency) {
      rIcon = item.icon
    }
  })
  return (
    <>
      <Modal
        closeIcon={null}
        open={swapModal}
        footer={null}
        width={620}
        className={styles['swap-modal']}
      >
        <div className={styles['content']}>
          <div className={styles['title']}>
            <span>Swap {balanceCurrency} to {receiveCurrency} </span>
            <CloseOutlined onClick={() => props.onClose()} />
          </div>
          <div className={styles['details']}>
            <ul className={styles['currency-swap']}>
              <li>
                <div className={styles['currency-text']}>
                  <img src={bIcon} alt={balanceCurrency} />
                  <span>{balanceCurrency}</span>
                </div>
                <p>{balanceInputValue}</p>
                <p>${balanceDollar}</p>
              </li>
              <li>
                <div className={styles['currency-text']}>
                  <img src={rIcon} alt={receiveCurrency} />
                  <span>{receiveCurrency}</span>
                </div>
                <p className={styles['green']}>{receiveInputValue}</p>
                <p>${receiveDollar}</p>
              </li>
            </ul>
            <ul className={styles['swap-desc']}>
              <li>
                <span>Price</span>
                <div>1 <span>{balanceCurrency}</span> = {balanceValue === receiveValue ? 1 : (currencyList[balanceValue].label === "UTB" ? otherPrice : utbPrice)}  <span>{receiveCurrency}</span><img src={swapIcon} /></div>
              </li>
              <li>
                <span>Minimun Received</span>
                <div>{minRecaived}  <span>{receiveCurrency}</span></div>
              </li>
              <li>
                <span>Swap Fee</span>
                <div>{Fee}%</div>
              </li>
              {/* <li>
                <span>Execution Fee</span>
                <div>0.001500 <span>USDC</span></div>
              </li> */}
            </ul>
            <Button className={styles['confirm']} loading={swapLoading} onClick={confirm}>CONFIRM</Button>
          </div>
        </div>
      </Modal>
      {/* waiting */}
      <Modal
        closeIcon={null}
        open={waitConfim}
        // open={true}
        footer={null}
        width={480}
        className={styles['waiting-confim']}
      >
        <div className={styles['title']}><CloseOutlined onClick={() => handleModalVisible('wait')} /></div>
        <div className={styles['content']}>
          <div className={styles['wait-svg']}>
            <svg width="90" height="90" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0277F2"></stop>
                  <stop offset="100%" stop-color="#03F8DF"></stop>
                </linearGradient>
              </defs>
              <rect x="1" y="1" rx="10" ry="10" width="88" height="88" stroke="rgba(1, 249, 223, 0.10)" fill="transparent" stroke-width="1"/>
              <rect id="fangkuai" x="2" y="2" rx="10" ry="10" width="86" height="86" stroke="url('#grad1')" fill="transparent" stroke-width="2"/>
            </svg>
            <img src={clockIcon}  />
          </div>
          <div className={styles['desc']}>
            <h2>Waiting for confimation</h2>
            <p>Creating order to swap {balanceInputValue} {balanceCurrency} for {receiveInputValue} {receiveCurrency} (price 1 {balanceCurrency} ≥ {otherPrice} {receiveCurrency})</p>
          </div>
        </div>
      </Modal>
      {/* success */}
      <Modal
        closeIcon={null}
        open={successTran}
        footer={null}
        width={480}
        className={styles['success-transaction']}
      >
        <div className={styles['title']}><CloseOutlined onClick={() => handleModalVisible('success')} /></div>
        <div className={styles['content']}>
          <img src={successIcon}  />
          <div className={styles['desc']}>
            <h2>TRANSACTION COMPLETE</h2>
            <p>Order created to swap {balanceInputValue} {balanceCurrency} for {receiveInputValue} {receiveCurrency} (price 1 {balanceCurrency} ≥ {otherPrice} {receiveCurrency})</p>
            <a target="_blank" href={`${CHAINS[CHAIN_ID].blockExplorerUrls[0]}/tx/${orderHash}`} className={styles['share-btn']}>
              <img src={shareIcon} />
              <span>View On Arbiscan</span>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SwapModal;