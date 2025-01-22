import { Sidebar, Menu } from 'react-pro-sidebar';
// router
import { Link } from 'react-router-dom';
// imports
import nav3400rs from "../resources/nav/nav3400rs.png";
import { Home, Pets } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import './Navigation.css';

export function Navigation() {
    const [collapsed,] = React.useState(true);
    const [toggled, setToggled] = React.useState(false);

  return (
    <div style={{ display: 'block', position: 'sticky', top: '0', direction: 'ltr' }}>
        <Sidebar
            collapsed={collapsed}
            toggled={toggled}
            onBackdropClick={() => setToggled(false)}
            breakPoint="md"
            backgroundColor={'#141316'}
            rootStyles={{
              borderColor: '#171719',
              height: '100vh'
            }}
        >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box style={{ marginBottom: '10px', marginTop: '16px', marginLeft: '10px', marginRight: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={nav3400rs} alt="icon"/>
            </div>
            <div className="nav-space-divider" />
          </Box>
          <div style={{ flex: 1, marginBottom: '32px' }} >
            <Menu className='menu'>
              <Box className="menu-box">
                <Link to="/" className="menu-item">
                  <Home />
                </Link>
              </Box>
              <Box className="menu-box">
                <Link to="/pet-gen" className="menu-item">
                  <Pets />
                </Link>
              </Box>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
