import React, { useState, useEffect } from "react";
import { Link } from "umi"
import ConnectWallet from "@/components/ConnectWallet"
import Footer from '@/components/footer'
import { Swiper } from 'antd-mobile'
import Marquee from "react-fast-marquee";
import { getDashboardHome } from '@/fetch/apis';
import logo from '@/assets/img/homeNew/logo.png'
import ETH from '@/assets/img/homeNew/ethereum.png'
import BTC from '@/assets/img/homeNew/bitcoin.png'
import UTB from '@/assets/img/homeNew/utb.png'
import planetHares from '@/assets/img/homeNew/PlanetHares.png'
import beosin from '@/assets/img/homeNew/beosin.png'
import vivaLeva from '@/assets/img/homeNew/VivaLeva.png'
import gtb from '@/assets/img/homeNew/gtb.png'
import vtb from '@/assets/img/homeNew/vtb.png'
import arbitrum from '@/assets/img/homeNew/arbitrum.png'
import tranching from '@/assets/img/homeNew/Tranching.png'
import outer from '@/assets/img/homeNew/outer.png'
import copycat from '@/assets/img/homeNew/Copycat.png'
import deri from '@/assets/img/homeNew/Deri.png'
import oKXwallet from '@/assets/img/homeNew/OKXwallet.png'
import explore1 from '@/assets/img/homeNew/explore-1.png'
import explore2 from '@/assets/img/homeNew/explore-2.png'
import explore3 from '@/assets/img/homeNew/explore-3.png'
import block from '@/assets/img/airdrop/block.png'
import './index-pc.scss'
import './index-h5.scss'

export default () => {
  const [pm, setPm] = useState([true, false, false]);
  const [roadMap, setRoadMap] = useState([false, false, true, false, false]);
  const [roadActive, setRoadActive] = useState(2);
  const [exploreNum, setExploreNum] = useState(0);
  const [hrefActive, setHrefActive] = useState('');
  const [roadIndex, setRoadIndex] = useState(4);
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await getDashboardHome();
      if (res.code === 0) {
        setData(res.data)
      }
    }
    fetchData()
  }, [])
  const handleMouseOver = (num) => {
    const flagArr = [false, false, false]
    flagArr[num] = true
    setPm(flagArr)
  }

  const handleExplore = (num) => {
    setExploreNum(num)
  }

  const goScroll = (name) => {
    const element = document.getElementById(name);
    setHrefActive(name)
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
  const onIndexChange = (index) => {
    setRoadIndex(index)
  }
  const arrText = [
    'The Web3 module construction plan was launched, and the development of the BinaX protocol began.',
    'The initial development of the protocol was completed and entered internal testing. At the same time, the construction of the Web3 official website and community media operation began.',
    'The main trading protocol, staking pool protocol, and transaction mining protocol will be completed after internal testing.',
    'BinaX will be officially launched on Arbitrum, and the community media operation plan will begin.',
    'BinaX will be officially launched and put into operation, and the multi-chain deployment plan will be advanced.',
  ]
  const exploreImg = [explore1, explore2, explore3];
  const partnersList = [
    { name: 'Arbitrum', img: arbitrum, showName: true },
    { name: 'Tranching', img: tranching, showName: true },
    { name: 'outer', img: outer, showName: false },
    { name: 'Copycat', img: copycat, showName: true },
    { name: 'Deri', img: deri, showName: true },
    { name: 'PlanetHares', img: planetHares, showName: true },
    { name: 'BEOSIN', img: beosin, showName: true },
    { name: 'oKXwallet', img: oKXwallet, showName: false },
    { name: 'VivaLeva', img: vivaLeva, showName: true },
  ];
  const productMList = [
    {title: 'Peer-to-Pool Options', des: "BinaX offers users a PVP short-term options gaming experience based on smart contracts,with settlements occurring as frequently as every 3 minutes.", src: explore1},
    {title: 'Peer-to-Peer Options', des: "In peer-to-peer model, options are sold by someone who has collateral over the underlying asset, and the option buyer can then buy the option and pay the option seller a premium. Without leverage, the profit can be high or low, the risk is controllable, and the income is timely.", src: explore2},
    {title: 'Perpetual Contracts', des: "BinaX provides lower-cost, deeper and clearer trading with advanced orders and positions, making contract trading easy and simple for every user.", src: explore3},
  ]
  const roadList = [
    {title: 'Q3 2022', desc: arrText[0], piontW: 'b' },
    {title: 'Q4 2022', desc: arrText[1], piontW: 't' },
    {title: 'Q1 2023', desc: arrText[2], piontW: 'b' },
    {title: 'Q3 2023', desc: arrText[3], piontW: 't' },
    {title: 'Q4 2023', desc: arrText[4], piontW: 'b' },
  ]
  return (
    <div className="home-out">
        <div className="home-box">
          <div className="home-banner">
            <div className="header-top">
              <div className="content ">
                <img className="logo" src={logo} alt="binax" />
                <div className="menu-box">
                  <ul className="top-menu">
                    <li className="airport">
                      <Link to={'/airdrop'}>
                        <img src={block} alt="airdrop" />
                        Airdrop
                      </Link>
                    </li>
                    <li onClick={() => goScroll('cryptoIndex')}>
                      <span className={hrefActive === "cryptoIndex" ? 'active' : ''}>Crypto Index</span>
                    </li>
                    <li onClick={() => goScroll('featureHighlights')}>
                      <span className={hrefActive === "featureHighlights" ? 'active' : ''}>Feature Highlights</span>
                    </li>
                    <li onClick={() => goScroll('productMatrix')}>
                      <span className={hrefActive === "productMatrix" ? 'active' : ''}>Product Matrix</span>
                    </li>
                    <li onClick={() => goScroll('roadMap')}>
                      <span className={hrefActive === "roadMap" ? 'active' : ''}>RoadMap</span>
                    </li>
                    <li onClick={() => goScroll('partner')}>
                      <span className={hrefActive === "partner" ? 'active' : ''}>Partners</span>
                    </li>
                    <li onClick={() => goScroll('contactUs')}>
                      <span className={hrefActive === "contactUs" ? 'active' : ''}>Contact Us</span>
                    </li>
                    {/* <li className="content-wallet">
                      <span>Connect Wallet</span>
                    </li> */}
                    <li className="connect-wallet">
                      <ConnectWallet />
                    </li>
                    {/* <li className="launch-app">
                      <span>Launch App</span>
                      <div className="coming-soon" />
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="top-logo">
              <div className="banner-box" >
                <div className="content banner-text">
                  <h2 className="bp-t">BinaX Protocol</h2>
                  <h2 className="mte">Make Trading Easy</h2>
                  <p>A click to start, minutes to earn</p>
                  <div className="more-launch">
                    <div className="out-go-more">
                      <span className="go-more" onClick={() => goScroll('featureHighlights')} >Learn more</span>
                    </div>
                    <Link to='/home' ><span className="launch-app">Launch App</span></Link>
                  </div>
                </div>
                <div className="animation-box">
                  <div className="static-base" />
                  <div className="animate-phone" />
                  <div className="coin-right" />
                  <div className="coin-top" />
                  <div className="coin-left" />
                  <div className="base-top" />
                  <div className="base-left" />
                  <div className="base-right" />
                </div>
              </div>
              <div className="mouse-down">
                <div className="mouse" />
                <div className="down" />
              </div>
            </div>
          </div>
          <div className="crypto-index" id="cryptoIndex">
            <div className="content">
              <span className="cr-name">Crypto Index</span>
              <Marquee className="marquee" pauseOnHover={true} >
                <ul className="crypto-list ">
                  {
                    data.map((item) => {
                      let imgUrl = '';
                      if (item.symbol === 'ETH') { imgUrl = ETH;}
                      if (item.symbol === 'BTC') { imgUrl = BTC;}
                      if (item.symbol === 'UTB') { imgUrl = UTB;}
                      return (
                        <li key={item.symbol}>
                          <img src={imgUrl} alt={item.symbol} />
                          <div>
                            <p className="num">${item.closePrice}</p>
                            <p className="name">{item.symbol}</p>
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </Marquee>
            </div>
          </div>
          <div className="feature-highlights" id="featureHighlights">
            <h1 className=""><span>FEATURE HIGHLIGHTS</span></h1>
            <p className="desc">Smart Contract Based Decentralised Binary 0ptions Protocol</p>
            <div className="feature-outbg">
              <ul className="feature-list content">
                <li className="feature-first">
                  <h3>Short-term Options Game Experience</h3>                      
                  <p>BinaX offers users a PVP short-term options gaming experience based on smart contracts,with settlements occurring as frequently as every 3 minutes.</p>
                </li>
                <li className="feature-two">
                  <h3>Multiple Profit Models</h3>                      
                  <p>BinaX has multiple profit models, allowing users to earn income through trading, staking, governance, and other methods.</p>
                </li>
                <li className="feature-three">
                  <h3>Unlimited Depth</h3>                      
                  <p>Provide users with unlimited depth during trading, users do not need to worry about pin and stop loss settings</p>
                </li>
                <li className="feature-four">
                  <h3>Fair and Just</h3>                      
                  <p>BinaX contracts are executed through smart contract braking, and prices are fed through an Chainlink oracle, ensuring a fair and just process and outcome.</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="product-matrix" id="productMatrix">
            <div className="content pc">
              <div className="left">
                <h2>EXPLORE</h2>
                <div className="proMat">
                  <img src={exploreImg[exploreNum]} alt="" />
                </div>
              </div>
              <div className="right">
                <ul>
                  {
                    productMList.map((item, index) => {
                      return (
                        <li key={`pm-${index}`} className={`${exploreNum === index ? 'active' : ''}`} onMouseOver={() => handleExplore(index)}>
                          <h3>{item.title}</h3>
                          <p>{item.des}</p>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="h5">
              <h2>Product Matrix</h2>
              <Swiper indicator={() => null} slideSize={80} trackOffset={10} loop stuckAtBoundary={false} className="pm-swiper">
                {
                  productMList.map((item, index) => {
                    return (
                      <Swiper.Item key={`sp-${index}`}>
                        <div className="pm-box">
                          <img src={item.src} />
                          <h3>{item.title}</h3>
                          <p>{item.des}</p>
                        </div>
                      </Swiper.Item>
                    )
                  })
                }
              </Swiper>
            </div>
          </div>
          <section className="ecosystem">
            <h2>TOKEN ECOSYSTEM</h2>
            <ul className="content">
              <li>
                <div className="gtb-vtb-img">
                  <img src={gtb} alt="" />
                </div>
                <h3>GTB</h3>
                <p>Governance Token is the platform's utility token, which users can earn in a variety of ways including purchase, trade mining, lottery rewards, referral rewards and more.</p>
                <div className="buy-stake-box">
                  <div className="buy-stake"><span>Buy GTB</span></div>
                  <div className="buy-stake"><span>Stake GTB</span></div>
                </div>
              </li>
              <li>
                <div className="gtb-vtb-img">
                  <img src={vtb} alt="" />
                </div>
                <h3>VTB</h3>
                <p>VeToken is a platform governance token that can be acquired by users by purchasing, staking GTB, and participating in auctions. VTB holders will receive the right to propose governance of the platform.</p>
                <div className="buy-stake-box">
                  <div className="buy-stake"><span>Buy VTB</span></div>
                </div>
              </li>
            </ul>
          </section>
          <section className="road-map" id="roadMap">
            <h1><span>ROADMAP</span></h1>
            <div className="map-bg" >
              <div className="map-line" />
            </div>
            <ul className="road-time content pc">
            {
              roadList.map((item, index) => {
                return (
                  <li className={`road-f${index+1}`} key={`p-${index}`}>
                    {
                      item.piontW === 't' && <div className="point" />
                    }
                    <h2>{item.title}</h2>
                    <p>{item.desc}</p>
                    {
                      item.piontW === 'b' && <div className="point" />
                    }
                  </li>
                )
              })
            }
            </ul>
            <div className="road-time h5">
              <Swiper defaultIndex={roadIndex} indicator={() => null} className="road-swiper" loop 
                autoplayInterval={2000}
                trackOffset={33.3}
                slideSize={33.3}
                stuckAtBoundary={false}
                onIndexChange={(index) => onIndexChange(index)} >
                {
                  roadList.map((item, index) => {
                    return (
                      <Swiper.Item key={`y-${index}`}><div className="year">{item.title}</div></Swiper.Item>
                    )
                  })
                }
              </Swiper>
              <div className="road-desc">
                {roadList[roadIndex].desc}
              </div>
              <div className="line-bg">
                
              </div>
            </div>
          </section>
          <section className="partner-index" id="partner">
            <h1>PARTNERS</h1>
            <div className="content">
              <ul>
                {
                  partnersList.map((item, index) => {
                    return (
                      <li key={index}>
                        <img className={item.name} src={item.img} alt={item.name} />
                        {
                          item.showName && <span>{item.name}</span>
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </section>
          <section className="need-assistance" >
            <div className="content product-pool">
              <div className="pr-ma">
                <h1>NEED ASSISTANCE?</h1>
                <p>Please don’t hesitate to <span>contact us</span> if you have any proposals or difficulties.</p>
                <div className="prma-img" />
              </div>
              <ul className="point-pool ">
                <li 
                  className={`${pm[0] ? 'active' : ''} ppf0`}
                  onMouseOver={() => handleMouseOver(0)}
                  onFocus={() => {}}
                  onBlur={() => {}}
                >
                  <h3>What is BinaX?</h3>
                  <div className="need-des">
                    <p>BinaX is a decentralized binary options protocol based on ZKP(Zero—Knowledge Proof) that allows users to earn returns by predicting market trends. BinaX beta is going to be built on Arbitrum and applies the StarkEx trading engine to achieve low gas and high transaction speed. There are three tokens on BinaX: $UTB, $GTB, and $VTB, for trading, governance, and revenue distribution respectively.</p> 
                  </div>
                </li>
                <li
                  className={`${pm[1] ? 'active' : ''} ppf1`}
                  onMouseOver={() => handleMouseOver(1)}
                  onFocus={() => {}}
                  onBlur={() => {}}
                >
                  <h3>How do I participate in BinaX’s options trading?</h3>
                  <div className="need-des">
                    <p className="steps">To participate in BinaX’s options trading, you need to follow these steps:</p>
                    <p className="li">Transfer funds from your wallet to the smart contract;</p>
                    <p className="li blue">Exchange $UTB by staking assets such as BTC, ETH, USDT, USDC;</p>
                    <p className="li">Choose different trading pairs, directions, amounts, and time frames to place orders with $UTB;</p>
                    <p className="li blue">When the contract expires, BinaX will determine whether the user has won based on the latest price provided by the oracle and automatically settle profits or losses.</p>
                  </div>
                  
                </li>
                <li
                  className={`${pm[2] ? 'active' : ''} ppf2`}
                  onMouseOver={() => handleMouseOver(2)}
                  onFocus={() => {}}
                  onBlur={() => {}}
                >
                  <h3>How do I participate in BinaX’s mining activities?</h3>
                  <div className="need-des">
                    <p className="steps">There are several ways to participate in BinaX’s mining activities:</p>
                    <p className="li">Trading Mining: Users can earn $GTB by trading options on BinaX.</p>
                    <p className="li blue">Liquidity Staking Mining: Users can earn $GTB by adding LP for GTB/ETH pool.</p>
                    <p className="li">Lottery Rewards: Users can earn chances to participate in lottery draws by trading options on BinaX.</p>
                    <p className="li blue">Referral Rewards: Users can earn $GTB by inviting other users to register and use the BinaX Protocol.</p>
                    <p className="li">Staking Mining: Users can earn revenue sharing by staking $UTB, $GTB or $VTB.</p>
                  </div>
                  
                </li>
              </ul>
            </div>
          </section>
          <div id="contactUs">
            <Footer />
          </div>
        </div>
      </div>
  )
}


