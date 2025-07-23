import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import goldTrophy from '../resources/pets/assets/gold.png';
import silverTrophy from '../resources/pets/assets/silver.png';
import bronzeTrophy from '../resources/pets/assets/bronze.png';
import * as InvyPet from '../resources/pets/inv';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

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
  totalPets: number;
  totalHours: number;
  petCounts: { [key: string]: PetCountResponse };
}

const trophyImages = [goldTrophy, silverTrophy, bronzeTrophy];

export default function PetLeaderboard({ totalPets, totalHours, petCounts }: PetLeaderboardProps) {
  const topThree = Object.values(petCounts).sort((a, b) => a.rank - b.rank).slice(0, 3);
  const remaining = Object.values(petCounts).sort((a, b) => a.rank - b.rank).slice(3);

  const getMissingPets = (pets: PetData) => {
    return Object.keys(pets).filter(petName => !pets[petName]);
  };

  const renderMissingPets = (missingPets: string[]) => {
    return missingPets.map(petName => {
      const formatPetName = (name: string) => {
        return name.replace(/['-.]/g, '').replace(/\b\w/g, char => char.toUpperCase()).replace(/\s+/g, '');
      };
      const petImage = InvyPet[formatPetName(petName) as keyof typeof InvyPet];
      return <img key={petName} src={petImage} alt={petName} style={{  height: '30px', marginRight: '5px' }} />;
    });
  };

  return (
    <Box className="leaderboard-container" sx={{ p: 2, flexGrow: 1}}>
      <Grid container spacing={2}>
        {topThree.length > 1 && topThree.map((petCount, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ backgroundColor: '#1b1a1d', padding: 2, borderRadius: 2, position: 'relative', height: '250px' }}>
              <Typography variant="h4" sx={{ position: 'absolute', top: 14, left: 12 }}>
                {petCount.rank}. {petCount.player}
              </Typography>
              <img src={trophyImages[index]} alt="trophy" style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', zIndex: '0' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, zIndex: '99' }}>
                <div style={{ height: "80px", width: "80px" }}>
                    <CircularProgressbar 
                    value={petCount.pet_count / totalPets} 
                    maxValue={1} 
                    text={`${petCount.pet_count} / ${totalPets}`} 
                    styles={buildStyles({
                    strokeLinecap: 'round',
                    pathTransitionDuration: 3,

                    // Colors
                    pathColor: `green`,
                    textColor: 'green',
                    trailColor: '#181818',
                    })}/>
                    <Typography variant="body2" sx={{textAlign: 'center'}}>Pet Count</Typography>
                </div>  
                <Typography variant="body2" sx={{ display: 'flex', textAlign: 'center', alignItems: 'flex-end' }}>
                  {totalPets - petCount.pet_count} missing
                </Typography>
                <div style={{ height: "80px", width: "80px" }}>
                    <CircularProgressbar 
                    value={petCount.pet_hours / totalHours} 
                    maxValue={1} 
                    text={`${petCount.pet_hours}h`}
                    styles={buildStyles({
                        strokeLinecap: 'round',
                        pathTransitionDuration: 3,

                        // Colors
                        pathColor: `red`,
                        textColor: 'red',
                        trailColor: '#181818',
                    })}
                    />
                    <Typography variant="body2" sx={{textAlign: 'center'}}>Pet Hours</Typography>
                </div>

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
                <TableCell align="center" sx={{ color: '#76767a', width: '45px'}}>Rank</TableCell>
                <TableCell sx={{ color: '#76767a', width: '50px'}}>RSN</TableCell>
                <TableCell sx={{ color: '#76767a', width: '45px'}}>Pets</TableCell>
                <TableCell sx={{ color: '#76767a', width: '45px'}}>Missing</TableCell>
                <TableCell sx={{ color: '#76767a', width: '350px'}}>Missing Pets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: '#1b1a1d', color: '#d6d6d8', borderColor: '#29282b' }}>
              {remaining.map((petCount) => (
                <TableRow key={petCount.rank}>
                  <TableCell align="center" sx={{color: '#d6d6d8'}}>{petCount.rank}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{petCount.player}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{petCount.pet_count}</TableCell>
                  <TableCell sx={{color: '#d6d6d8'}}>{62 - petCount.pet_count}</TableCell>
                  <TableCell sx={{ color: '#d6d6d8', width: 'fill', display: 'flex', overflowX: 'scroll' }}>
                    {renderMissingPets(getMissingPets(petCount.pets))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}