import React from "react";
import { isH5 } from '@/utils';
import footerLogo from '@/assets/img/homeNew/footer-logo.png'
import './index-pc.scss'
import './index-h5.scss'

export default class Index extends React.PureComponent {
  render() {
    return (
      <div className="footer-out">
        <div className="footer-box content">
          <div className="make-easy">
            <img className="footer-logo" src={footerLogo} alt="" /> 
            <p>A click to start, a minute to earn</p>
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
            <div className="mail-box">support@binax.io</div>
            {/* <div className="copyright">
              Copyright<span>©</span>BinaX 2023
            </div> */}
          </div>
          <div className="footer-ul">
            <ul className="about-support">
              <li className="top-title">About</li>
              <li><span href="/#">What's Binax</span></li>
              <li><span href="/#">Product Matrix</span></li>
              <li><span href="/#">Economic Model</span></li>
              <li><span href="/#">Operating Mechanism</span></li>
              <li><span href="/#">Contact Us</span></li>
            </ul>
            <ul className="about-support">
              <li className="top-title">Support</li>
              <li><span href="/#">Terms & Conditions</span></li>
              <li><span href="/#">Privacy Policy</span></li>
              <li><span href="/#">Docs</span></li>
            </ul>
          </div>
        </div>
        <p className="copyright">Copyright<span>©</span>BinaX 2023</p>
      </div>
    )
  }
}
