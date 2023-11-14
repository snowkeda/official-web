import React from 'react';
import apis from '@/fetch';
import { Dropdown } from 'antd';
import { multiply, divided } from '@/utils/calculate'
import { numFormat } from '@/utils/format'
import { getSpotList } from '@/fetch/apis';
import { connect } from 'umi';
import imgLogo from '@/assets/img/minifi-white.png';
import wti from '@/assets/img/wti.png';
import xau from '@/assets/img/xau.png';
import btcIcon from '@/assets/img/trade/btc-icon.png'
import ethIcon from '@/assets/img/trade/eth-icon.png'
import { getRealUrl } from '@/assets/js/common';
import styles from './index-pc.scss';


export default class CurrencyTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexTab: 0,
      priceIcon: '',
      dropdownOpen: false,
      assetsList: [
        { label: 'BTC', key: 0, name: 'BTC/USD', assetName: 'BTC', icon: btcIcon, index: 0, price: 0, dayChangeRate: 0},
        { label: 'ETH', key: 1, name: 'ETH/USD', assetName: 'ETH', icon: ethIcon, index: 1, price: 0, dayChangeRate: 0},
      ],
    };
  }
  componentDidMount() {
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
    const { wsData } = this.props;
    if (prevProps.wsData.ws1 !== undefined && wsData.ws1 !== undefined && prevProps.wsData.ws1.price !== wsData.ws1.price) {
      this.setState({
        priceIcon: wsData.ws1.price > prevProps.wsData.ws1.price ? 'green' : 'red',
      })
    }
  }

  openChange = (open) => {
    if (open) {
      this.getDayPrice()
    }
    this.setState({ dropdownOpen: open})
    console.log(open)
  }
  // 获取全局配置
  getConfig = async () => {
    const res = await apis.getConfig();
    if (res.code === 0 && res.data && res.data.assets) {
      const { assets = [], currencyList = [] } = res.data;
      const { setAsset, setConfig, setOptionType } = this.props.store;
      const { coinMap, setCoinMap } = this.props.store.coinStore;
      assets.forEach((one, i) => {
        assets[i].index = i + 1;
        assets[i].assetCode = assets[i].id; // TODO 临时
        if (one.name.indexOf('XAU') >= 0) {
          assets[i].IconImg = xau;
        }
        if (one.name.indexOf('WTI') >= 0) {
          assets[i].IconImg = wti;
        }
      });
      // 屏蔽Gamma玩法
      const assetsList = assets.filter(item => item.optionName !== 'Gamma');
      this.setState({ assetsList });
      setAsset(assets[0]);
      setOptionType(assets[0].optionType); // TODO
      setConfig(res.data);

      // 处理币种数据
      currencyList.forEach((one) => {
        coinMap[one.name] = one;
      });
      setCoinMap(coinMap);
    }
  }
  // 切换币种
  chooseTab = (item) => {
    const { index, assetName } = item;
    this.setState({
      indexTab: index,
      dropdownOpen: false
    })
    this.props.setAssetName(item)
  }
 /*  chooseTab = ({ index, optionType, name, optionName }) => {
    const { setAsset, setOptionType } = this.props.store;
    this.setState({ indexTab: index });
    const asset = this.state.assetsList[+index - 1]; // TODO
    setAsset(asset);
    setOptionType(optionType);

    // log
    const eventData = `${name}_${optionName}`.toLowerCase();
    this.props.store.SDK.log('click', eventData);
    this.props.store.SDK.log('click_asset', { asset: asset.id, optionType });
  } */
  getDayChange = (dayChange) => {
    const str = dayChange.toString()
    const dayChangeArr = str.split('-');
    return dayChangeArr.length === 2 ? `-$${dayChangeArr[1]}` : dayChange;
  }

  getDayPrice = async () => {
    const res = await getSpotList();
    const { assetsList } = this.state;
    if (res.code === 0) {
      assetsList.map((item) => {
        res.data.map((n) => {
          if (item.assetName === n.currency) {
            item.price = n.price;
            item.dayChangeRate = n.dayChangeRate;
          }
        })
      })
      console.log(assetsList)
      
    }
  }

  render() {
    // const { logo } = this.props.store.SDK.config;
    const { assetsList, indexTab, dropdownOpen, priceIcon } = this.state;
    const { ws1 } = this.props.wsData;
    return (
      <div className={styles['currency-tab']}>
        <div className={styles['currency-tab-items']}>
        {/* ${styles['active']} */}
          <Dropdown
            className={`${styles['currency-dropdown']} ${dropdownOpen ? styles['open'] : ''}`}
            trigger={['click']}
            open={dropdownOpen}
            onOpenChange={this.openChange}
            menu={{
              items: assetsList,
              defaultSelectedKeys: ['0'],
            }}
            dropdownRender={(menus) => {
              const { items } = menus.props;
              return <div className={styles['currency-dropdown-box']}>
                <table>
                  <thead>
                    <tr>
                      <th className={styles['pair']}>Pair</th>
                      <th>Last Price</th>
                      <th className={styles['th-hc']}>24h Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items.map((item) => {
                        return (
                          <tr key={item.key} onClick={() => { this.chooseTab(item) }}>
                            <td>
                              <div className={styles['icon-name']}>
                                <img src={item.icon} />
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td>${item.price}</td>
                            <td className={`${styles['td-hc']} ${item.dayChangeRate < 0 ? styles['red'] : styles['greed']}`}>{multiply(item.dayChangeRate, 100)}%</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                {/* {
                  items.map((item) => {
                    return (
                      <div className={styles['currency-select']} key={item.key} >
                        <img src={item.icon} />
                        <div className={styles['name']}>
                          <span>{item.label}</span>
                        </div>
                      </div>
                    )
                  })
                } */}
              </div>
            }}
          >
            <div className={styles['currency-select']}>
              <img src={assetsList[indexTab].icon} alt={assetsList[indexTab].name} />
              <span>{assetsList[indexTab].name}</span>
            </div>
          </Dropdown>
        {/* {
          assetsList.map((item, index) => {
            return (
              <div 
                key={item.name}
                className={`${styles['currency-tab-item']} ${item.index === indexTab ? styles['active'] : ''}`}
                onClick={() => { this.chooseTab(item); }}
              >
                <div className={styles['tab-tit-top']}>
                  <img className={styles['icon']} src={item.icon} alt={item.name} />
                  <div className={styles['name-g']}>
                    <span className={styles['name']}>{item.name}</span>
                  </div>
                </div>
              </div>
            )
          })
        } */}
        </div>
        {
          ws1 && (
            <ul className={styles['currency-price']}>
              <li className={`${styles['price']} `}>
                <h2 className={`${styles[priceIcon]}`}>
                  ${ws1.price}
                </h2>
              </li>
              <li className={styles['dayc-rate']}>
                <p className={styles['desc']}>24h Change</p>
                <p className={`${styles['dayChange']} ${ws1.dayChangeRate < 0 ? styles['red'] : styles['greed']}`}>
                  <span className={styles['num-d']}>{this.getDayChange(ws1.dayChange)}</span> 
                  <span className={styles['rate']}>{multiply(ws1.dayChangeRate, 100)}%</span></p>
              </li>
              <li>
                <p className={styles['desc']}>24h High</p>
                <p>${ws1.high}</p>
              </li>
              <li>
                <p className={styles['desc']}>24h Low</p>
                <p>${ws1.low}</p>
              </li>
              <li>
                <p className={styles['desc']}>24h Volume ({ws1.currency})</p>
                <p>{ws1.dayVol}</p>
              </li>
              <li>
                <p className={styles['desc']}>24h Volume (USD)</p>
                <p>${ws1.dayVolUsd}</p>
              </li>
              <li>
                <p className={styles['desc']}>Open Interest</p>
                <p className={styles['long-sport']}>
                  <span className={styles['long']}>LONG:</span> <span className={styles['num']}>${numFormat(ws1.longOpen, 2)}</span> 
                  <span className={styles['sport']}>SHORT:</span> <span className={styles['num']}>{numFormat(ws1.shortOpen, 2)}</span>
                </p>
              </li>
            </ul>
          )
        }
        
      </div>
    );
  }
}
