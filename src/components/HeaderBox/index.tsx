import React from "react";
import { connect, Link, useLocation  } from "umi"
import { message } from 'antd'
import ConnectWallet from "@/components/ConnectWallet"
import block from '@/assets/img/airdrop/block.png'
import logo from '@/assets/img/binax.png'
import styles from './index-pc.scss'


const HeaderBox = (props) => {
  const { siteName } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { pathname } = useLocation();
  const tips = () => {
    messageApi.open({
      icon: null,
      content: 'Functionality under development',
      className: "global-tips",
    })
  }
  const menuList = [
    {title: 'Dashboard', link: '/dashboard', cName: 'dashboard', },
    {title: 'Swap', link: '', cName: 'swap', },
    {title: 'DAO', link: '', cName: 'dao', },
    {title: 'Ladder', link: '', cName: 'ladder', },
    {title: 'NFTs', link: '', cName: 'nfts', },
    {title: 'Ecosystem', link: '', cName: 'ecosystem', },
  ]

  return(
    <section className={styles['header-box']}>
      <div className={styles['left']}>
        {contextHolder}
        <Link to={'/'} ><img className={styles['logo']} src={logo} alt={siteName} /></Link>
        <ul className={styles['menu-list']}>
          <li className={styles['airport']}>
            <Link to={'/airdrop'}>
              <img src={block} alt="airdrop" />
              Airdrop
            </Link>
          </li>
          {
            menuList.map((item, index) => {
              return (
                <li className={styles[item.cName]} key={item.cName}>
                  {
                    item.link ? 
                    <Link to={item.link} className={pathname === item.link ? styles['active'] : ''}>
                      {item.title}
                    </Link> :
                    <a onClick={tips}>{item.title}</a>
                  }
                </li>
              )
            })
          }
          <li className={styles['docs']}>
            <a href="https://docs.binax.io/meet-binax/overview" target="_blank" >Docs</a>
          </li>
        </ul>
      </div>
      <div className={styles['right']}>
        <ConnectWallet />
      </div>
    </section>
  )
}
export default connect(
  ({global}) => ({
    siteName: global.siteName
  })
)(HeaderBox)
