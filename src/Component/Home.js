import React from 'react';
import Header from './Header';
import logo from '../assets/slider-image1.jpg';



function Home() {
  return (
    <div>
      <Header />
      <div>
          <img className='img' src={logo} alt="Image1" />    
        </div>
     
    </div>
  );
}

export default Home;
