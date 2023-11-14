import React, { useEffect,  useState, useCallback, useMemo, memo } from "react";
import VirtualList from "rc-virtual-list"
import { List, Spin } from 'antd'
import moment from "moment";
import { utbDecimal } from '@/utils/utbEx'
import { getDecimal } from '@/utils/format'

import styles from './history-pc.scss'
import closeIcon from '@/assets/img/home/close-icon.png'

const History = (props) => {
  const { tableData, handleClose, pageObj, fetchLoading } = props;
  const [ navigationBarHeight, setNavigationBarHeight ] = useState(0)
  const [ pageNum, setPageNum ] = useState(2)
  // document.querySelectorAll('#drawer')[0].clientHeight
  const resizeUpdate = useCallback(() => {
    // 通过事件对象获取浏览器窗口的高度
    let h = document.querySelectorAll('#drawer')[0].clientHeight;
    setNavigationBarHeight(h);
  }, [navigationBarHeight])

  const tableArr = useMemo(() => {
    return tableData.sort(function(a, b){ return b.blockNumber - a.blockNumber})
  }, [tableData])

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    setNavigationBarHeight(document.querySelectorAll('#drawer')[0].clientHeight) 
    window.addEventListener('resize', resizeUpdate);
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
    }
  }, []);
  const hClose = () => {
    handleClose()
  }
  const onVisibleChange = (visibleList, fullList) => {
    const leng = fullList.length;
    if (leng > 0 && pageObj.pages >= pageNum) {
      console.log(pageObj)
      if (visibleList.length === 1 && visibleList[0].txHash === fullList[leng - 1].txHash) {
        props.handleSearch(pageNum)
        setPageNum(pageNum+1)
      }
    }
  }
  return (
    <div className={styles['history-box']} id="history">
      <div className={styles['title']}>
        <span>History</span>
        <img onClick={() => hClose()} src={closeIcon} alt="close" />
      </div>
      <List className={styles['history-list']} >
        <Spin spinning={fetchLoading} >
          {
            !fetchLoading && tableArr.length === 0 
              ? <div className={styles['empty-box']}>No Data</div> : ''
          }
          <VirtualList
            data={tableArr}
            height={navigationBarHeight - 120}
            // height={60}
            itemHeight={69} 
            itemKey="blockNumber"
            onVisibleChange={onVisibleChange}
          >
            {(item) => {
              const pnl = Number(item.pnl)
              const amount = Number(item.amount);
              const flag = pnl > 0 ? styles['green'] : styles['red'];
              const income = pnl > 0 ? pnl : amount;
              return (
                <div className={styles['item']} key={item.blockNumber}>
                  <div className={styles['time']}>
                    <span className={styles['hm']}>{moment(item.gmtCreate).format('HH:mm')}</span>
                    <span className={styles['mmm']}>{moment(item.gmtCreate).format('DD MMM')}</span>
                  </div>
                  <span className={styles['blockNumber']}>{item.blockNumber}</span>
                  <span className={`${styles['income']} ${flag}`}>{`${pnl > 0 ? '+' : '-'}${getDecimal(income, 6)}`}</span>
                </div>
              )
            }}
          </VirtualList>
        </Spin>
      </List>
    </div>
  )
}


// export default  memo(History, (prevProps, nextProps) => {
//   return prevProps.tableData.toString() === nextProps.tableData.toString()
// });
export default  History;

