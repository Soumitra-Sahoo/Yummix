import React, { useState, useEffect } from 'react';
import './Header.css';

import banner1 from '../../assets/header_img.png';
import banner2 from '../../assets/banner.png';
import banner3 from '../../assets/burger.png';

const Header = () => {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  const banners = [
    { image: banner1, showText: true },
    { image: banner2, showText: false },
    { image: banner3, showText: false }
  ];

  
  const slides = [...banners, banners[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    if (current === banners.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 700); 

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }
  }, [current]);

  return (
    <div className="header">
      <div
        className="slider-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transition ? 'transform 0.7s ease-in-out' : 'none'
        }}
      >
        {slides.map((banner, index) => (
          <div
            key={index}
            className="slide"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            {banner.showText && index !== banners.length && (
              <div className="header-contents">
                <h2>Yummy Bites, Anytime, Anywhere</h2>
                <p>
                  Get your favorite meals delivered fast with our food delivery app!
                </p>
                <button>View Menu</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={current % banners.length === index ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;