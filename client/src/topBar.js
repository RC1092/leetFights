import React from 'react';
import Logo from './Logo2.jpg';
import './topbar.css';
const Topbar = () => {
    return (
        <div className="topbar">
            <img src={Logo} alt='LOGO' ></img>
        </div>
    );
};

export default Topbar;
