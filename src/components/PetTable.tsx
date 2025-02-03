import React, { useState, useEffect, RefObject } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import * as InvyPet from '../resources/pets/inv';
import * as DetailedPet from '../resources/pets/detailed';
import goldTrophy from '../resources/pets/assets/goldped.png';
import silverTrophy from '../resources/pets/assets/silverped.png';
import bronzeTrophy from '../resources/pets/assets/bronzeped.png';

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
  totalPets: number;
  totalHours: number;
  petCounts: { [key: string]: PetCountResponse };
  isGroup: boolean;
  missingMode: boolean;
  detailedMode: boolean;
  showDusts: boolean;
  showToa: boolean;
  transmogs: object;
  combinedMissing: boolean;
  manualMode: boolean;
  kcMode: boolean;
  ref: RefObject<HTMLDivElement>;
}

export default function PetTable({ totalPets, totalHours, petCounts, transmogs, isGroup, missingMode, detailedMode, showDusts, showToa, combinedMissing, manualMode, kcMode, ref}: PetTableProps) {
  const [manualPets, setManualPets] = useState<PetCountResponse>({
    pet_count: 0,
    pet_hours: 0,
    pets: {},
    player: '',
    rank: 0
  });
  const [confirmed, setConfirmed] = useState(false);
  const [kcValues, setKcValues] = useState<{ [key: string]: string }>({});
  const [passedPets, setPassedPets] = useState(petCounts);

  useEffect(() => {
    setPassedPets(petCounts);
  }, [petCounts]);


  useEffect(() => {
      if (petCounts && petCounts['1'] && petCounts['1'].pets) {
        const updatedPets = { ...petCounts['1'].pets };
        Object.keys(transmogs).forEach(key => {
          updatedPets[key] = transmogs[key as keyof typeof transmogs];
        });
        setPassedPets(prevState => ({
          ...prevState,
          '1': {
            ...prevState['1'],
            pets: updatedPets
          }
        }));
      }
  }, [transmogs, petCounts]);

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

  const handleKcChange = (petName: string, value: string) => {
    setKcValues(prevState => ({
      ...prevState,
      [petName]: value
    }));
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
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={petName}>
        <Box className={petIconClass} onClick={() => manualMode && handlePetClick(petName)}>
          <img src={petImage} alt={petName} className={detailedMode ? 'detailed-pet-image' : undefined} />
        </Box>
        {kcMode && petIconClass === 'obtained-pet-icon' && (
          <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
            {kcValues[petName]}
          </Typography>
        )}
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

  const getTrophyImage = (rank: number) => {
    if (rank === 1) return goldTrophy;
    if (rank === 2) return silverTrophy;
    if (rank === 3) return bronzeTrophy;
    return null;
  };

  const petOrder = [
    "Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte",
    "Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel",
    "Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling",
    "Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme",
    "Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid",
    "Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi",
    "Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit",
    "Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring",
    "Olmlet", "Lil' zik", "Tumeken's guardian",
    "Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector",
    "Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin"
  ];

  return (
    <Box sx={{ p: '24px'}}>
    {Object.keys(passedPets).length > 0 && (
      Object.entries(passedPets).map(([key, petCount]) => (
        <div key={key}>
        <Box ref={ref}>
          {isGroup && <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{petCount.player}</Typography>}
            <Grid container className="pet-container">
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
              <>
              <Grid size={{xs: 4}} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                <img src={`https://services.runescape.com/m=avatar-rs/${petCount.player}/chat.png`} alt="avatar" className='charIcon'/>
                <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{petCount.player}</Typography>
              </Grid>
              </>
            )}

            {isGroup && (
            <Grid size={{xs: 4}} sx={{display: 'flex', justifyContent: 'center'}}>
              <Box sx={{display: 'flex', position: 'relative'}}>
                <div style={{ height: "170px", width: "200px" }}>
                  {petCount.rank <= 3 && (
                    <img src={getTrophyImage(petCount.rank) || silverTrophy} alt="trophy" style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '150px', zIndex: '0' }} />
                  )}
                <Typography variant="h6" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>Rank</Typography>
                <Typography variant="h1" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>{petCount.rank}</Typography>
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
                  {showDusts && renderPetGrid("Dusts", ["Metamorphic Dust", "Sanguine Dust"], petCount.pets)}
                  {showToa && renderPetGrid("Toa Transmogs", ["Akkha", "Baba", "Kephri", "Zebak", "Warden"], petCount.pets)}
                </>
              )}
            </Grid>
          </Box>
          {manualMode && !confirmed && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" onClick={handleConfirm} className="setting-button">Manually Generate List</Button>
            </Box>
          )}
          {kcMode && (
            <>
              <Typography variant='h4' sx={{fontWeight: 500, textAlign: 'center'}}>KC Mode</Typography>
              <TableContainer component={Paper} className="pet-container" sx={{ mt: 3, backgroundColor: '#0f0f0f'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{color: 'white', fontSize: '1.2em', textAlign: 'center'}}>Pet Name</TableCell>
                      <TableCell sx={{color: 'white', fontSize: '1.2em', textAlign: 'center'}}>Kill Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {petOrder.filter(petName => getPetIconClass(petName, petCount.pets) === 'obtained-pet-icon').map((petName) => (
                      <TableRow 
                      key={petName}
                      sx={{ 
                        width: '100px',
                         mb: 2,
                        '& .MuiTableCell-root': {color: 'white !important'},
                        '& .MuiInputBase-input': {color: 'white !important'},
                        '& .MuiOutlinedInput-notchedOutline': {borderColor: 'white !important'},
                      }}
                      >
                        <TableCell sx={{textAlign: 'center'}}>{petName}</TableCell>
                        <TableCell sx={{textAlign: 'center'}}>
                          <TextField
                            variant="outlined"
                            size="small"
                            value={kcValues[petName] || ''}
                            onChange={(e) => handleKcChange(petName, e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      ))
    )}
  </Box>
  );
}
