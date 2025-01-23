import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
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
  combinedMissing: boolean;
  manualMode: boolean;
}

export default function PetTable({ petCounts, isGroup, missingMode, detailedMode, combinedMissing, manualMode }: PetTableProps) {
  const totalPets = 62;
  const totalHours = 5270;
  const [manualPets, setManualPets] = useState<PetCountResponse>({
    pet_count: 0,
    pet_hours: 0,
    pets: {},
    player: '',
    rank: 0
  });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (manualMode) {
      const allPets: PetData = {};
      Object.keys(InvyPet).forEach(petName => {
        allPets[petName] = 0;
      });
      setManualPets(prevState => ({
        ...prevState,
        pets: allPets
      }));
    }
  }, [manualMode]);

  const getPetIconClass = (petName: string, pets: PetData) => {
    if (manualMode) {
      return manualPets.pets[petName] ? 'obtained-pet-icon' : 'pet-icon';
    }
    return Object.entries(pets).find(([name, count]) => name === petName && count === 1)
      ? 'obtained-pet-icon'
      : 'pet-icon';
  };

  const handlePetClick = (petName: string) => {
    setManualPets(prevState => ({
      ...prevState,
      pets: {
        ...prevState.pets,
        [petName]: prevState.pets[petName] ? 0 : 1
      },
      pet_count: Object.values(prevState.pets).filter(count => count === 1).length + (prevState.pets[petName] ? -1 : 1)
    }));
  };

  const handleConfirm = () => {
    setConfirmed(true);
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
    return (
      <Box className={petIconClass} onClick={() => manualMode && handlePetClick(petName)}>
        <img src={petImage} alt={petName} className={detailedMode ? 'detailed-pet-image' : undefined} />
      </Box>
    );
  };

  const renderPetGrid = (category: string, petNames: string[], pets: PetData) => {
    const visiblePets = petNames.map(petName => renderPetBox(petName, pets)).filter(petBox => petBox !== null);
    if (missingMode && visiblePets.length === 0) {
      return null;
    }
    return (
      <Grid sx={{pl: 2, pr: 3, pb: 1.5, pt: 1.5}}>
        <Box sx={{display: 'flex'}}> 
          <Typography className="pet-category-title">{category}</Typography>
          <div className="space-divider" />
        </Box>
        <Box className="pet-grid">
          {visiblePets}
        </Box>
      </Grid>
    );
  };

  const renderMissingPets = (pets: PetData) => {
    const missingPets = Object.keys(pets).filter(petName => getPetIconClass(petName, pets) === 'pet-icon');
    if (missingPets.length === 0) {
      return null;
    }
    return renderPetGrid("Missing Pets", missingPets, pets);
  };

  const renderObtainedPets = (category: string, petNames: string[], pets: PetData) => {
    const obtainedPets = petNames.filter(petName => getPetIconClass(petName, pets) === 'obtained-pet-icon');
    if (obtainedPets.length === 0) {
      return null;
    }
    return renderPetGrid(category, obtainedPets, pets);
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
              value={manualMode ? manualPets.pet_count / totalPets : petCount.pet_count / totalPets} 
              maxValue={1} 
              text={`${manualMode ? manualPets.pet_count : petCount.pet_count} / ${totalPets}`} 
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

          {isGroup && (
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
            {manualMode && missingMode && combinedMissing ? (
              renderMissingPets(manualPets.pets)
            ) : manualMode && combinedMissing ? (
              <>
                {renderObtainedPets("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte"], manualPets.pets)}
                {renderObtainedPets("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], manualPets.pets)}
                {renderObtainedPets("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], manualPets.pets)}
                {renderObtainedPets("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], manualPets.pets)}
                {renderObtainedPets("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], manualPets.pets)}
                {renderObtainedPets("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], manualPets.pets)}
                {renderObtainedPets("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], manualPets.pets)}
                {renderObtainedPets("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], manualPets.pets)}
                {renderObtainedPets("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], manualPets.pets)}
                {renderObtainedPets("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], manualPets.pets)}
                {renderObtainedPets("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin"], manualPets.pets)}
                {renderMissingPets(manualPets.pets)}
              </>
            ) : manualMode ? (
              <>
                {renderPetGrid("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte"], manualPets.pets)}
                {renderPetGrid("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], manualPets.pets)}
                {renderPetGrid("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], manualPets.pets)}
                {renderPetGrid("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], manualPets.pets)}
                {renderPetGrid("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], manualPets.pets)}
                {renderPetGrid("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], manualPets.pets)}
                {renderPetGrid("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], manualPets.pets)}
                {renderPetGrid("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], manualPets.pets)}
                {renderPetGrid("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], manualPets.pets)}
                {renderPetGrid("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], manualPets.pets)}
                {renderPetGrid("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin"], manualPets.pets)}
              </>
            ): missingMode && combinedMissing && !manualMode ? (
              renderMissingPets(petCount.pets)
            ) : combinedMissing && !manualMode ? (
              <>
                {renderObtainedPets("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte"], petCount.pets)}
                {renderObtainedPets("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], petCount.pets)}
                {renderObtainedPets("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], petCount.pets)}
                {renderObtainedPets("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], petCount.pets)}
                {renderObtainedPets("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], petCount.pets)}
                {renderObtainedPets("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], petCount.pets)}
                {renderObtainedPets("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], petCount.pets)}
                {renderObtainedPets("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], petCount.pets)}
                {renderObtainedPets("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], petCount.pets)}
                {renderObtainedPets("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], petCount.pets)}
                {renderObtainedPets("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin"], petCount.pets)}
                {renderMissingPets(petCount.pets)}
              </>
            ) : (
              <>
                {renderPetGrid("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte"], petCount.pets)}
                {renderPetGrid("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], petCount.pets)}
                {renderPetGrid("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], petCount.pets)}
                {renderPetGrid("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], petCount.pets)}
                {renderPetGrid("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], petCount.pets)}
                {renderPetGrid("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], petCount.pets)}
                {renderPetGrid("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], petCount.pets)}
                {renderPetGrid("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], petCount.pets)}
                {renderPetGrid("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], petCount.pets)}
                {renderPetGrid("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], petCount.pets)}
                {renderPetGrid("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin"], petCount.pets)}
              </>
            )}
          </Grid>
          {manualMode && !confirmed && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" onClick={handleConfirm} className="setting-button">Manually Generate List</Button>
            </Box>
          )}
        </div>
      ))
    )}
  </Box>
  );
}
