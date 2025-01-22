import { Sidebar, Menu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import nav3400rs from "../resources/nav/nav3400rs.png";
import { Home, Pets } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import './Navigation.css';

export function Navigation() {
  const [collapsed,] = React.useState(true);
  const [toggled, setToggled] = React.useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'block' }}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint="md"
        backgroundColor={'#141316'}
        rootStyles={{
          borderColor: '#171719',
          height: '100vh',
          position: 'sticky', top: 0, zIndex: 1
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box style={{ marginBottom: '10px', marginTop: '16px', marginLeft: '10px', marginRight: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={nav3400rs} alt="icon" />
            </div>
            <div className="nav-space-divider" />
          </Box>
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <Menu className='menu'>
              <Link to="/" >
                <Box className={`menu-box ${location.pathname === '/' ? 'active' : ''}`}>
                  <Home className="menu-item"/>
                </Box>
              </Link>
              <Link to="/pet-gen" >
                <Box className={`menu-box ${location.pathname === '/pet-gen' ? 'active' : ''}`}>
                  <Pets className="menu-item"/>
                </Box>
              </Link>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
