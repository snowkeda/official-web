import React from 'react';
import Swap from './Swap'
import Trading from './Trading'
import styles from './index-pc.scss'

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Trading',
      investmentNum: 1000,
    }
  }
  componentDidMount() {
  }

  handleTabs = (activeTab: string) => {
    this.setState({
      activeTab
    })
  }

  render() {
    const { activeTab, investmentNum, 
    } = this.state;
    const minPrice = 1;
    const inputPoint = 0;
    const tabList = ["Trading",  "Swap UTB"];
    return (
      <>
        <div className={styles['trade-swap']}>
          <ul className={styles['tabs']}>
            {
              tabList.map(item => {
                return (
                  <li key={item} className={activeTab === item ? styles['active'] : ''} onClick={() => this.handleTabs(item)}>{item}</li>
                )
              })
            }
          </ul>
          {/* trading */}
          {
            activeTab === 'Trading' && 
            <div className={`${styles['trade-box']} ${ activeTab === tabList[0] && styles['active']}`}>
              <Trading />
            </div>
          }
          {/* swap */}
          {
            activeTab === 'Swap UTB' && 
            <div className={`${styles['swap-box']} ${ activeTab === tabList[1] && styles['active']}`}>
              <Swap />
            </div> 
          }
        </div>
      </>
    );
  }
}

export default Trade