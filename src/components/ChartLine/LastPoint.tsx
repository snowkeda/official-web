import React, { Fragment } from 'react';
// import { observer, inject, disposeOnUnmount } from 'mobx-react';
import CountUp from 'react-countup';
import styles from './index-pc.scss';
import classnames from 'classnames';
// import { reaction } from 'mobx';
// import wsStore from '@/mobx/WsStore';

let oldP = '';
let newP = '';
const BtcLength = 8;
const EthLength = 7;
let Leng = null;

export default class LastPoint extends React.Component {
    constructor() {
        super();
        this.state = {
            point: 0,
            zerro: '',
            result: null
        };
    }
    componentDidMount() {
    // 结算点更新
        // disposeOnUnmount(this, reaction(
        //     () => wsStore.wsData.ws12,
        //     this.onWs12Change
        // ));
    }

    onWs12Change = (data) => {
        const { profit } = data;
        const { assetCode, nOptionType } = this.props.store;
        const { coin } = this.props.store.coinStore;
        window.settle = { d: data, coin };
        if (data.assetCode === assetCode && data.currency === coin.id && data.optionType === nOptionType) {
            this.setState({ result: profit });
        }
    }

    calcRight = (r) => {
        let right = 110;
        if (r) {
            const str = r.toString().replace('-', '');
            const numsOfOne = str.split('1').length - 1;
            // eslint-disable-next-line radix
            const c = str.length * 10 + 13 + 16 + 12 + parseInt(numsOfOne / 2);
            right = c > right ? c : right;
        }
        return right;
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { info } = nextProps;
        // const { assetName } = this.props.store;
        // if (assetName.indexOf('BTC') !== -1) {
        //     Leng = BtcLength;
        // } else if (assetName.indexOf('ETH') !== -1) {
            Leng = EthLength;
        // } else {
        //     Leng = BtcLength;
        // }
        oldP = info.previous;
        newP = info.incre ;
        this.setState({
            zerro: '',
        });
        const reg = /.*\..*/;
        // 看下不变的值是否有小数点
        if (!reg.test(info.normal)) { // 没有小数点,后面就保留四位小数点
            newP = Number(newP).toFixed(4);
            this.setState({
                point: 4,
            });
        } else { // 有小数点，直接返回，看是否需要补零
            this.setState({
                point: 0,
            });
            const len = ((info.normal).length - 1) + String(newP).length; // 不变的位数 + 改变的位数
            // const len = 7;
            if (Leng - len > 0) { // 有缺位
                const arr = ['0', '00', '000', '0000'];
                for (let i = 0; i < (BtcLength - len); i += 1) {
                    if ((Leng - len) === (i + 1)) {
                        this.setState({
                            zerro: arr[i],
                        });
                    }
                }
            }
        }
    }

    render() {
        // const { hasOtmAcPrice } = this.props.store;
        // const { coin } = this.props.store.coinStore;
        const { info, x } = this.props;
        const { normal, up, dark } = info;
        const { point, zerro, result } = this.state;
        const isDark = dark;
        return (
            <Fragment>
                <div className={styles[`${info.type === 'dark' ? 'lastpoint-line dark' : 'lastpoint-line'}`]} style={{ left: x + 13, right: this.calcRight(result) }} />
                {/* isDark ? 'lastpoint-tips dark' : 'lastpoint-tips' */}
                {/* <div className={classnames({ 'lastpoint-tips': true, 'lastpoint-tips-show-result': result !== null, dark: isDark })}> */}
                {/* ${styles['lastpoint-tips-show-result']} */}
                <div className={`${styles[`lastpoint-tips`]} `}>
                    <div className={styles['point-tips-content']}>
                        <span className={styles['normal']}>{normal}</span>
                        <span className={styles[`${!isDark && up ? 'green' : 'red'}`]}>
                            {newP !== '' ?
                                <CountUp
                                    start={Number(oldP)}
                                    end={Number(newP)}
                                    duration={0.4}
                                    decimal="."
                                    decimals={point}
                                />
                                :
                                null
                            }
                            {zerro}
                        </span>
                    </div>
                    {
                        result !== null && (
                            <div className="settle-result">
                                {/* <span className="result-title">收益: </span> */}
                                <span className={classnames(['result-value', Number(result) > 0 ? 'up' : 'down'])}>
                                    <span>{(Number(result) > 0 ? '+' : '-')}</span>
                                    {/* {coin.icon} */}
                                    {/* Math.abs会变成科学计数法 */}
                                    <span>{result.replace('-', '')}</span>
                                </span>
                            </div>
                        )
                    }
                </div>
            </Fragment>
        );
    }
}
