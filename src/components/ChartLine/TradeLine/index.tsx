import React from 'react';
import { connect } from 'umi';
import styles from './index-pc.scss'

@connect(({websocket, chartConfig}) => {
  return {
    websocket,
    chartConfig
  }
})
class TimeLine extends React.Component {
  constructor(props: any) {
    super(props);
    // this.store = new TimeLineStore(props);
    this.state = {
      blockEnd: undefined,
      startEndLine: {
        xStart: 0,
        xEnd: 0,
        leftStart: 0,
        leftEnd: 0,
        nextTurn: undefined,
      },
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState,){
    const { websocket, dispatch } = this.props;
    const { wsData } = websocket

    if (wsData.ws1 && prevProps.websocket.wsData.ws1 !== wsData.ws1) {
      this.updateLine()
    }
  }

  updateLine = () => {
    const { websocket, dispatch, SERIES, CHART, chartConfig } = this.props;
    const { wsData } = websocket
    const { points } = SERIES;
    if (CHART) {
      if (!points.length) return;
      const lastP = points[points.length - 1];
      const lastBlockNum = wsData.ws1.blockNum || lastP.x; // TODO
      const lineData = this.getLineData(lastBlockNum);
      // this.setClassName(lineData)
    }
    
    // REACT.props.onLineChange(lineData);
  }

  // 临时前端计算，本轮结束时间戳
  getEndBlock = (lastBlockNum) => {
    const { epochPeriod } = this.props.chartConfig
    this.setState({
      blockEnd: (lastBlockNum - (lastBlockNum%epochPeriod)) + epochPeriod
    })

  }
  // 计算时钟线数据
  getLineData = (lastBlockNum) => {
    const { CHART, chartConfig } = this.props; 
    let nextTurn;
    const { spacing } = chartConfig;
    const { blockEnd } = this.state;
    if (blockEnd) {
        if (blockEnd <= lastBlockNum) {
            this.getEndBlock(lastBlockNum);
            nextTurn = true;
        }
    } else {
      this.getEndBlock(lastBlockNum);
    }
    const leftEnd = blockEnd - lastBlockNum;
    const start = blockEnd - spacing;
    const leftStart = start - lastBlockNum;
    const [xAxis] = CHART.xAxis;
    const navWidth = 0;
    const xStart = navWidth + xAxis.toPixels(start);
    const xEnd = navWidth + xAxis.toPixels(blockEnd);
    this.setState({
      startEndLine: {
        leftStart: leftStart,
        leftEnd: leftEnd,
        xStart,
        xEnd,
        nextTurn,
      }
    })
    return {
      leftStart: leftStart,
      leftEnd: leftEnd,
      xStart,
      xEnd,
      nextTurn,
    };
  }

  // 设置时钟线动画类
  setClassName({ leftEnd, nextTurn }) {
    console.log(leftEnd)
    // const TIME_S = TimeMax * 60;
    // const TIME_MS = TIME_S * 1000;
    // let anim = '';
    // if (nextTurn || this.lineStartStore.anim) {
    //     if (timeEnd > TIME_MS - 300 || (timeEnd > TIME_MS - 300 && timeEnd <= TIME_MS)) {
    //         anim = 'hide';
    //     } else if (timeEnd > TIME_MS - 550 || (timeEnd > TIME_MS - 550 && timeEnd <= TIME_MS)) {
    //         anim = 'show';
    //         this.props.store.SDK.log('turnend');
    //     }
    // }
    // this.animLine = anim;
    // this.lineStartStore.setAnim(anim);
    // this.lineEndStore.setAnim(anim);
  }

  render(): React.ReactNode {
    const { theme, chartConfig } = this.props;
    const { spacing } = chartConfig
    const { startEndLine, blockEnd } = this.state; 
    const strTime = '223';
    const frequency = 2
    return (
      startEndLine.xEnd > 0 && <>
        {/* 开始线 */}
        <div className={`${styles['time-line']} ${styles['white']}`} 
          style={{
              transform: `translate(${startEndLine.xStart}px, 0)`,
          }}>
          <div className={styles['time-line-main']}>
            {/* 文字内容 */}
            <div className={styles["tip-container"]}>
              <div className={styles["tip-text"]}>OrderDeadine</div>
              {
                startEndLine.leftStart >= 0 && 
                <div className={styles["box"]}>
                  {
                    startEndLine.leftStart === '' ?
                      /* 下一轮 */
                      t('tradeblock.next')
                      :
                      startEndLine.leftStart
                  }
                </div>
              }
             
            </div>
            {/* 直线 */}
            <div className={styles['time-lineL']} />
            <svg className={styles['icon']} aria-hidden="true">
              <use xlinkHref="#icon-flag" />
            </svg>
          </div>
          {
            startEndLine.leftStart <= 0 ? <div className={styles["mask"]} /> : ''
          }
        </div>
        
        {/* 结束 */}
        <div className={`${styles['time-line']} ${styles['end-line']} ${ startEndLine.leftEnd <= spacing ? styles['red'] : styles['yellow']}`} 
          style={{
              transform: `translate(${startEndLine.xEnd}px, 0)`,
          }}>
          <div className={styles['time-line-main']}>
            {/* 文字内容 */}
            <div className={styles["tip-container"]}>
              <div className={styles["tip-text"]}>OrderSettlement</div>
              {
                startEndLine.leftEnd <= spacing && 
                <div className={styles["box"]}>
                  {
                    startEndLine.leftEnd === '' ?
                      /* 下一轮 */
                      t('tradeblock.next')
                      :
                      startEndLine.leftEnd
                  }
                </div>
              }
              
            </div>
            {/* 直线 */}
            <div className={styles['time-lineL']} />
            {/* <Clock color={color} frequency={frequency} time={Math.floor(60 - (time / 1000))} />   */}

            <div className={`${styles['icon']} ${styles['clock']} ${ startEndLine.leftEnd <= spacing ? styles['red'] : styles['yellow']}`}>
              <i
                  className={`${styles['iconfont']} ${styles['icon-clock']} iconfont icon-clock`}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default TimeLine;