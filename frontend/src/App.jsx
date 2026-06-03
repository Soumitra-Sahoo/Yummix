import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import About from "./pages/About/About";
import Delivery from "./pages/About/Delivery";
import Partner from "./pages/About/Partner";
import Feedback from "./pages/About/Feedback";
import Privacy from "./pages/About/Privacy";
import Terms from "./pages/About/Terms";
import ScrollToTop from "./components/ScrollToTop";
import Restaurant from "./pages/Restaurant/Restaurant";
import QuickCheckout from "./components/QuickCheckout/QuickCheckout";
import "./App.css";

const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
    <ScrollToTop />
    <ToastContainer/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
     <div className="app-layout">
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} setSearchQuery={setSearchQuery} />
        <QuickCheckout />
        <Routes>
          <Route path='/' element={<Home searchQuery={searchQuery}  />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/order' element={<PlaceOrder />}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/verify' element={<Verify />}/>
          <Route path="/about" element={<About />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Routes>
      </div>
      <Footer />
      </div>
    </>
  )
}

export default App
