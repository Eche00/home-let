import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <div className='footer'>
           <div className='pc-footer'> This is footer for pc</div>
           <div className='mob-footer'> This is footer for mobile</div>
        </div>
    );
}

export default Footer;
