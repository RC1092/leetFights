'use strict';
import React from 'react';
import Countdown from 'react-countdown';
import Logo from './Logo2.jpg';
import './topbar.css';
const Topbar = ({state}) => {
    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed message
          return <span>Time's up!</span>;
        } else {
          // Render the countdown timer with only minutes and seconds
          return (
            <span>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          );
        }
      };
    return (
        <div className="topbar">
            <img src={Logo} alt='LOGO' ></img>
            <Countdown date={state == null ? Date.now() + 300000 : Date.now()} renderer={renderer}/>,
        </div>
    );
};

export default Topbar;
