import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sidebar,MenuItem } from 'react-pro-sidebar';

const SideBar = () => {
    return (
        <div className="sidebar">
            <Sidebar
            collapsed = 'true'
            backgroundColor='red'
            width = '250px'
            collapsedWidth='100px'
            ><Menu>
                <MenuItem >Profile
                </MenuItem>
                </Menu>
                </Sidebar>
        </div>
    );
};

export default SideBar;
