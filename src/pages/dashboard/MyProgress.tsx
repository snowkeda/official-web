import { useState, useEffect } from 'react'
import { Progress } from 'antd'

const MyProgress = (props) => {
  const { percent } = props;
  const [myPercent, setMyPercent] = useState(0)
  useEffect(() => {
    if (myPercent < percent) {
      const timer = setInterval(() => {
        if (myPercent+1 > percent) {
          setMyPercent(percent)
        } else {
          setMyPercent(myPercent+1)
        }
      }, 100)
      return () => clearInterval(timer);
    }
  }, [myPercent])
  
  return (
    <Progress 
      type="circle" 
      percent={myPercent} 
      size={120} 
      strokeColor={"#0275F5"} 
      trailColor={"#0D1517"}  
      strokeWidth={6}
      status='normal'
      format={(number) => (
        <>
          <h3>{number}%</h3>
          <p>Utilization</p>
        </>
      )} 
    />
  )
}

export default MyProgress;