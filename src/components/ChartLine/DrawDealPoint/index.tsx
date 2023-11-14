import React from 'react';
import UtbIcon from '@/assets/img/home/UtbIcon.png'
import styles from './index-pc.scss'


export default class Index extends React.Component {
  // 构造
  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    const { amount, type, nextTurn, id, dollar, y } = this.props.data
    const profit = false
    let b1;
    let b2;
    let b3;
    let svg;
    let p1;
    let p2;
    let pop;

    return (
      <div id={id} className={`${styles['dealPoint']} ${styles[amount > 0 ? 'green' : 'red']} ${styles[nextTurn ? 'gray' : '']}`}>
        <div className={styles["circle"]} >
          <div className={styles["heart"]} />
          <div>
            <div className={styles["border1"]} style={b1} />
            <div className={styles["border2"]} style={b2} />
            <div className={styles["border3"]} style={b3} />
          </div>
        </div>
        <div className={styles["info"]}>
          <svg width="325" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <path className={styles["svgLine"]} style={svg} d="M15 25 L30 45 L155 45" stroke="#FFF" strokeWidth="1.5" fill="none" />
          </svg>
          <div className={styles["amount"]} style={p1}>
            <span>{amount}</span>
          </div>
          <div className={styles["result"]} style={p2}>
            <p>
              +
              <img src={UtbIcon} alt='utb' />
              <span className={styles["up"]}>{profit || '--.--'}</span>
            </p>
          </div>
        </div>
        <div className={styles["pricePop"]} style={pop}>
          <p className={styles['p-amount']}>
            <img className={styles['price-icon']} src={UtbIcon} alt='utb' />
            <span>{amount}</span>
          </p>
          <p className={styles['dollar']}>{y}</p>
        </div>
      </div>
    )
  }
}