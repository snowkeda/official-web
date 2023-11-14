import React from 'react';
import { MaxUint256 } from "@ethersproject/constants";
import { Select, Button, Spin, Dropdown } from 'antd'
import _ from 'lodash'
import Decimal from 'decimal.js'
import { connect } from 'umi'
import { web3, utbContract, utbAddress, wethContract, oracleContractPromise, wethAddress, wethDecimal, 
  utbDecimal, usdtAddress, usdtContract, usdtAmount, usdtDecimal, usdtOracleAmount, usdtOracleDecimal,
  wethAmount, utbAmount, oracleDecimal, addTokenWatchAsset } from '@/utils/utbEx'
import SwapModal from './SwapModal';
import { divided, multiply } from '@/utils/calculate' 
import { getDecimal } from '@/utils/format'
import swapIcon from '@/assets/img/home/swap-icon.png'
import selectIcon from '@/assets/img/trade/select-icon.png'
import walletIcon from '@/assets/img/dashboard/wallet.png'
import styles from './index-pc.scss'
@connect(({wallet, global}) => ({wallet, global}))
class Swap extends React.Component {
  constructor(props) {
    super(props);
    const userAddressList = props.wallet.userAddressList
    console.log(props)
    this.state = {
      swapLoading: false,
      FEE_DIV: '', // 手续费分母
      FEE_RATE: '', // 手续费分子
      userAddress: userAddressList.length > 0 ? userAddressList[0] : '',
      balanceOpen: false,
      balance: '0', // 余额
      balanceCurrency: 'WETH',
      balanceValue: 0,
      balanceDollar: 0,
      receiveValue: 1,
      receiveOpen: false,
      receiveDollar: 0,
      receiveCurrency: 'UTB',
      balanceInputValue: '',
      receiveInputValue: '',
      utbPrice: 0,
      otherPrice: 0,
      currencyList: props.global.currencyList,
      swapModal: false,
    }
  }
  async componentDidMount () {
    const { userAddress, currencyList, balanceValue  } = this.state
    await this.getSwapFee(utbContract);
    if (userAddress) {
      this.getBalance(currencyList[balanceValue])
    }
    this.getPrice()
  }

  componentDidUpdate(prevProps, prevState) {
    const { userAddressList } = this.props.wallet;
    if (userAddressList.toString() !== prevProps.wallet.userAddressList.toString() && userAddressList.toString() !== '') {
      const { currencyList, balanceValue  } = this.state;
      this.setState({
        userAddress: userAddressList[0]
      }, () => {
        this.getApprove(false)
        this.getBalance(currencyList[balanceValue])
      })
    }
    if (prevState.balanceCurrency !== this.state.balanceCurrency || prevState.receiveCurrency !== this.state.receiveCurrency) {
      this.getPrice()
      // this.getExchangePrice(this.state.balanceCurrency)
    }
  }
  // 下拉选择
  handleCurrencySelect = (obj, selectType) => {
    const {balanceCurrency, receiveCurrency, currencyList, userAddress, balanceValue } = this.state;
    let rc = 0;
    let bc = 1;
    if (userAddress) {
      this.getBalance(currencyList[selectType === 'balance' ? obj.value : balanceValue])
    } 
    if (selectType === 'balance') {
      if (obj.label === receiveCurrency) {
        rc = currencyList.map((item) => {
          return item.label !== obj.label;
        }).indexOf(true);
      }
      // 另一个必须为 utb
      if (obj.label !== "UTB") {
        rc = 1;
      }
      this.setState({
        balanceCurrency: obj.label,
        balanceValue: obj.value,
        receiveCurrency: currencyList[rc].label,
        receiveValue: currencyList[rc].value,
        balanceOpen: !this.state.balanceOpen,
        balanceInputValue: '',
        receiveInputValue: '',
      })
    }
    if (selectType === 'receive') {
      if (obj.label === balanceCurrency) {
        bc = currencyList.map((item) => {
          return item.label !== obj.label;
        }).indexOf(true);
      }
      // 另一个必须为 utb
      if (obj.label !== "UTB") {
        bc = 1;
      }
      this.setState({
        receiveCurrency: obj.label,
        receiveValue: obj.value,
        balanceCurrency: currencyList[bc].label,
        balanceValue: currencyList[bc].value,
        receiveOpen: !this.state.receiveOpen,
        balanceInputValue: '',
        receiveInputValue: '',
      })
    }
    
  }

  handleSwitch = () => {
    const {balanceCurrency, receiveCurrency, balanceValue, receiveValue, userAddress, currencyList } = this.state;
    this.setState({
      balanceCurrency: receiveCurrency,
      balanceValue: receiveValue,
      receiveCurrency: balanceCurrency,
      receiveValue: balanceValue,
      balanceInputValue: '',
      receiveInputValue: '',
    }, () => {
      if (userAddress) {
        this.getBalance(currencyList[this.state.balanceValue])
      } 
    })
  }

  // swap select
  handleChangeSelect = (value, selectType) => {
    const { userAddress, currencyList, } = this.state
    console.log(value, userAddress)
    if (userAddress) {
      this.getBalance(currencyList[value])
    } 
  }

  handleChangeInput = (e, type) => {
    const value = e.target.value;
    this.setState({
      [`${type}InputValue`]: value
    }, () => {
      this.getExchangePrice(type)
    })
    
  }
  // 
  /* handleChangeInput = (e, type) => {
    const { otherPrice, utbPrice, currencyList, balanceValue, receiveValue } = this.state;
    const value = e.target.value;
    this.getExchangePrice(value, type)
    this.setState({
      [`${type}InputValue`]: value
    }, () => {
        this.getExchangePrice(type)
    })
  } */
  // 获取 费率
  getSwapFee = async (contract) => {
    await contract.methods
    .FEE_RATE()
    .call()
    .then((res) => {
      console.log(`FEE_RATE:${res}`)
      this.setState({
        FEE_RATE: web3.utils.toNumber(res),
      })
    });
    // swap手续费分母
    await contract.methods
      .FEE_DIV()
      .call()
      .then((res) => {
        console.log(`FEE_DIV:${res}`)
        this.setState({
          FEE_DIV: web3.utils.toNumber(res),
        })
      });
  }
  // 获取余额 
  getBalance = (option) => {
    const { userAddress } = this.state;
    if (userAddress) {
      option.contract.methods.balanceOf(userAddress).call().then((res) => {
        this.setState({
          balance: web3.utils.toNumber(res.toString()/option.decimal),
        })
      });
    }
    
  }
  // 7277270165955755313947
  // utb => 其他币
  getPrice = () => {
    // 汇率 lpAmount 10^18
    const { balanceValue, receiveValue, currencyList } = this.state;
    if (balanceValue !== receiveValue) {
      if (currencyList[balanceValue].label === 'UTB') {
        // utb => 其他币
        this.getOtherPrice(currencyList[receiveValue])
      // } else {
        // 其他币 => utb
        this.getUtbPrice(currencyList[receiveValue])
      } else {
        this.getOtherPrice(currencyList[balanceValue])
        this.getUtbPrice(currencyList[balanceValue])
      }
    }
  }
  // Price 其他币 => utb
  getUtbPrice = (options) => {
    return this.props.dispatch({
      type: 'wallet/getUtbPrice',
      payload: { options }
    }).then((res) => {
      console.log(res, 'getUtbPrice')
      this.setState({
        utbPrice: res
      })
    })
    // return utbContract.methods  
    // .calcAddLiquidity(options.address, web3.utils.toBigInt(options.decimal))
    // .call()
    // .then((res) => {
    //   console.log(res)
    //   const { lpAmount } = res;
    //   this.setState({
    //     utbPrice: divided(web3.utils.toBigInt(lpAmount).toString(), utbDecimal, 6)
    //   })
    // });
  }
  // Price utb => 其他币 
  getOtherPrice = (options) => {
    return this.props.dispatch({
      type: 'wallet/getOtherPrice',
      payload: { options }
    }).then((res) => {
      console.log(res, 'getOtherPrice')
      this.setState({
        otherPrice: res
      })
    })
   /*  return utbContract.methods  
      .calcRemoveLiquidity(options.address, web3.utils.toBigInt(utbDecimal))
      .call()
      .then((res) => {
        console.log(res)
        const { outAmountAfterFee } = res;
        this.setState({
          otherPrice: divided(outAmountAfterFee.toString(), options.decimal, 6)
        })
      }) */
  }
  // input 获取兑换价格
  getExchangePrice = _.debounce((type) => {
    // this.getUtbPrice(currencyList[balanceValue])
    const { otherPrice, utbPrice, currencyList, balanceValue, receiveValue, balanceInputValue, receiveInputValue  } = this.state;
    const value = type === 'balance' ?  balanceInputValue : receiveInputValue;
    if (type === 'balance') {
      // console.log(price, currencyList[balanceValue].decimal)
      if (currencyList[balanceValue].label === 'UTB') {
        this.setState({
          receiveInputValue: balanceValue === receiveValue ? balanceInputValue : multiply(otherPrice, value, 6)
        })
      } else {
        // await this.getUtbPrice(currencyList[balanceValue])
        this.setState({
          receiveInputValue: balanceValue === receiveValue ? balanceInputValue : multiply(utbPrice, value, 6)
        })
      }
    } else {
      if (currencyList[receiveValue].label === 'UTB') {
        console.log(otherPrice * value )
        this.setState({
          balanceInputValue: balanceValue === receiveValue ? receiveInputValue : multiply(otherPrice, value, 6)
        })
      } else {
        console.log(utbPrice, value)
        this.setState({
          balanceInputValue: balanceValue === receiveValue ? receiveInputValue : multiply(utbPrice, value, 6)
        })
      }
    }
  }, 500)
  // 授权
  getApprove = async (toAddress, contract, amount) => {
    const { userAddress, currencyList, balanceValue, balanceInputValue } = this.state;
    // 授权额度查询
        // utbContract.methods
    //   .isListed(toAddress)
    //   .call()
    //   .then((res) => console.log(res));
    const allowance = await currencyList[balanceValue].contract.methods.allowance(userAddress, utbAddress).call().then((res) => {
      const  allowance = Decimal.div(res.toString(), currencyList[balanceValue].decimal).toFixed();
      console.log(`allowance： ${allowance}`)
      return allowance
    })
    if (allowance < balanceInputValue || Number(allowance) === 0) {
      return window.connectWallet
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: userAddress,
            to: toAddress,
            data:
            contract.methods.approve(
                utbAddress,//UTB合约地址
                // amount//授权金额
                MaxUint256.toBigInt(), // 无限大
            ).encodeABI(),
          },
        ],
      })
    } 
    return true
  }
  // 转换 其他币 =》 usb
  goSwap = async (startAddress, startContract, startAmount) => {
    console.log('goSwap')
    const { userAddress, receiveValue, currencyList} = this.state;
    
    return await this.getApprove(startAddress, startContract, startAmount).then((txHash) => {
      console.log(this.getMinimumRecaived())
      console.log(`goSwap: ${Decimal(this.getMinimumRecaived()).mul(currencyList[receiveValue].decimal).toFixed() }`)
      const bgIt = web3.utils.toBigInt(Decimal(this.getMinimumRecaived()).mul(currencyList[receiveValue].decimal).toFixed(0))
      
      return window.connectWallet
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: userAddress,
            to: utbAddress,
            data: utbContract.methods.addLiquidity(
              startAddress,
              startAmount,
              // this.getMinimumRecaived(),
              bgIt,
              userAddress 
            ).encodeABI(),
          },
        ],
      }).then((res) => {
        console.log(`goSwap: ${res}`)
        this.setState({
          swapLoading: false,
        });
        return res
      }).catch((err) => {
        console.log(err)
        this.setState({
          swapLoading: false,
        });
      })
    }).catch(() => {
      this.setState({
        swapLoading: false,
      });
    })
  }
  // 转换 utb 转其他币
  goUsbSwap = async (address, amount) => {
    console.log('goUsbSwap')
    const { userAddress, receiveValue, currencyList} = this.state;
    return await this.getApprove(utbAddress, utbContract, amount).then((txHash) => {
      console.log(`goUsbSwap: ${this.getMinimumRecaived()}`)
      console.log(`goUsbSwap: ${Decimal(this.getMinimumRecaived()).mul(currencyList[receiveValue].decimal).toFixed() }`)
      const bgIt = web3.utils.toBigInt(Decimal(this.getMinimumRecaived()).mul(currencyList[receiveValue].decimal).toFixed(0))
      console.log(bgIt)
      return window.connectWallet
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: userAddress,
            to: utbAddress,
            // gas: '0x7530', // 30400
            // gasPrice: '0x9184e72a000', // 100000 0000 0000
            data: utbContract.methods.removeLiquidity(
              address,
              amount,
              // this.getMinimumRecaived(),
              bgIt,
              userAddress 
            ).encodeABI(),
          },
        ],
      }).then((res) => {
        console.log(`goUsbSwap: ${res}`)
        this.setState({
          swapLoading: false,
        });
        return res
      }).catch((err) => {
        this.setState({
          swapLoading: false,
        });
      })
    }).catch((err) => {
      console.log(err)
      this.setState({
        swapLoading: false,
      });
    })
  }
  handleSwapModal = async () => {
    const { dispatch, wallet } = this.props
    const { balanceCurrency, receiveInputValue, otherPrice, balanceInputValue, utbPrice, balanceValue, receiveValue, currencyList } = this.state;
    // 获取 $
    console.log(this.state)
    oracleContractPromise.then((res) => {
      // 例 eth 兑换币在右 false  左 true
      const typeFlag = balanceCurrency === 'UTB' ? false : true
      const option = typeFlag ? currencyList[balanceValue] : currencyList[receiveValue]
      console.log(option)
      res.methods.getPrice(option.address, typeFlag).call().then((res) => {
        const oracleD = option.label === 'USDT' ? usdtOracleDecimal : oracleDecimal
        const unit = divided(res.toString(), oracleD);
        if (!typeFlag) {
          const bd = new Decimal(balanceInputValue).mul(otherPrice)
          this.setState({
            receiveDollar: multiply(unit, receiveInputValue, 6),
            balanceDollar: multiply(bd, unit, 6)
          })
        } else {
          const ud = new Decimal(receiveInputValue).div(utbPrice)
          this.setState({
            balanceDollar: multiply(unit, balanceInputValue, 6),
            receiveDollar: multiply(unit, ud, 6),
          })
        }
      })
    })
    
    if (wallet.userAddressList.length === 0) {
      dispatch({
        type: 'wallet/setOpenWallet',
        payload: { openWallet: true }
      })
    } else {
      this.setState({
        swapModal: !this.state.swapModal,
      })
    }
    // 
  }
  // 转换货币
  onClose = async () => {
    await this.setState({
      swapModal: false
    })
  }

  onConfirm = async () => {
    const {balanceValue, receiveValue, currencyList, balanceInputValue, swapModal} = this.state;
    if (balanceValue !== receiveValue && balanceValue === 1 || receiveValue === 1) {
      this.setState({
        swapLoading: true
      })
      if (balanceValue === 1) {
       return await this.goUsbSwap(
          currencyList[receiveValue].address, 
          web3.utils.toBigInt(Decimal(balanceInputValue).mul(currencyList[balanceValue].decimal).toFixed())
        )
        // 1000000000000000000
      } else {
        return await this.goSwap(
          currencyList[balanceValue].address, 
          currencyList[balanceValue].contract, 
          web3.utils.toBigInt(Decimal(balanceInputValue).mul(currencyList[balanceValue].decimal).toFixed())
        )
      }
    } else {
      alert("no swap")
    }
    setTimeout(() => {
      this.props.dispatch({
        type: 'wallet/getUtbBalance'
      })
    }, 1500);
  }
  // 滑点
  getMinimumRecaived = () => {
    const { FEE_DIV, FEE_RATE, balanceCurrency, 
      utbPrice, otherPrice, balanceInputValue, 
    } = this.state;
    const feeSwap = divided(FEE_RATE, FEE_DIV, 6)
    const cardinality = new Decimal(balanceCurrency === 'UTB' ? otherPrice : utbPrice).mul(balanceInputValue || 1)
    
    return new Decimal(cardinality).mul(1 - feeSwap).toFixed(6)
  }
  // 添加 add assets
  handleAddWallet = async () => {
    console.log(this.state)
    const { balanceValue, currencyList } = this.state;
    const { address, decimalNum, label} = currencyList[balanceValue];
    const res = await addTokenWatchAsset(address, label, decimalNum);
  }

  render() {
    const { FEE_DIV, FEE_RATE, swapLoading, balanceOpen,
      currencyList, balanceValue, receiveValue, balance, 
      utbPrice, otherPrice, balanceInputValue, receiveInputValue,
      balanceCurrency, receiveCurrency, receiveOpen, swapModal,
    } = this.state;
    const Fee = web3.utils.toNumber((FEE_RATE / FEE_DIV) * 100);
    const feeSwap = divided(FEE_RATE, FEE_DIV, 6)
    const balanceSelect = currencyList.find((item) => {
      return item.label === balanceCurrency
    })
    const receiveSelect = currencyList.find((item) => {
      return item.label === receiveCurrency
    })
    const minRecaived = this.getMinimumRecaived()
    return (
      <>
        <div className={styles['balance-receive']}>
          <p className={styles['text']}>Balance: {getDecimal(balance, 6)}</p>
          <div className={styles['add-assets']} onClick={this.handleAddWallet}>
            <img src={walletIcon} />
            <p className={styles['text']}>Add {currencyList[balanceValue].label}</p>
          </div>
          <div className={styles['select-input']}>
            <div className={styles['swap-select']}>
              <Dropdown
                className={styles['swap-dropdown']}
                trigger={['click']}
                open={balanceOpen}
                onOpenChange={(open) => {this.setState({ balanceOpen: open})}}
                menu={{
                  items: currencyList,
                  defaultSelectedKeys: ['0'],
                }}
                dropdownRender={(menus) => {
                  const { items } = menus.props;
                  console.log(items)
                  return <div className={styles['currency-box']}>
                    {
                      items.map((item) => {
                        return (
                          <div className={styles['currency-select']} key={item.key} onClick={() => {this.handleCurrencySelect(item, 'balance')}}>
                            <img src={item.icon} />
                            <div className={styles['name']}>
                              <span>{item.label}</span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                }}
              >
                <div className={styles['currency-select']}>
                    <img src={balanceSelect.icon} />
                    <div className={styles['name']}>
                      <span>{balanceSelect.label}</span>
                      <img src={selectIcon} />
                    </div>
                  </div>
              </Dropdown>
            </div>
            <input className={styles['swap-input']} type="number" onWheel={(e) => e.target.blur()} value={balanceInputValue} onChange={(e) => this.handleChangeInput(e, 'balance')} />
          </div>
          <div className={styles['swap-icon']} onClick={this.handleSwitch}>
            <img src={swapIcon} alt='' />
          </div>
        </div>
        <div className={styles['balance-receive']}>
        {/* Receive: {multiply(otherPrice, balance)} */}
          <p className={styles['text']}></p>
          <div className={styles['select-input']}>
            <div className={styles['swap-select']}>
              <Dropdown
                className={styles['swap-dropdown']}
                trigger={['click']}
                open={receiveOpen}
                onOpenChange={(open) => {this.setState({ receiveOpen: open})}}
                menu={{
                  items: currencyList,
                  defaultSelectedKeys: ['0'],
                }}
                dropdownRender={(menus) => {
                  const { items } = menus.props;
                  return <div className={styles['currency-box']}>
                    {
                      items.map((item) => {
                        return (
                          <div className={styles['currency-select']} key={item.key} onClick={() => {this.handleCurrencySelect(item, 'receive')}}>
                            <img src={item.icon} />
                            <div className={styles['name']}>
                              <span>{item.label}</span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                }}
              >
                <div className={styles['currency-select']}>
                  {
                    receiveSelect ? <>
                      <img src={receiveSelect.icon} />
                      <div className={styles['name']}>
                        <span>{receiveSelect.label}</span>
                        <img src={selectIcon} />
                      </div>
                    </> : ''
                  }
                </div>
              </Dropdown>
            </div>
            <input className={styles['swap-input']} type="number" value={receiveInputValue} 
              onChange={(e) => this.handleChangeInput(e, 'receive')} />
          </div>
        </div>
        <div className={styles['gather-box']}>
          <div className={styles['p-box']}>
            <p>Price</p>
            <p>
              1 {currencyList[balanceValue].label}=
              {balanceValue === receiveValue ? 1 : (currencyList[balanceValue].label === "UTB" ? otherPrice : utbPrice)}  
              {currencyList[receiveValue].label}
            </p>
          </div>
          {/* <p>Available Liquidty</p>
          <p>100,000,000,000 UTB</p> */}
          <div className={styles['p-box']}>
            <p>Swap Fee</p>
            <p>{Fee}%</p>
          </div>
          <div className={styles['p-box']}>
            <p>Minimum Recaived</p>
            <p>{minRecaived} {receiveCurrency}</p>
          </div>
          {/* <p>Slippage</p> */}
          <Button type='default' className={styles['swap-btn']} disabled={balanceInputValue == ''} onClick={() => this.handleSwapModal()}>swap</Button>
        </div>
        <SwapModal data={{...this.state, feeSwap, Fee, minRecaived}} onClose={this.handleSwapModal} onConfirm={this.onConfirm} />
      </>
    );
  }
}

export default Swap