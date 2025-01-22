import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import * as Pet from '../resources/pets/inv';

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
}

export default function PetTable({ petCounts, isGroup }: PetTableProps) {
    const totalPets = 62;
    const totalHours = 5270;

  const getPetIconClass = (petName: string, pets: PetData) => {
    return Object.entries(pets).find(([name, count]) => name === petName && count === 1)
      ? 'obtained-pet-icon'
      : 'pet-icon';
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
              <Box className={getPetIconClass("Baby mole", petCount.pets)}>
                <img src={Pet.BabyMole} alt="Baby mole" />
              </Box>
              <Box className={getPetIconClass("Prince black dragon", petCount.pets)}>
                <img src={Pet.PrinceBlackDragon} alt="Prince black dragon" />
              </Box>
              <Box className={getPetIconClass("Kalphite princess", petCount.pets)}>
                <img src={Pet.KalphitePrincess} alt="Kalphite princess" />
              </Box>
              <Box className={getPetIconClass("Pet dark core", petCount.pets)}>
                <img src={Pet.PetDarkCore} alt="Pet dark core" />
              </Box>
              <Box className={getPetIconClass("Sraracha", petCount.pets)}>
                <img src={Pet.Sraracha} alt="Sraracha" />
              </Box>
              <Box className={getPetIconClass("Little nightmare", petCount.pets)}>
                <img src={Pet.LittleNightmare} alt="Little nightmare" />
              </Box>
              <Box className={getPetIconClass("Scurry", petCount.pets)}>
                <img src={Pet.Scurry} alt="Scurry" />
              </Box>
              <Box className={getPetIconClass("Huberte", petCount.pets)}>
                <img src={Pet.Huberte} alt="Huberte" />
              </Box>
            </Box>
          </Grid>

          <Grid sx={{pl: 2, pr: 3}}>
            <Box sx={{display: 'flex'}}> 
              <Typography className="pet-category-title">Skilling</Typography>
              <div className="space-divider" />
            </Box>
              <Box className="pet-grid">
                <Box className={getPetIconClass("Rift guardian", petCount.pets)}>
                  <img src={Pet.RiftGuardian} alt="Rift guardian" />
                </Box>
                <Box className={getPetIconClass("Beaver", petCount.pets)}>
                  <img src={Pet.Beaver} alt="Beaver" />
                </Box>
                <Box className={getPetIconClass("Rock golem", petCount.pets)}>
                  <img src={Pet.RockGolem} alt="Rock golem" />
                </Box>
                <Box className={getPetIconClass("Baby chinchompa", petCount.pets)}>
                  <img src={Pet.BabyChinchompa} alt="Baby chinchompa" />
                </Box>
                <Box className={getPetIconClass("Rocky", petCount.pets)}>
                  <img src={Pet.Rocky} alt="Rocky" />
                </Box>
                <Box className={getPetIconClass("Tangleroot", petCount.pets)}>
                  <img src={Pet.Tangleroot} alt="Tangleroot" />
                </Box>
                <Box className={getPetIconClass("Heron", petCount.pets)}>
                  <img src={Pet.Heron} alt="Heron" />
                </Box>
                <Box className={getPetIconClass("Giant squirrel", petCount.pets)}>
                  <img src={Pet.GiantSquirrel} alt="Giant squirrel" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{pl: 2, mt: 3}}>
            <Box sx={{display: 'flex'}}> 
              <Typography className="pet-category-title">GWD</Typography>
              <div className="space-divider" />
            </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet kree'arra", petCount.pets)}>
                  <img src={Pet.PetKreeArra} alt="Pet kree'arra" />
                </Box>
              <Box className={getPetIconClass("Pet general graardor", petCount.pets)}>
                  <img src={Pet.PetGeneralGraardor} alt="Pet general graardor" />
                </Box>
              <Box className={getPetIconClass("Pet k'ril tsutsaroth", petCount.pets)}>
                  <img src={Pet.PetKrilsTsutsaroth} alt="Pet k'ril tsutsaroth" />
                </Box>
              <Box className={getPetIconClass("Pet zilyana", petCount.pets)}>
                  <img src={Pet.PetZilyana} alt="Pet zilyana" />
                </Box>
              <Box className={getPetIconClass("Nexling", petCount.pets)}>
                  <img src={Pet.Nexling} alt="Nexling" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3, pl: 2}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">DKS</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet dagannoth rex", petCount.pets)}>
                  <img src={Pet.PetDagannothRex} alt="Pet dagannoth rex" />
                </Box>
              <Box className={getPetIconClass("Pet dagannoth prime", petCount.pets)}>
                  <img src={Pet.PetDagannothPrime} alt="Pet dagannoth prime" />
                </Box>
              <Box className={getPetIconClass("Pet dagannoth supreme", petCount.pets)}>
                  <img src={Pet.PetDagannothSupreme} alt="Pet dagannoth supreme" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3, pl: 2}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Slayer</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet smoke devil", petCount.pets)}>
                  <img src={Pet.PetSmokeDevil} alt="Pet smoke devil" />
                </Box>
              <Box className={getPetIconClass("Pet kraken", petCount.pets)}>
                  <img src={Pet.PetKraken} alt="Pet kraken" />
                </Box>
              <Box className={getPetIconClass("Hellpuppy", petCount.pets)}>
                  <img src={Pet.Hellpuppy} alt="Hellpuppy" />
                </Box>
              <Box className={getPetIconClass("Abyssal orphan", petCount.pets)}>
                  <img src={Pet.AbyssalOrphan} alt="Abyssal orphan" />
                </Box>
              <Box className={getPetIconClass("Noon", petCount.pets)}>
                  <img src={Pet.Noon} alt="Noon" />
                </Box>
              <Box className={getPetIconClass("Ikkle hydra", petCount.pets)}>
                  <img src={Pet.IkkleHydra} alt="Ikkle hydra" />
                </Box>
              <Box className={getPetIconClass("Nid", petCount.pets)}>
                  <img src={Pet.Nid} alt="Nid" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Quest</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Vorki", petCount.pets)}>
                  <img src={Pet.Vorki} alt="Vorki" />
                </Box>
              <Box className={getPetIconClass("Muphin", petCount.pets)}>
                  <img src={Pet.Muphin} alt="Muphin" />
                </Box>
              <Box className={getPetIconClass("Wisp", petCount.pets)}>
                  <img src={Pet.Wisp} alt="Wisp" />
                </Box>
              <Box className={getPetIconClass("Butch", petCount.pets)}>
                  <img src={Pet.Butch} alt="Butch" />
                </Box>
              <Box className={getPetIconClass("Baron", petCount.pets)}>
                  <img src={Pet.Baron} alt="Baron" />
                </Box>
              <Box className={getPetIconClass("Lil'viathan", petCount.pets)}>
                  <img src={Pet.LilViathan} alt="Lil'viathan" />
                </Box>
              <Box className={getPetIconClass("Moxi", petCount.pets)}>
                  <img src={Pet.Moxi} alt="Moxi" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">PvM Minigame</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Tzrek-jad", petCount.pets)}>
                  <img src={Pet.TzrekJad} alt="Tzrek-jad" />
                </Box>
              <Box className={getPetIconClass("Jal-nib-rek", petCount.pets)}>
                  <img src={Pet.JalNibRek} alt="Jal-nib-rek" />
                </Box>
              <Box className={getPetIconClass("Youngllef", petCount.pets)}>
                  <img src={Pet.Youngllef} alt="Youngllef" />
                </Box>
              <Box className={getPetIconClass("Lil' creator", petCount.pets)}>
                  <img src={Pet.LilCreator} alt="Lil' creator" />
                </Box>
              <Box className={getPetIconClass("Smol Heredit", petCount.pets)}>
                  <img src={Pet.SmolHeredit} alt="Smol Heredit" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Wilderness</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet chaos elemental", petCount.pets)}>
                  <img src={Pet.PetChaosElemental} alt="Pet chaos elemental" />
                </Box>
              <Box className={getPetIconClass("Venenatis spiderling", petCount.pets)}>
                  <img src={Pet.VenenatisSpiderling} alt="Venenatis spiderling" />
                </Box>
              <Box className={getPetIconClass("Callisto cub", petCount.pets)}>
                  <img src={Pet.CallistoCub} alt="Callisto cub" />
                </Box>
              <Box className={getPetIconClass("Vet'ion jr. ", petCount.pets)}>
                  <img src={Pet.VetionJr} alt="Vet'ion jr. " />
                </Box>
              <Box className={getPetIconClass("Scorpia's offspring", petCount.pets)}>
                  <img src={Pet.ScorpiasOffspring} alt="Scorpia's offspring" />
                </Box>
              </Box>
            </Grid>

            <Grid container sx={{justifyContent: 'space-around', width: '100%'}}>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Raids</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Olmlet", petCount.pets)}>
                  <img src={Pet.Olmlet} alt="Olmlet" />
                </Box>
              <Box className={getPetIconClass("Lil' zik", petCount.pets)}>
                  <img src={Pet.LilZik} alt="Lil' zik" />
                </Box>
              <Box className={getPetIconClass("Tumeken's guardian", petCount.pets)}>
                  <img src={Pet.TumekensGuardian} alt="Tumeken's guardian" />
                </Box>
              </Box>
            </Grid>

            <Grid sx={{mt: 3}}>
            <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Skilling Minigames</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet penance queen", petCount.pets)}>
                  <img src={Pet.PetPenanceQueen} alt="Pet penance queen" />
                </Box>
              <Box className={getPetIconClass("Phoenix", petCount.pets)}>
                  <img src={Pet.Phoenix} alt="Phoenix" />
                </Box>
              <Box className={getPetIconClass("Smolcano", petCount.pets)}>
                  <img src={Pet.Smolcano} alt="Smolcano" />
                </Box>
              <Box className={getPetIconClass("Tiny tempor", petCount.pets)}>
                  <img src={Pet.TinyTempor} alt="Tiny tempor" />
                </Box>
              <Box className={getPetIconClass("Abyssal protector", petCount.pets)}>
                  <img src={Pet.AbyssalProtector} alt="Abyssal protector" />
                </Box>
              </Box>
            </Grid>


            <Grid  sx={{mt: 3}}>
              <Box sx={{display: 'flex'}}> 
                <Typography className="pet-category-title">Miscellaneous</Typography>
                <div className="space-divider" />
              </Box>
              <Box className="pet-grid">
              <Box className={getPetIconClass("Pet snakeling", petCount.pets)}>
                <img src={Pet.PetSnakeling} alt="Pet snakeling" />
              </Box>
              <Box className={getPetIconClass("Chompy chick", petCount.pets)}>
                <img src={Pet.ChompyChick} alt="Chompy chick" />
              </Box>
              <Box className={getPetIconClass("Skotos", petCount.pets)}>
                <img src={Pet.Skotos} alt="Skotos" />
              </Box>
              <Box className={getPetIconClass("Herbi", petCount.pets)}>
                <img src={Pet.Herbi} alt="Herbi" />
              </Box>
              <Box className={getPetIconClass("Bloodhound", petCount.pets)}>
                <img src={Pet.Bloodhound} alt="Bloodhound" />
              </Box>
              <Box className={getPetIconClass("Quetzin", petCount.pets)}>
                <img src={Pet.Quetzin} alt="Quetzin" />
              </Box>
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
