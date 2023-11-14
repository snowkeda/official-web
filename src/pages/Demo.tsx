import { useEffect } from 'react';
import { Link, withRouter, setLocale, connect, FormattedMessage, getAllLocales, useIntl, getIntl  } from 'umi';

function Demo(props: any) {
  console.log(props)
  const intl  = useIntl();
  const { messages } = getIntl();
  console.log(messages)
  const handleClick = () => {
    props.dispatch({
      type: 'demo/appStatusChangeFunc',
      payload: {
          brokerId: 2,
          type: 4,
          assetId: 30,
      }
    })
  }
  const setLang = () => {
    setLocale('en-US', false);
  }
  return (
    <div>
      <div><FormattedMessage id="welcome"  values={{ name1: '张三' }}  /></div>
      {/* <div>{messages.table.first}</div> */}
      {/* <div><FormattedMessage id="table.first" values={{ name: '张三' }} /></div> */}
      <h1 >Count {props.demo.num}</h1>
     <button
          onClick={handleClick}
      >
        Add
      </button>
      <button onClick={setLang}> set lang</button>
      <Link to="/" >home</Link>
    </div>
  );
}

export default connect(({demo}) => {
  return {demo}
})(withRouter(Demo))
