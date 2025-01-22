// routes
import { Box } from '@mui/material';
import {Navigation} from './components/Navigation';
import Home from './pages/Home';
import Pets from './pages/Pets';
// theme
import GlobalStyles from './theme/globalStyles';
// components
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Box sx={{display: 'flex'}}>
      <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="pet-gen" element={<Pets />} />
        </Routes>
      </Box>
    </>
  );
}
