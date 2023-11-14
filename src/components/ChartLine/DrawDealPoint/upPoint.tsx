import React from 'react';
import styles from './index-pc.scss'
import './index-pc.scss'

export default class UpPoint extends React.Component {
  render() {
    const { data } = this.props;
    const isActive = false;
    const isHover = false;
    const isTop = true;
    const strPrice = '90'
    const updown = 1;
    const lineStyle = { width: `${document.documentElement.scrollWidth -230}px` };
    return(
      <div className={`priceTag gamma ${isActive ? 'active' : ''}`}>
        <div
            className={`box box-hover-${isHover}`}
            // onMouseEnter={this.onMouseEnter}
            // onMouseLeave={this.onMouseLeave}
            // onClick={this.onClick}
        >
            {data.blockNum}
        </div>
        {isActive ?
            <div className="acline" style={lineStyle} />
            :
            null
        }
        {isHover || (updown === 1 && isActive) ?
            <div className={`${isTop ? 'upline' : 'downline'} mini outer`} style={lineStyle} />
            :
            null
        }
        {isHover || (updown === 2 && isActive) ?
            <div className={`${isTop ? 'downline' : 'upline'} mini inner`} style={lineStyle} />
            :
            null
        }
        {/* {isHover ?
            <React.Fragment>
                <div className={`percent up ${isTop ? 'outer' : 'inner'}`}>
                    <span>{isTop ? strCallGain : strPutGain}%</span>
                    <i className="iconfont icon-arrow-up" />
                </div>
                <div className={`percent down ${isTop ? 'inner' : 'outer'}`}>
                    <span>{isTop ? strPutGain : strCallGain}%</span>
                    <i className="iconfont icon-arrow-down" />
                </div>
            </React.Fragment>
            :
            null
        } */}
    </div>
    )
  }
}