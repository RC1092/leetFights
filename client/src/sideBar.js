import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from 'react-pro-sidebar';

const SideBar = () => {
    return (
        <div className="sidebar">
            <Sidebar
            backgroundColor='white'
            ></Sidebar>
        </div>
    );
};

export default SideBar;
