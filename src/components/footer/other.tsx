import logo from '@/assets/img/airdrop/logo.png'
import './other-pc.scss'
const OtherFooter = () => {
  return (
    <div className='airdrop-footer'>
      <img className='binx' src={logo} alt="" />
      <ul className="media-list">
        <li className="twitter"><a target="_blank" rel="noopener noreferrer" href="https://twitter.com/BinaX_Protocol">1</a></li>
        {/* <li className="telegram"><a target="_blank" rel="noopener noreferrer" href="https://t.me/+JMvGl388oyUxNzE1">1</a></li> */}
        <li className="discord"><a target="_blank" href="https://discord.com/invite/guQnMWhGQf" rel="noopener noreferrer">1</a></li>
        <li className="m"><a target="_blank" rel="noopener noreferrer" href="https://medium.com/@BinaX_Protocol">1</a></li>
        <li className="github"><a target="_blank" rel="noopener noreferrer" href="https://github.com/Binaxio">1</a></li>
        {/* <li className="youtube">
          // https://www.youtube.com/@binax.finance/featured
          <a target="_blank" rel="noopener noreferrer" href="">1</a>
        </li> */}
      </ul>
    </div>
  )
}

export default OtherFooter;