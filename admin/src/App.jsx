import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [token,setToken] = useState(
    localStorage.getItem("adminToken") || ""
  )

  if(!token){
    return (
      <>
        <ToastContainer/>
        <Login setToken={setToken}/>
      </>
    )
  }

  return (
    <div className='app'>

      <ToastContainer/>

      <Navbar setToken={setToken}/>

      <hr />

      <div className="app-content">

        <Sidebar/>

        <Routes>
          <Route path="/add" element={<Add/>}/>
          <Route path="/list" element={<List/>}/>
          <Route path="/orders" element={<Orders/>}/>
        </Routes>

      </div>
    </div>
  )
}

export default App