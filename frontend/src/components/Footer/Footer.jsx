import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

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
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Partner With Us</li>
                <li>Feedback</li>  
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Support & Assistance</h2>
            <ul>
                <li>+91-000000000</li>
                <li>contact@yummix.com</li>
                <li>Live Chat</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Yummix.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
