/* eslint-disable react/react-in-jsx-scope */
// material
import { Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';

export default function Home() {
  return (
    <Page title="Home | 34rs" sx={{display: 'flex', flexDirection: 'column'}}>
      <Container maxWidth={'lg'} sx={{height: '3000px'}}>
        <Typography variant="h3" component="h1" className='title'>
          Home
        </Typography>
        <Typography gutterBottom>
          Home Text
        </Typography>
      </Container>
    </Page>
  );
}
