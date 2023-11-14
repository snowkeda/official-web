import React from 'react';
import { Button, InputNumber } from 'antd'
import { MaxUint256 } from "@ethersproject/constants";
import { connect } from 'umi'
import { divided, multiply } from '@/utils/calculate'
import Decimal from 'decimal.js'
import { web3, utbContract, utbDecimal, utbAddress } from '@/utils/utbEx'
import { optionsAddress, optionsContract } from '@/utils/optionEx'
import styles from './index-pc.scss'

@connect(({wallet, chartConfig}) => ({
  wallet,
  chartConfig,
}))
class Trading extends React.Component {
  constructor(props) {
    super(props);
    const { wallet } = props
    this.state = {
      investmentNum: 1,
      approveFlag: false,
      approveAmount: 0,
      userAddress: wallet.userAddressList.length === 0 ? '' : wallet.userAddressList[0],
      callRate: 0,
      putRate: 0,
      approveLoading: false,
      isApprove: false,
      tradeLoading: false,
    }
    this.pollingMagnification = null;
  }
  componentDidMount() {
    this.getApprove(false)
    // this.getMagnification();
    // setTimeout(() => {
    //   web3.eth.net.isListening((res) => {
    //     console.log(res)
    //   })
    // }, 3000);
    if (!this.pollingMagnification) {
      this.pollingMagnification = setInterval(() => {
        this.getMagnification();
      }, 5000)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { userAddressList } = this.props.wallet;
    if (userAddressList.toString() !== prevProps.wallet.userAddressList.toString() && userAddressList.toString() !== '') {
      this.setState({
        userAddress: userAddressList[0]
      }, () => {
        this.getApprove(false)
      })
    } else if (userAddressList.toString() === '' && prevProps.wallet.userAddressList.toString() !== ''){
      this.setState({
        isApprove: false,
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollingMagnification);
  }

  // 监听输入框
  handleChange = (value, type) => {
    let finalNum = value;
    // console.log(value, 'value')
    this.setState({
        // tradeInputDisabled: !!this.checkInputValueError(finalNum),
      investmentNum: finalNum > 1000 ? 1000 : finalNum,
    }, () => {
      this.getApprove(false)
    });
    

    // log
    // let eventLog;
    // if (type === 'change') {
    //     eventLog = 'change_input';
    // } else if (type === 'add') {
    //     eventLog = 'click_input_add';
    // } else if (type === 'cut') {
    //     eventLog = 'click_input_sub';
    // }
    // this.props.store.SDK.log(eventLog, { amount: finalNum });
  }
  betCP = (type) => {
    const { userAddress, approveAmount, investmentNum } = this.state
    const { dispatch, wallet, chartConfig } = this.props
    let data = null
    const xdAmount = web3.utils.toBigInt(multiply(investmentNum, utbDecimal));
    this.setState({
      tradeLoading: true,
    })
    if (type === 'c') {
      data = optionsContract.methods.betC(
          chartConfig.assetName,
          xdAmount,         //下单量
          userAddress,
          false
      ).encodeABI()
    } else {
      data = optionsContract.methods.betP(
        chartConfig.assetName,
        xdAmount,         //下单量
        userAddress,
        false
      ).encodeABI()
    }
    console.log('betCP', investmentNum, approveAmount)
    if (data && investmentNum <= Number(approveAmount)) {
      window.connectWallet.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: userAddress,
            to: optionsAddress,
            data
          },
        ],
      }).then( async (res) => {
        console.log(`下单成功: ${res}`)
        // 下单成功
        const betCPObj = {
          price: investmentNum,
          type: type
        }
        setTimeout(() => {
          dispatch({
            type: 'wallet/getUtbBalance'
          })
        }, 1000);
        await this.getApprove(false)
        await dispatch({
          type: "trade/set",
          payload: { 
            searchSettle: true,
            betCPObj
          }
        })
        
        this.setState({
          tradeLoading: false
        })
      }).catch((err) => {
        console.log(err)
        this.setState({
          tradeLoading: false
        })
      })
    } else {
      console.log(`重新授权`)
      this.getApprove(true)
      // alert(`不能大于授权： ${approveAmount}`)
    }
    
    
  }
  // 获取交易倍率
  getMagnification = () => {
    const { chartConfig } = this.props;
    optionsContract.methods
      .currentEpoch(chartConfig.assetName)
      .call()
      .then((res) => {
        optionsContract.methods
        .getEpochRate(chartConfig.assetName, res)
        .call()
        .then((res) => {
          // 除 10000 %  callRate putRate
          const {callRate, putRate} = res
          this.setState({
            callRate, putRate
          })
        });
      });
    
  }
  // 授权
  getApprove = async (approveBtn) => {
    const { userAddress, investmentNum, approveLoading } = this.state;
    const amount = utbDecimal;
    // 是否授权
    if (userAddress) {
      utbContract.methods.allowance(userAddress, optionsAddress).call().then((res) => {
        const allowance = divided(res.toString(), utbDecimal)
        console.log(`授权金额查询：${res}, ${allowance}, ${investmentNum}`)
        if (Number(allowance) < investmentNum || res === 0n) {
          if (approveBtn) {
            this.setState({
              approveLoading: true,
            })
            window.connectWallet.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: userAddress,
                  to: utbAddress,
                  data: utbContract.methods.approve(
                    optionsAddress, //UTB合约地址
                    // web3.utils.toBigInt(Decimal(investmentNum).mul(amount).toFixed()), //授权金额
                    MaxUint256.toBigInt(), // 无限大
                  ).encodeABI(),
                },
              ],
            }).then(() => {
              this.setState({
                isApprove: true,
                approveLoading: false,
                tradeLoading: false,
                approveAmount: amount.toString()/utbDecimal
              })
              setTimeout(() => {
                this.props.dispatch({
                  type: "wallet/getUtbBalance",
                })
              }, 1000);
            }).catch(() => {
              this.setState({
                approveLoading: false,
                tradeLoading: false,
              })
            })
          } else {
            this.setState({
              isApprove: false,
            })
          }
        } else {
          this.setState({
            isApprove: true,
            approveAmount: allowance
          })
        }
      })
    } else {
      if (approveBtn) {
        const { dispatch } = this.props
        dispatch({
          type: 'wallet/setOpenWallet',
          payload: { openWallet: true }
        })
      }
      
    }
    
  }

  render() {
    const { investmentNum, callRate, putRate, isApprove, approveLoading, tradeLoading } = this.state;
    const rate = 10000;
    const intPutRate = divided(web3.utils.toNumber(putRate), 1000000, 6);
    const intCallRate = divided(web3.utils.toNumber(callRate), 1000000, 6);
    const minPrice = 1;
    const inputPoint = 0;
    
    return (
      <>
        <div className={styles['investment']}>
          <div className={styles['investment-bg']}>
            <p>Investment</p>
            <InputNumber 
              className={styles['investment-input']}
              onChange={(value) => this.handleChange(value, 'change') } 
              value={investmentNum} 
              precision={0} 
              max={1000} 
              min={1} 
              bordered={false} 
              controls={false} 
            />
            {/* <input className={styles['investment-input']} type="number" min={1} step={1} max={1000} value={investmentNum}  /> */}
            <div className={styles['add-cut']}>
              <div className={styles['add']} onClick={() => { this.handleChange((Number(investmentNum) + Number(minPrice || 1)).toFixed(inputPoint), 'add'); }}>+</div>
              <div className={styles['cut']} onClick={() => { this.handleChange((Number(investmentNum) - Number(minPrice || 1)).toFixed(inputPoint), 'cut'); }}>-</div>
            </div>
          </div>
        </div>
        {/* 看涨  */}
        <div className={`${styles['trade-block']} ${styles['green']}`}>
          <div className={styles['rate-income']}>
            <p className={styles['interest-rate']}>+{divided(web3.utils.toNumber(putRate), rate, 2)}%</p>
            <div className={styles['income']}>{investmentNum ? multiply(investmentNum, intPutRate) : 0}</div>
          </div>
          <Button loading={tradeLoading} className={styles['third-btn']} onClick={() => {this.betCP('c')}}>
            {/* <img src={} alt='HIGHER' /> */}
            HIGHER
          </Button>
          {
            !isApprove &&
            <Button loading={approveLoading} className={styles['approve-box']} onClick={() => this.getApprove(true)}>
              <div className={styles['approve-icon']} />
              <p>APPROVE</p>
            </Button>
          }
        </div>
       
        {/* 看跌 */}
        <div className={`${styles['trade-block']} ${styles['red']}`}>
          <Button className={styles['third-btn']} loading={tradeLoading} onClick={() => {this.betCP('p')}}>LOWER</Button>
          <div className={styles['rate-income']}>
            <div className={styles['income']}>{investmentNum ? multiply(investmentNum, intCallRate) : 0}</div>
            <p className={styles['interest-rate']}>+{divided(web3.utils.toNumber(callRate), rate, 2)}%</p>
          </div>
        </div>
      </>
    )
  }
}

export default Trading