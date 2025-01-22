import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import goldTrophy from '../resources/pets/assets/gold.png';
import silverTrophy from '../resources/pets/assets/silver.png';
import bronzeTrophy from '../resources/pets/assets/bronze.png';

interface PetData {
  [key: string]: number;
}

interface PetCountResponse {
  pet_count: number;
  pet_hours: number;
  pets: PetData;
  player: string | number;
  rank: number;
}

interface PetLeaderboardProps {
  petCounts: { [key: string]: PetCountResponse };
}

const trophyImages = [goldTrophy, silverTrophy, bronzeTrophy];

export default function PetLeaderboard({ petCounts }: PetLeaderboardProps) {
  const topThree = Object.values(petCounts).sort((a, b) => a.rank - b.rank).slice(0, 3);
  const remaining = Object.values(petCounts).sort((a, b) => a.rank - b.rank).slice(3);

  return (
    <Box className="leaderboard-container" sx={{ p: 2, flexGrow: 1}}>
      <Grid container spacing={2}>
        {topThree.length > 1 && topThree.map((petCount, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ backgroundColor: '#1b1a1d', padding: 2, borderRadius: 2, position: 'relative' }}>
              <Typography variant="h6" sx={{ position: 'absolute', top: 8, left: 8 }}>
                {petCount.rank}
              </Typography>
              <img src={trophyImages[index]} alt="trophy" style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', zIndex: '0' }} />
              <Typography variant="h4" sx={{ textAlign: 'center', marginTop: 4, zIndex: '99' }}>
                {petCount.player}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, zIndex: '99' }}>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {petCount.pet_count} / 62
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {petCount.pet_hours} hours
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {62 - petCount.pet_count} missing
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#242328' }}>
              <TableRow>
                <TableCell align="center" sx={{ color: '#76767a'}}>Rank</TableCell>
                <TableCell sx={{ color: '#76767a'}}>RSN</TableCell>
                <TableCell sx={{ color: '#76767a'}}>Pets</TableCell>
                <TableCell sx={{ color: '#76767a'}}>Missing</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: '#1b1a1d', color: '#d6d6d8', borderColor: '#29282b' }}>
              {remaining.map((petCount) => (
                <TableRow key={petCount.rank}>
                  <TableCell align="center" sx={{color: '#d6d6d8'}}>{petCount.rank}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{petCount.player}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{petCount.pet_count}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{62 - petCount.pet_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}