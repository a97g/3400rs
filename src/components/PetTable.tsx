import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import * as InvyPet from '../resources/pets/inv';
import * as DetailedPet from '../resources/pets/detailed';

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

interface PetTableProps {
  petCounts: { [key: string]: PetCountResponse };
  isGroup: boolean;
  missingMode: boolean;
  detailedMode: boolean;
}

export default function PetTable({ petCounts, isGroup, missingMode, detailedMode }: PetTableProps) {
    const totalPets = 62;
    const totalHours = 5270;

  const getPetIconClass = (petName: string, pets: PetData) => {
    return Object.entries(pets).find(([name, count]) => name === petName && count === 1)
    ? 'obtained-pet-icon':'pet-icon';
  };

  const renderPetBox = (petName: string, pets: PetData) => {
    const petIconClass = getPetIconClass(petName, pets);
    if (missingMode && petIconClass === 'obtained-pet-icon') {
      return null;
    }
    const formatPetName = (name: string) => {
        return name.replace(/['-.]/g, '').replace(/\b\w/g, char => char.toUpperCase()).replace(/\s+/g, '');
      };
    const petImage = detailedMode ? DetailedPet[formatPetName(petName) as keyof typeof DetailedPet] : InvyPet[formatPetName(petName) as keyof typeof InvyPet];


    console.log(formatPetName(petName));

    return (
      <Box className={petIconClass}>
        <img src={petImage} alt={petName} className={detailedMode ? 'detailed-pet-image' : undefined} />
      </Box>
    );
  };

  return (
    <Box sx={{ p: '24px'}}>
    {Object.keys(petCounts).length > 0 && (
      Object.entries(petCounts).map(([key, petCount]) => (
        <div key={key}>
        {isGroup && <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{petCount.player}</Typography>}

        <Grid container>
          <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'center'}}>
          <Box sx={{display: 'flex'}}>
            <div style={{ height: "160px", width: "120px" }}>
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
              <Typography variant="h6" sx={{textAlign: 'center'}}>Pet Count</Typography>
            </div>
          </Box>
          </Grid>

          {!isGroup && (
          <Grid size={{xs: 4}} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{petCount.player}</Typography>
          </Grid>
          )}

          {isGroup && Object.keys(petCounts).length > 1 && (
          <Grid size={{xs: 4}} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{display: 'flex'}}>
              <div style={{ height: "160px", width: "120px" }}>
                <CircularProgressbar 
                value={petCount.rank / Object.keys(petCounts).length }
                maxValue={1}
                text={`${petCount.rank}`}
                styles={buildStyles({
                  strokeLinecap: 'round',
                  pathTransitionDuration: 3,

                  // Colors
                  pathColor: `grey`,
                  textColor: 'grey',
                  trailColor: '#181818',
                })} />
              <Typography variant="h6" sx={{textAlign: 'center'}}>Group Rank</Typography>
              </div>
            </Box>
          </Grid>
          )}

          <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'center'}}>
          <Box sx={{display: 'flex'}}>
            <div style={{ height: "160px", width: "120px" }}>
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
              <Typography variant="h6" sx={{textAlign: 'center'}}>Pet Hours</Typography>
            </div>
          </Box>
          </Grid>
          </Grid>

          <Grid container className="pet-container">
          <Grid sx={{pl: 2}}>
            <Box sx={{display: 'flex'}}> 
              <Typography className="pet-category-title">Group</Typography>
              <div className="space-divider" />
            </Box>
            <Box className="pet-grid">
              {renderPetBox("Baby mole", petCount.pets)}
              {renderPetBox("Prince black dragon", petCount.pets)}
              {renderPetBox("Kalphite princess", petCount.pets)}
              {renderPetBox("Pet dark core", petCount.pets)}
              {renderPetBox("Sraracha", petCount.pets)}
              {renderPetBox("Little nightmare", petCount.pets)}
              {renderPetBox("Scurry", petCount.pets)}
              {renderPetBox("Huberte", petCount.pets)}
            </Box>
          </Grid>

          <Grid sx={{pl: 2, pr: 3}}>
            <Box sx={{display: 'flex'}}> 
              <Typography className="pet-category-title">Skilling</Typography>
              <div className="space-divider" />
            </Box>
              <Box className="pet-grid">
                {renderPetBox("Rift guardian", petCount.pets)}
                {renderPetBox("Beaver", petCount.pets)}
                {renderPetBox("Rock golem", petCount.pets)}
                {renderPetBox("Baby chinchompa", petCount.pets)}
                {renderPetBox("Rocky", petCount.pets)}
                {renderPetBox("Tangleroot", petCount.pets)}
                {renderPetBox("Heron", petCount.pets)}
                {renderPetBox("Giant squirrel", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{pl: 2, mt: 3}}>
            <Box sx={{display: 'flex'}}> 
              <Typography className="pet-category-title">GWD</Typography>
              <div className="space-divider" />
            </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet kree'arra", petCount.pets)}
                {renderPetBox("Pet general graardor", petCount.pets)}
                {renderPetBox("Pet k'ril tsutsaroth", petCount.pets)}
                {renderPetBox("Pet zilyana", petCount.pets)}
                {renderPetBox("Nexling", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3, pl: 2}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">DKS</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet dagannoth rex", petCount.pets)}
                {renderPetBox("Pet dagannoth prime", petCount.pets)}
                {renderPetBox("Pet dagannoth supreme", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3, pl: 2}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Slayer</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet smoke devil", petCount.pets)}
                {renderPetBox("Pet kraken", petCount.pets)}
                {renderPetBox("Hellpuppy", petCount.pets)}
                {renderPetBox("Abyssal orphan", petCount.pets)}
                {renderPetBox("Noon", petCount.pets)}
                {renderPetBox("Ikkle hydra", petCount.pets)}
                {renderPetBox("Nid", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Quest</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Vorki", petCount.pets)}
                {renderPetBox("Muphin", petCount.pets)}
                {renderPetBox("Wisp", petCount.pets)}
                {renderPetBox("Butch", petCount.pets)}
                {renderPetBox("Baron", petCount.pets)}
                {renderPetBox("Lil'viathan", petCount.pets)}
                {renderPetBox("Moxi", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">PvM Minigame</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Tzrek-jad", petCount.pets)}
                {renderPetBox("Jal-nib-rek", petCount.pets)}
                {renderPetBox("Youngllef", petCount.pets)}
                {renderPetBox("Lil' creator", petCount.pets)}
                {renderPetBox("Smol Heredit", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Wilderness</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet chaos elemental", petCount.pets)}
                {renderPetBox("Venenatis spiderling", petCount.pets)}
                {renderPetBox("Callisto cub", petCount.pets)}
                {renderPetBox("Vet'ion jr. ", petCount.pets)}
                {renderPetBox("Scorpia's offspring", petCount.pets)}
              </Box>
            </Grid>

            <Grid container sx={{justifyContent: 'space-around', width: '100%'}}>
            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Raids</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Olmlet", petCount.pets)}
                {renderPetBox("Lil' zik", petCount.pets)}
                {renderPetBox("Tumeken's guardian", petCount.pets)}
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Skilling Minigames</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet penance queen", petCount.pets)}
                {renderPetBox("Phoenix", petCount.pets)}
                {renderPetBox("Smolcano", petCount.pets)}
                {renderPetBox("Tiny tempor", petCount.pets)}
                {renderPetBox("Abyssal protector", petCount.pets)}
              </Box>
            </Grid>

            <Grid  sx={{mt: 3}}>
              <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Miscellaneous</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
                {renderPetBox("Pet snakeling", petCount.pets)}
                {renderPetBox("Chompy chick", petCount.pets)}
                {renderPetBox("Skotos", petCount.pets)}
                {renderPetBox("Herbi", petCount.pets)}
                {renderPetBox("Bloodhound", petCount.pets)}
                {renderPetBox("Quetzin", petCount.pets)}
              </Box>
            </Grid>     
        </Grid>
        </Grid>
        </div>
      ))
    )}
  </Box>
  );
}
