// material
import { AppBar, IconButton, Toolbar, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
// router
import { Link } from 'react-router-dom';
// imports
import nav3400rs from "../resources/nav/nav3400rs.png";
import { Pets } from '@mui/icons-material';

export function Navigation() {
  return (
    <AppBar position="static" sx={{backgroundColor: 'black', mb: 3}}>
    <Toolbar variant="dense">
       {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
       <img src={nav3400rs} alt="Logo" />
        </IconButton>  */}
        <Grid container sx={{width: '100%'}}>
            <Grid size={{xs: 12, md: 5}} sx={{alignContent: 'center', textAlign: 'center'}}>
            </Grid>
            <Grid size={{xs: 12, md: 2}} sx={{alignContent: 'center', textAlign: 'center', mt: 2, mb: 2}}>
                <Link to="/" className='navLink'>
                    <img src={nav3400rs} alt="Logo" width="100px" />
                </Link>
            </Grid>
            <Grid size={{xs: 12, md: 5}}sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Tooltip title="Pet List Generator">
                        <IconButton color="inherit" aria-label="menu">
                            <Link to="/pet-gen" className='navLink'>
                                <Pets />
                            </Link>
                        </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    </Toolbar>
    </AppBar>
  );
}
