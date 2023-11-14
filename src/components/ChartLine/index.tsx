import React from "react";
import { withRouter, setLocale, connect, FormattedMessage, getAllLocales, useIntl, getIntl  } from 'umi';
import Highcharts from 'highcharts';
import HighchartsAnnotations from 'highcharts/modules/annotations'
import TradeLine from './TradeLine';
import DrawDealPoint from './DrawDealPoint';
import EndPoint from './DrawDealPoint/endPoint';
import ChartLoading from './ChartLoading';
import { YPDrawer } from "./YPDrawer";
import { timestampToTime } from "@/assets/js/common";
import LastPoint from './LastPoint'
import { comparePrice, reflowChart, getRangeMinDiff, getRangePadding } from "./fun";

import styles from './index-pc.scss';
HighchartsAnnotations(Highcharts)
const mapPAll = {}; // 所有交易对点
let mapPOrder = {}; // 所有交易对下注点
let maxOrderPrice; // 最大下注点价格
let minOrderPrice; // 最小下注点价格
let defaultDiff = 200; // 每一轮块数 会被chartconfig覆盖
let oldPrice = null;
let isUpdate;
let showEndPointTime;
let timeEnd; // 本轮结束时间戳
let CHART;
let SERIES;
let REACT;
let otmPList = { map: {}, list: [] }; // 所有行权价
let gammaPList = { list: [] }; // 所有gamma行权价
let DRAWER;

// 初始化图表
let tMinRangeBTC = 12; // BTC最小单屏价差
let tMinRangeETH = 0.6; // ETH最小单屏价差
let tMinRange; // 最小单屏价差
let tMaxPadding = 1; // 图表上下留空百分比
const tTickAmount = 4; // y轴刻度线(价格线)
// let tMinTickInterval; // 最小刻度区间价差
let tNeedPadding = true; // 处理单屏上下留空
let tNeedDataDiff = true; // 处理单屏最小价差
let checkListPrice; // 计算行权价排列

@connect(({websocket, chartConfig, trade, wallet}) => {
  return {
    websocket,
    chartConfig,
    trade,
    wallet,
  }
})
class ChartLine extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      chartLoading: true,
      settleBlockNum: 0,
      endPoint: null,
    }
    this.annotationList = [];
    this.endPointList = [];
    this.ws1BlockNum;
    REACT = this;
  }
  
  async componentDidMount() {
    const { dispatch, chartConfig } = this.props;
    await dispatch({
      type: "websocket/open",
      payload: { currency: chartConfig.assetName }
    })
    // wsStore.on('message', (res) => {
    //     if (res.reqType === 1) {
    //       yield put({ type: 'set', payload: { wsStore } });
    //       this.setState({
    //         ws1: res.data,
    //       })
    //     }
    //     if (res.reqType === 2) {
    //       this.setState({
    //         ws2: res.data,
    //       })
    //     }
    //   })
    // const { wsData } = this.props
    // console.log(this.state.wsData.ws2)
    // const { wsData, wsStore } = this.props.websocket
    // console.log(wsData.ws2)
    // this.initChart(websocket.wsData.ws2)
  }

  async componentDidUpdate(prevProps, prevState) {
    const { websocket, dispatch, chartConfig, trade, wallet } = this.props;
    const { wsData } = websocket
    const { settleBlockNum } = this.state;
    // 币种切换
    if (chartConfig.assetName !== prevProps.chartConfig.assetName) {
      console.log(chartConfig.assetName )
      await dispatch({
        type: "websocket/open",
        payload: { currency: chartConfig.assetName }
      })
    }
    if (prevProps.websocket.wsStore !== this.props.websocket.wsStore) {
      console.log(`wsStore, 变化`)
      const { websocket, dispatch } = this.props;
      if (websocket.wsStore) {
        websocket.wsStore.on('message', (res) => {
          dispatch({
            type: "websocket/setWsData",
            payload: { [`ws${res.reqType}`]: res.data }
          })
        })
      }
    }
    // 周期数 
    if (prevProps.chartConfig.epochPeriod !== chartConfig.epochPeriod) {
      defaultDiff = chartConfig.epochPeriod;
    }
    if (wsData.ws2 && prevProps.websocket.wsData.ws2 !== wsData.ws2) {
        const list = wsData.ws2.map(one => [one.blockNum, Number(one.price), {}]);
        this.initChart(list)
    }
    if (prevProps.websocket.wsData.ws1 !== wsData.ws1) {
        if (settleBlockNum === 0 && wsData.ws1) {
          this.setState({
            settleBlockNum: (wsData.ws1.blockNum - (wsData.ws1.blockNum%defaultDiff)) + defaultDiff
          })
        } 
        this.onWs1Change({
            lineBinaryOptionPriceIndex: wsData.ws1,
            optionTransfer: false
        })
    }
    // 未结算订单绘点
    const { epochInfoList, betCPObj, settlementFlag } = trade
    if (prevProps.trade.epochInfoList.toString() !== epochInfoList.toString() && epochInfoList.length > 0) {
      this.addDrawerPoint()
    }
    // 订单结算
    if (prevProps.chartConfig.oldEpoch !== chartConfig.oldEpoch && prevProps.chartConfig.oldEpoch !== 0) {
      if (chartConfig.oldEpoch) {
        this.addEndPoint()
      }
      this.setDrawerPointColor()
    }
    if (settlementFlag !== prevProps.trade.settlementFlag) {
      this.drawerEndPoint()
    }
    // console.log(this.state.wsData)
  }

  componentWillUnmount() {
    const { websocket, dispatch } = this.props;
    if (CHART) {
        CHART = null
    }
    dispatch({
      type: "websocket/destroy",
    })
    window.removeEventListener('resize', this.handleResizeReflow);
  }
  
  initChart = (list) => {
    const  { chartConfig } = REACT.props;
    const assetName = chartConfig.assetName
    // const { assetName } = REACT.props.store;
    // 设置价格刻度参数
    if (assetName.indexOf('BTC') > -1) {
        tMinRange = tMinRangeBTC;
    } else if (assetName.indexOf('ETH') > -1) {
        tMinRange = tMinRangeETH;
    }
    tNeedPadding = true;
    tNeedDataDiff = true;
    checkListPrice = false;
    // 设置历史点list
    const data = list.map(one => ({
        id: String(one[0]),
        x: one[0],
        y: one[1],
        arrayParam: one[2],
    }));
    // 前端缓存下注点
    const map = (mapPAll[assetName] && mapPAll[assetName].map) || {};
    list.forEach((one) => {
        const [x, y] = one;
        map[x] = y;
    });
    mapPAll[assetName] = { map, list: data.slice() };
    // removeOrderPointsAll();
    // mapPOrder[assetName] = { map: {}, list: [] };
    // 创建图表
    if (CHART) {
        isUpdate = true;
        CHART.xAxis[0].update({
            tickInterval: 200,
        }, false);
      /*   CHART.yAxis[0].update({
            minTickInterval: tMinTickInterval,
        }, false); */
        setChartData(data, true, false, false);
        isUpdate = false;
    } else {
    // 折现动画时间
        REACT.animation = { duration: 80 }; // TODO
        // 点动画时间
        REACT.animationP = { duration: 300 }; // TODO
        CHART = Highcharts.chart('container', {
            rangeSelector: {
                selected: 1,
            },
            title: {
                text: '',
            },
            // annotations: [{
            //   labels: [],
            //   events: {
            //     afterUpdate: function () {
            //       console.log(222)
            //     }
            //   }
            // }],
            chart: {
                className: 'myChart',
                marginRight: 10,
                marginBottom: 30,
                spacingRight: 0,
                // zoomType: 'x', // 选中缩放
                panning: false, // 平移
                backgroundColor: 'transparent',
                animation: REACT.animation,
                events: {
                    load() {
                        [SERIES] = this.series;
                    },
                    redraw() {
                        // 更新下注点/实时点/涨跌线等
                        REACT.updateAll(REACT.ws1BlockNum);
                    },
                    selection() {
                        // event.xAxis[0].min;
                        // event.xAxis[0].max;
                        return false;
                    },
                },
            },
            credits: {
                enabled: false,
            },
            navigation: {
                menuStyle: { display: 'none' },
            },
            plotOptions: {
                series: {
                    lineColor: '#fff',
                    lineWidth: 2,
                    fillOpacity: 0.9,
                    stickyTracking: false,
                    // animation: false,
                    dataLabels: {
                        enabled: false,
                    },
                    marker: {
                        enabled: false,
                    },
                },
                cursor: 'pointer',
            },
            scrollbar: {
                enabled: false,
            },
            tooltip: {
                useHTML: true,
                xDateFormat: '%H:%M:%S',
                backgroundColor: 'rgba(79,89,109,0.8)',
                formatter() {
                    return `
                        <div>
                            <p style="color:#fff; margin-bottom:5px;"><span style="color:#A8ACBB; margin-right:
                            5px;">blockNumber:</span>${this.x}</p>
                            <p style="color:#fff; margin-bottom:0px;"><span style="color:#A8ACBB;margin-right:
                            5px;">price:</span>${this.y}</p>
                        </div>`;
                },
                borderColor: 'transparent',
                borderRadius: 8,
            },
            xAxis: {
                type: 'linear',
                lineWidth: 0,
                tickColor: 'transparent',
                // tickInterval: 100,
                // tickPixelInterval: 100,
                title: null,
                maxPadding: 0.95,
                crosshair: {
                    snap: false,
                    color: 'rgba(167, 174, 196, 0.3)',
                    dashStyle: 'Solid',
                },
                labels: {
                    style: {
                        color: 'rgba(167, 174, 196, 0.5)',
                    }
                },
                gridLineColor: 'rgba(167, 174, 196, 0.1)', // 背景网格
                gridLineWidth: 1,
            },
            yAxis: {
                maxPadding: 0.25,
                minPadding: 0.25,
                // tickAmount: tTickAmount,
                // tickInterval: tMinTickInterval,
                // minTickInterval: tMinTickInterval,
                offset: -60,
                opposite: true,
                // tickPosition: 'inside',
               /*  tickPositioner() {
                  const positions = [];
                  // 依赖配置参数
                  // const { priceShow, optionType } = REACT.props.store;
                  const tickAmount = tTickAmount;
                  const maxPadding = tMaxPadding;
                  // tMinRange也可以由屏幕高和行权价差算出
                  const minRange = tMinRange;
                  let needPadding = tNeedPadding;
                  let needDataDiff = tNeedDataDiff;
                  let needDataGamma = false;
                  // if (optionType === 3) {
                  //     needDataDiff = false; // TODO
                  //     needDataGamma = true;
                  // }
                  let max = this.dataMax;
                  let min = this.dataMin;
                  // max和min可以缓存做下次判断的参数，在一定范围内不需要改变

                  // 单屏上下留空
                  // if (!needPadding && !priceShow) {
                  //     needPadding = true;
                  // }
                  if (needPadding) {
                      const { max: dataMaxPadding, min: dataMinPadding } = getRangePadding({
                          max,
                          min,
                          maxPadding,
                      });
                      max = dataMaxPadding;
                      min = dataMinPadding;
                  }
                  // 单屏最小价差
                  if (needDataDiff) {
                      const { max: dataMaxDiff, min: dataMinDiff } = getRangeMinDiff({
                          max,
                          min,
                          minRange,
                      });
                      max = dataMaxDiff;
                      min = dataMinDiff;
                  }
                  // 计算刻度线数组
                  const tickInterval = (max - min) / (tickAmount - 1);
                  for (let i = tickAmount - 1, tick = min; i >= 0; i -= 1, tick += tickInterval) {
                      positions.push(Number(tick.toFixed(2)));
                  }
                  return positions;
                }, */
                allowDecimals: true, // 是否可以是小数
                title: null,
                snap: false,
                crosshair: {
                    snap: false,
                    color: 'rgba(167, 174, 196, 0.3)',
                    dashStyle: 'Solid',
                },
                labels: {
                  style: {
                      color: 'rgba(167, 174, 196, 0.5)',
                  },
                  formatter: function() {
                    // y轴数据处理
                    return this.value
                  }
                },
                gridLineColor: 'rgba(167, 174, 196, 0.1)', // 背景网格
                gridLineWidth: 2,
            },
            legend: {
                enabled: false,
            },
            showCheckBox: true,
            series: [{
                type: 'area', // areaspline
                data,
                // keys: ['x', 'y', 'arrayParam'],
                animation: true,
                threshold: null,
                turboThreshold: 0,
                allowPointSelect: true,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, 'rgba(117,122,136,0.6)'],
                        [1, 'rgba(88,91,114,0)'],
                    ],
                },
            }],
            accessibility: {
              enabled: false,
            },
        });
        DRAWER = new YPDrawer(CHART);
        this.setState({
          chartLoading: false
        })
        // 监听滚轮事件
        const { showZoom } = REACT.props.websocket.SDK.config;
        if (showZoom) {
            const domContainer = document.getElementById('container');
            // gesture.on(domContainer, 'mousewheel', (delta) => {
            //     REACT.onZoomChange(delta);
            // });
        }
    }
    setTimeout(() => {
      window.addEventListener('resize', this.handleResizeReflow)
    }, 500);
  }

  handleResizeReflow = () => {
    setTimeout(() => {
      reflowChart(CHART);
    }, 100);
  }

  onWs1Change = ({ optionTransfer, lineBinaryOptionPriceIndex }) => {
    if (!lineBinaryOptionPriceIndex) return;
    const { time, blockNum, price, asset } = lineBinaryOptionPriceIndex;
    const { settleBlockNum } = this.state;
    const [xAxis] = CHART.xAxis;
    const maxDiff = 250;

    this.ws1BlockNum = blockNum;
    // 轮次结束块
    // 
    this.addPoint(blockNum, price, true);
    if ((xAxis.dataMax - xAxis.dataMin > maxDiff) && settleBlockNum < blockNum) {
      const list = SERIES.options.data
          .filter(one => one.x > xAxis.dataMax - defaultDiff)
        //   .sort((a, b) => {
        //     return a.x - b.x
        //   });
      setChartData(list);
      this.setState({
        settleBlockNum: (blockNum - (blockNum%defaultDiff)) + defaultDiff
      })
    }

  }

  // 新增实时点
  addPoint = (x, price, bAnimation, bInsert = true) => {
    const options = { x: x, y: Number(price), id: String(x) };
    const redraw = true;
    const shift = false;
    const animation = bAnimation ? REACT.animationP : false;
    
    if (SERIES) {
        SERIES.addPoint(options, redraw, shift, animation);
    }
    // const thisMapPAll = getThisMapPAll();
    // console.log(thisMapPAll)
    // if (!bInsert) {
    //     thisMapPAll.list.push(options);
    // } else {
        // const index = thisMapPAll.list.findIndex(one => one.x > time);
        // thisMapPAll.list.splice(index - 1, 0, options);
    // }
    // thisMapPAll.map[time] = price;
  }

  // 更新所有辅助点
  updateAll = () => {
    const { data: points } = SERIES;
    if (!points.length) return;
    // const firstTime = points[0].x;
    const lastP = points[points.length - 1];
    const lastPosX = lastP.plotX;
    const lastPosY = lastP.plotY;
    const lastY = lastP.y;
    // console.log(ws1Obj)
    // const lastBlockNum = lastBlockNumOld || lastP.x; // TODO

    // 更新时钟线
    // const lineData = getLineData(lastTime);
    // REACT.props.onLineChange(lineData);
    // 更新实时点
    renderLastPoint(lastPosX, lastPosY, lastY);
  }
  // 添加交易点
  addDrawerPoint = () => {
    const { websocket, trade } = this.props;
    const { epochInfoList } = trade
    // const { wsData } = websocket;
    // const { ws1 } = wsData;
    // let epochInfoList = [{
    //   amount: amount,
    //   blockNumber: ws1.blockNum,
    //   y: ws1.price,
    //   x: ws1.blockNum,
    // }]
    // 打加一点
    epochInfoList.map((item) => {
      let flag = false
      this.annotationList.map((obj) => {
        if (obj.id.indexOf(item.x) >= 0) {
          flag = true
        }
      })
      if (!flag) {
        this.addDivP(item)
      }
    })
    // if (this.annotationList.length === 0) {
    //   epochInfoList.map((item) => {
    //     this.addDivP(item)
    //   })
    // } else {
    //   this.addDivP(epochInfoList[0])
    // }
  }
  // adddiv
  addDivP = (item) => {
    const {x, amount} = item
    const { oldEpoch, epochPeriod, spacing } = this.props.chartConfig;
    const { dollar } = this.props.wallet;
    let y = 0;
    const num = SERIES.xData.indexOf(Number(x))
    if (num > 0) {
      y = SERIES.yData[num]
    }
    item.nextTurn = false
    if (oldEpoch + epochPeriod - spacing < x) {
      item.nextTurn = true
    }
    // blockNumber
    const labels = [{
        useHTML: true,
        shape: 'connector',
        color: amount > 0 ? 'green' : 'red',
        point: {
            x,
            y, // TODO
            xAxis: 0,
            yAxis: 0,
        },
        text: ' ',
        padding: 0,
        align: 'left',
        verticalAlign: 'top',
    }]; 
    const res = DRAWER.addAnnotation({
        id: `price${x}`,
        labels,
    });
    item.id = `price${x}`;
    item.y = y;
    // this.blockNum = `price${x}`
    // this.div = res.div;
    this.annotationList = [...this.annotationList, {
      id: `price${x}`,
      dom: res.div,
      data: item,
    }];
    DRAWER.addDiv(<DrawDealPoint data={item} />, res.div, `price${x}`)
  }
  // 获取订单结算信息
  addEndPoint = () => {
    const { websocket, trade, chartConfig, wallet } = this.props;
    const { epochInfoList } = trade
    const point = [];
    epochInfoList.map((item, index) => {
      if (item.blockNumber <= (chartConfig.oldEpoch - chartConfig.spacing)) {
        console.log(`addEndPoint: `, item)
        point.push(item)
      }
    })
    if (point.length > 0) {
      if (wallet.userAddressList.length > 0) {
        console.log('获取订单结算信息')
        this.props.settlement()
      }
    }
  }
  // 
  drawerEndPoint = () => {
    const { trade, chartConfig } = this.props;
    const pointObj = CHART.get(String(chartConfig.oldEpoch));
    const {x, y, id} = pointObj.options
    console.log(pointObj.plotX, pointObj.plotY)
    // blockNumber
    const labels = [{
      useHTML: true,
      shape: 'connector',
      // color: amount > 0 ? 'green' : 'red',
      point: {
          x,
          y, // TODO
          xAxis: 0,
          yAxis: 0,
      },
      text: ' ',
      padding: 0,
      align: 'left',
      verticalAlign: 'top',
    }]; 
    const res = DRAWER.addAnnotation({
        id: `end${x}`,
        labels,
    }); 
    this.endPointList = [
      ...this.endPointList,
      {
        id: `end${x}`,
        dom: res.div,
      }
    ]
    DRAWER.addDiv(<EndPoint amount={trade.totalAmount} price={y} point={pointObj} />, res.div, `end${x}`)
  }
  // 删除交易点
  removeDrawerPoint = () => {
    // console.log(this.annotationList)
    // const arr = this.annotationList;

    // arr[0].dom.getElementsByClassName(styles['dealPoint'])[0].setAttribute('class', `dealPoint`)
    // DRAWER.removeAnnotation(this.endPointList[0].id)
    this.endPointList[0].dom.remove()
  }
  // 修改灰色下单点样式
  setDrawerPointColor = () => {
    const anArr = this.annotationList;
    if (anArr.length > 0) {
      anArr.map((item, index) => {
        const { dom, id} = item;
        const cName = dom.querySelector(`#${id}`).getAttribute('class')
        if (cName.indexOf('gray') >= 0 ) {
          console.log('gray')
          const reName = cName.replace('gray', '')
          dom.querySelector(`#${id}`).setAttribute('class', `${reName}`)
        }
      })
    }
  }


  render() {
    const { websocket } = this.props;
    const { lastPoint, endPoint, chartLoading  } = this.state;
    const { wsData } = websocket
    return (
      <>
        <div className={styles['chart-line']}>
          <div id="container" className={`${styles['hoverContainer']}`} />
          <div id="plusContainer" className={`${styles['zoomContainer']}`}>
            {chartLoading ? <ChartLoading /> : null}
            {lastPoint}
            {/* 结算点 */}
            {endPoint}
          </div>
          <TradeLine theme="start" SERIES={SERIES} CHART={CHART}  />
          {/* <TradeLine theme="end" /> */}
        </div>
        {/* <button type="button" onClick={() => this.addDrawerPoint()} >加点</button>
        <button type="button" onClick={() => this.removeDrawerPoint()} >删除</button> */}

      </>
      
    )
  }
}

// 设置图表数据
function setChartData(data) {
  SERIES.setData(data, true, false, false);
}

// 设置X轴的最小值
function setExtremesX(data) {
  if (CHART) CHART.xAxis[0].setExtremes(data);
}

// 获取所有数据点
function getThisMapPAll(id) {
  // const { assetName } = REACT.props.store;
  const assetName = 'ETH'
  return mapPAll[id || assetName] || { map: {}, list: [] };
}

// 实时点
function renderLastPoint(x, y, itemY) {
  const newPrice = Number(itemY).toFixed(4); // Highcharts.numberFormat
  let info;
  if (oldPrice === null) {
      info = {
          old: '',
          new: itemY,
          up: true,
          normal: itemY,
          incre: '',
      };
  } else {
      const newA = newPrice.split('');
      const oldA = oldPrice.split('');
      info = comparePrice(newA, oldA, newPrice, oldPrice);
  }
  info.type = false ? 'dark' : 'light';
  REACT.setState({
      lastPoint: (
          <div className={styles['lastpoint-container']} style={{ transform: `translateY(${y}px)` }}>
              <div className={styles['lastpoint']} style={{ transform: `translate(${x + 7}px, 100%)` }}>
                  <div className={styles['ripple']}>
                      <div className={styles['lightOne']} />
                      <div className={styles["lightTwo"]} />
                      <div className={styles["lightThree"]} />
                  </div>
              </div>
              {/* 实时点左侧 */}
              <div className={styles[`${info.type === 'dark' ? 'lastpoint-lineLeft dark' : 'lastpoint-lineLeft'}`]} style={{ width: x }} />
              {/* 实时点右侧，滚动数字 */}
              <LastPoint info={info} x={x} />
          </div>
      )
  }, () => { oldPrice = newPrice; });
}

export default ChartLine