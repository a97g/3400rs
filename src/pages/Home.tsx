/* eslint-disable react/react-in-jsx-scope */
import { Container, Typography, 
  // Grid, Card, CardContent, CardActions, Button 
} from '@mui/material';
import Page from '../components/Page';

export default function Home() {
  // const pages = [
  //   { title: 'Pet List Generator', description: 'Generate and customize your pet list.', link: '/pet-gen' },
  //   { title: 'Leaderboard', description: 'View the leaderboard for pet counts.', link: '/leaderboard' },
  //   { title: 'Ascii Generator', description: 'Generate ASCII tables for your pets.', link: '/ascii-generator' },
  //   // Add more pages as needed
  // ];

  return (
    <Page title="Home | 34rs" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Home
        </Typography>
        {/* <Grid container spacing={4}>
          {pages.map((page, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {page.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {page.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" href={page.link}>Go to {page.title}</Button>
                </CardActions>
              </Card>
            </Grid>
          ))} 
        </Grid> */}
      </Container>
    </Page>
  );
}
