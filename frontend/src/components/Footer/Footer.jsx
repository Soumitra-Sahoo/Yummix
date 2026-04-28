import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Swad ka safar, ek click ke sath! Order now & treat your taste buds!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>About Us</h2>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/delivery">Delivery</Link></li>
            <li><Link to="/partner">Partner With Us</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Support & Assistance</h2>
            <ul>
                <li>+91-000000000</li>
                <li>support@yummix.com</li>
                <li>Live Chat</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © Yummix.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
