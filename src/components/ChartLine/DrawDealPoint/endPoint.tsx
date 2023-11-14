import React from 'react';
import UtbIcon from '@/assets/img/home/UtbIcon.png'
import styles from './endPoint-pc.scss'

export default class EndPoint extends React.PureComponent {
  // 构造
  constructor(props: any) {
    super(props);
    this.state = {
      loadingPoint: '.',
  };
  }

  // 筛选类名
  isPositive = (type) => {
    const { amount } = this.props;
    if (type) return Number(amount) > 0 ? 'infoUp' : 'infoDown';
    return Number(amount) > 0;
  }

  render(): React.ReactNode {
    const { result, loadingPoint } = this.state;
    const { point, amount, price } = this.props;
    return (
      <div className={styles['endPoint']}>
        <div className={styles['cicle']}>
          <div className={styles['heart']} />
        </div>
        <div className={`${styles[`info`]} ${styles[`${this.isPositive(1)}`]}`}>
          <div className={styles['triangle']} />
          <div className={styles["result"]}>
            <p>Transaction results</p>
            <p>
              <img className={styles['price-icon']} src={UtbIcon} alt='utb' />
              {/* {t('tradeblock.transaction')} */}
              {/* <br /> */}
              {amount != null ?
                <span className={styles["content"]}>
                  <span>{(this.isPositive(false) ? '+' : '')}</span>
                  {/* {coin.icon} */}
                  {/* Math.abs会变成科学计数法 */}
                  <span>{amount}</span>
                </span>
                :
                <span className={styles["content"]}>{t('tradeblock.settling')}</span>
              }
            </p>
            <p>{price}</p>
          </div>
        </div>
      </div>
    );
  }
}