import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ setToken }) => {

  const logout = ()=>{

    localStorage.removeItem("adminToken")

    setToken("")
  }

  return (
    <div className='navbar'>

      <img className='logo' src={assets.logo} alt="" />

      <div className='navbar-right'>

        <img className='profile' src={assets.profile_image} alt="" />

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  )
}

export default Navbar