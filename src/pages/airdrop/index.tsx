import React, { useState, useRef, useEffect, Fragment } from 'react';
import moment from 'moment';
import HeaderBox from "@/components/HeaderBox/index"
import OtherFooter from "@/components/footer/other"
import swapping from '@/assets/img/airdrop/swapping.png'
import trading from '@/assets/img/airdrop/trading.png'
import referral from '@/assets/img/airdrop/referral.png'
import community from '@/assets/img/airdrop/community.png'
import ball from '@/assets/img/airdrop/ball.png'
import gift from '@/assets/img/airdrop/gift.png'
import plaball from '@/assets/img/airdrop/plaball.png'
import logo from '@/assets/img/airdrop/logo.png'
import './index-pc.scss'

export default () => {
  const [current, setTime] = useState("0-0-0-0");
  const timerID: any = useRef();
  
  const deadLine= moment('2023-12-12 23:59:59');
  const deadLineTime = deadLine.diff(moment())
  let durationTime = moment.duration(deadLineTime);
  let isArrived =  deadLineTime < 0;
  
  useEffect(() => {
    timerID.current = setInterval(() => {
      let arriveTime = `${parseInt(durationTime.asDays().toString())}-${durationTime.hours()}-${durationTime.minutes()}-${durationTime.seconds()}`;
      if (!isArrived) {
        durationTime = moment.duration(deadLine.diff(moment()));
        setTime(arriveTime); // make pretty
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (isArrived) {
      clearInterval(timerID.current);
    }
  });
  const timeList = current.split("-");
  const timeLabel = ['Days', 'Hours', 'Minutes', 'Seconds'];
  const earnList = [
    {title: 'Add Liquidity', num: '01', desc: 'The smart way of any airdrop enthusiast! UTB holders will seize the opportunity to earn airdrop. Earned through swapping your digital assets now!', icon: swapping},
    {title: 'Trading', num: '02', desc: 'Traders are the architects of the exchange. Build solid markets with your intelligence and strategies at BinaX!', icon: trading},
    {title: 'Referral', num: '03', desc: `We appreciate promoters' efforts as a bridge between BinaX and more users. Be a star and attract more attention to winning the airdrop!`, icon: referral},
    {title: 'Community Building', num: '04', desc: `We wouldn't be anywhere without passion and suggestions! Join the community and share your opinion with us.`, icon: community},
  ]
  return (
    <>
      <HeaderBox />
      <div className="airdrop-box">
        <div className="campaign">
          <div className="box">
            <h1>BinaX Season 1</h1>
            <div className="slash" />
            <h2>Airdrop Campaign</h2>
            <p className="desc">To commemorate the launch of BinaX Beta, we will be holding an airdrop campaign.</p>
            <div className="block" />
            <p className="desc-r">Rewards will be exclusively for BinaX beta users, with allocation retroactively determined based on interactions with BinaX Protocol.</p>
            <div className="time-box">
              <ul>
                {
                  timeLabel.map((item, index) => {
                    return (
                      <Fragment key={item}>
                        <li>
                          <p>{timeList[index].length === 1 ? `0${timeList[index]}` : timeList[index]}</p>
                          <p>{item}</p>
                        </li>
                        <li className='dot'><div>:</div></li>
                      </Fragment>
                    )
                  })
                }
              </ul>
            </div>
            <div className='gift-box'>
              <img src={ball} alt="" className='ball'/>
              <img src={plaball} alt="" className='plaball' />
              <img src={gift} alt="" className='gift' />
            </div>
          </div>
        </div>
        <section className='how-airdrop'>
          <h1>How to Earn BinaX Airdrop?</h1>
          <p>Airdrop can be earned through several methods: swapping, trading, referral, and community building.</p>
          <ul>
            {
              earnList.map((item) => {
                return (
                  <li key={item.title} >
                    <img src={item.icon} alt={item.title} />
                    <h1>{item.title}</h1>
                    <span>{item.num}</span>
                    <p>{item.desc}</p>
                  </li>
                )
              })
            }
          </ul>
          <div className='note'>
          Note: Airdrop will be distributed at random, however different elements will represent different benefits. Each user can obtain a maximum of 4 airdrops.
          </div>
        </section>
        <OtherFooter />
      </div>
    </>
  )
}