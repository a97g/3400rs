import { useState } from 'react';
import { Box, Button, Container, Divider, IconButton, InputBase, Paper, Switch, TextField, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Page from '../components/Page';
import axios from 'axios';
import { AccountCircle, Groups, Help, Search } from '@mui/icons-material';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as Pet from '../resources/pets/inv';
import goldavi from '../resources/pets/assets/goldavi.png'
import './Pets.css';

export default function Pets() {
  const [petCounts, setPetCounts] = useState<{ [key: string]: PetCountResponse }>({});
  const emptyPets = {
    pets:[],
    pet_hours: 0,
    pet_count: 0,
    player: ' ',
    rank: 0,
  };
  const [group, setGroup] = useState('2394');
  const [player, setPlayer] = useState('3400');
  const [isGroup, setIsGroup] = useState(false);
  const totalPets = 62;
  const totalHours = 5270;

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

  const getPetCount = async () => {
    const url = 'https://templeosrs.com/api/pets/pet_count.php';

    const params = isGroup
      ? { group: group, count: 200 }
      : { player: player, count: 200 };

    try {
      const response = await axios.get<{ data: { [key: string]: PetCountResponse } }>(url, { params });
      setPetCounts(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <Page title="Pet List Generator | 34rs">
      <Box sx={{display: 'flex'}}>
        <Box sx={{height: '100vh', backgroundColor: '#1b1a1d', width: '300px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
          <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', ml: 3, mr :3}}>

          <Typography variant="h4">Settings</Typography>

          <div className="nav-space-divider" />

          <Button variant="contained" onClick={() => setIsGroup(false)} className='setting-button' sx={{mb: 3}}>Individual Pets</Button>

          <Button variant="contained" onClick={() => setIsGroup(true)} className='setting-button'>Group / Clan Pets</Button>

          <div className="nav-space-divider" />

          <Button variant="contained" className='setting-button'>Missing Mode</Button>

          <div className="nav-space-divider" />

          <Button variant="contained" className='setting-button'>Pet Background Color</Button>

          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',mb: 3}}>
            <Box>
            <Button variant="outlined">
            Settings
            </Button>
            </Box>
          </Box>
        </Box>

      <Container maxWidth="lg">
          <Box className="banner-box">
          
          <Box sx={{display: 'flex', maxwidth: '700px', alignItems: 'flex-end', pl: 3}}>
            <img src={goldavi} width="125px" height="125px" alt="gold trophy"/>
            <Box>
              <Typography sx={{ml: 2}} variant='h4'>
                Individual Pet List Generator
              </Typography>
            <Typography sx={{ml: 2}}variant='body2'>
              Please enter your RuneScape username and click "Lookup Player." 
              <br />
              This will query the Temple's API to retrieve and display your pets in the chart below.
              <br />
              Use the sidebar options to customize the chart's visual appearance.
            </Typography>
            </Box>
          </Box>

          <Box sx={{display: 'flex',  justifyContent: 'flex-end', flexDirection: 'column', maxWidth: '300px',mr: 1}}>
          <Typography>{isGroup ? 'Temple Group Id' : 'Runescape Name'}</Typography>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, backgroundColor: '#242328', color: 'white' }}
          >
            {isGroup && (
              <>
                <Tooltip
                  sx={{ p: '10px', fontSize: '2.5em' }}
                  title="Temple Group Id is the number that is located at the end of the address bar following 'id=' on Temples website, for example https://templeosrs.com/groups/overview.php?id=2394. 2394 is the group id."
                >
                  <Help />
                </Tooltip>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </>
            )}
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'white' }}
              placeholder={isGroup ? "Temple Group Id" : "RuneScape Username"}
              inputProps={{ 'aria-label': 'RuneScape Username' }}
              value={isGroup ? group : player}
              onChange={(event) => isGroup ? setGroup(event.target.value) : setPlayer(event.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px', color: 'orange' }} aria-label="search" onClick={getPetCount}>
              <Search />
            </IconButton>
          </Paper>
          </Box>
        </Box>
        <div className="nav-space-divider" />

        <div>
          {Object.keys(petCounts).length > 0 ? (
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
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Baby mole" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.BabyMole} alt="Baby mole" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Prince black dragon" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PrinceBlackDragon} alt="Prince black dragon" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Kalphite princess" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.KalphitePrincess} alt="Kalphite princess" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Pet dark core" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PetDarkCore} alt="Pet dark core" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Sraracha" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Sraracha} alt="Sraracha" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Little nightmare" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.LittleNightmare} alt="Little nightmare" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Scurry" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Scurry} alt="Scurry" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                      ([petName, count]) => petName === "Huberte" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Rift guardian" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.RiftGuardian} alt="Rift guardian" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Beaver" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Beaver} alt="Beaver" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Rock golem" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.RockGolem} alt="Rock golem" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Baby chinchompa" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.BabyChinchompa} alt="Baby chinchompa" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Rocky" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Rocky} alt="Rocky" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Tangleroot" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Tangleroot} alt="Tangleroot" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Heron" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Heron} alt="Heron" />
                      </Box>
                      <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Giant squirrel" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet kree'arra" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKreeArra} alt="Pet kree'arra" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet general graardor" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetGeneralGraardor} alt="Pet general graardor" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet k'ril tsutsaroth" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKrilsTsutsaroth} alt="Pet k'ril tsutsaroth" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet zilyana" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetZilyana} alt="Pet zilyana" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Nexling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth rex" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetDagannothRex} alt="Pet dagannoth rex" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth prime" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetDagannothPrime} alt="Pet dagannoth prime" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth supreme" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet smoke devil" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetSmokeDevil} alt="Pet smoke devil" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet kraken" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKraken} alt="Pet kraken" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Hellpuppy" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Hellpuppy} alt="Hellpuppy" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Abyssal orphan" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.AbyssalOrphan} alt="Abyssal orphan" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Noon" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Noon} alt="Noon" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Ikkle hydra" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.IkkleHydra} alt="Ikkle hydra" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Vorki" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Vorki} alt="Vorki" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Muphin" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Muphin} alt="Muphin" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Wisp" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Wisp} alt="Wisp" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Butch" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Butch} alt="Butch" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Baron" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Baron} alt="Baron" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilViathan} alt="Lil'viathan" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Tzrek-jad" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.TzrekJad} alt="Tzrek-jad" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Jal-nib-rek" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.JalNibRek} alt="Jal-nib-rek" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Youngllef" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Youngllef} alt="Youngllef" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Lil' creator" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilCreator} alt="Lil' creator" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Smol Heredit" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet chaos elemental" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetChaosElemental} alt="Pet chaos elemental" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Venenatis spiderling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.VenenatisSpiderling} alt="Venenatis spiderling" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Callisto cub" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.CallistoCub} alt="Callisto cub" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Vet'ion jr. " && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.VetionJr} alt="Vet'ion jr. " />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Scorpia's offspring" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.ScorpiasOffspring} alt="Scorpia's offspring" />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid sx={{mt: 3, ml: 1}}>
                  <Box sx={{display: 'flex'}}> 
                      <Typography className="pet-category-title">Raids</Typography>
                      <div className="space-divider" />
                    </Box>
                    <Box className="pet-grid">
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Olmlet" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Olmlet} alt="Olmlet" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Lil' zik" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilZik} alt="Lil' zik" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Tumeken's guardian" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet penance queen" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetPenanceQueen} alt="Pet penance queen" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Phoenix" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Phoenix} alt="Phoenix" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Smolcano" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Smolcano} alt="Smolcano" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Tiny tempor" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.TinyTempor} alt="Tiny tempor" />
                      </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Abyssal protector" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Pet snakeling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PetSnakeling} alt="Pet snakeling" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Chompy chick" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.ChompyChick} alt="Chompy chick" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Skotos" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Skotos} alt="Skotos" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Herbi" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Herbi} alt="Herbi" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Bloodhound" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Bloodhound} alt="Bloodhound" />
                    </Box>
                    <Box className={Object.entries(petCount.pets).find(
                        ([petName, count]) => petName === "Quetzin" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Quetzin} alt="Quetzin" />
                    </Box>
                  </Box>
                </Grid>                
              </Grid>
              </div>
            ))
          ) : (
            <Box>
              {isGroup && <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{emptyPets.player}</Typography>}

              <Grid container>
                <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{display: 'flex'}}>
                  <div style={{ height: "160px", width: "120px" }}>
                    <CircularProgressbar 
                    value={emptyPets.pet_count / totalPets} 
                    maxValue={1} 
                    text={`${emptyPets.pet_count} / ${totalPets}`} 
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
                <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{emptyPets.player}</Typography>
                </Grid>
                )}

                {isGroup && Object.keys(petCounts).length > 1 && (
                <Grid size={{xs: 4}} sx={{display: 'flex', justifyContent: 'center'}}>
                  <Box sx={{display: 'flex'}}>
                    <div style={{ height: "160px", width: "120px" }}>
                      <CircularProgressbar 
                      value={emptyPets.rank / Object.keys(petCounts).length }
                      maxValue={1}
                      text={`${emptyPets.rank}`}
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
                    value={emptyPets.pet_hours / totalHours} 
                    maxValue={1} 
                    text={`${emptyPets.pet_hours}h`}
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
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Baby mole" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.BabyMole} alt="Baby mole" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Prince black dragon" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PrinceBlackDragon} alt="Prince black dragon" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Kalphite princess" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.KalphitePrincess} alt="Kalphite princess" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Pet dark core" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PetDarkCore} alt="Pet dark core" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Sraracha" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Sraracha} alt="Sraracha" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Little nightmare" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.LittleNightmare} alt="Little nightmare" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Scurry" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Scurry} alt="Scurry" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                      ([petName, count]) => petName === "Huberte" && count === 1
                    ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Rift guardian" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.RiftGuardian} alt="Rift guardian" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Beaver" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Beaver} alt="Beaver" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Rock golem" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.RockGolem} alt="Rock golem" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Baby chinchompa" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.BabyChinchompa} alt="Baby chinchompa" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Rocky" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Rocky} alt="Rocky" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Tangleroot" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Tangleroot} alt="Tangleroot" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Heron" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Heron} alt="Heron" />
                      </Box>
                      <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Giant squirrel" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet kree'arra" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKreeArra} alt="Pet kree'arra" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet general graardor" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetGeneralGraardor} alt="Pet general graardor" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet k'ril tsutsaroth" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKrilsTsutsaroth} alt="Pet k'ril tsutsaroth" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet zilyana" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetZilyana} alt="Pet zilyana" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Nexling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth rex" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetDagannothRex} alt="Pet dagannoth rex" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth prime" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetDagannothPrime} alt="Pet dagannoth prime" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet dagannoth supreme" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet smoke devil" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetSmokeDevil} alt="Pet smoke devil" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet kraken" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetKraken} alt="Pet kraken" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Hellpuppy" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Hellpuppy} alt="Hellpuppy" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Abyssal orphan" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.AbyssalOrphan} alt="Abyssal orphan" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Noon" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Noon} alt="Noon" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Ikkle hydra" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.IkkleHydra} alt="Ikkle hydra" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Vorki" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Vorki} alt="Vorki" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Muphin" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Muphin} alt="Muphin" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Wisp" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Wisp} alt="Wisp" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Butch" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Butch} alt="Butch" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Baron" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Baron} alt="Baron" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilViathan} alt="Lil'viathan" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Nid" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Tzrek-jad" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.TzrekJad} alt="Tzrek-jad" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Jal-nib-rek" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.JalNibRek} alt="Jal-nib-rek" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Youngllef" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Youngllef} alt="Youngllef" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Lil' creator" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilCreator} alt="Lil' creator" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Smol Heredit" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet chaos elemental" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetChaosElemental} alt="Pet chaos elemental" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Venenatis spiderling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.VenenatisSpiderling} alt="Venenatis spiderling" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Callisto cub" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.CallistoCub} alt="Callisto cub" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Vet'ion jr. " && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.VetionJr} alt="Vet'ion jr. " />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Scorpia's offspring" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.ScorpiasOffspring} alt="Scorpia's offspring" />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid sx={{mt: 3, ml: 1}}>
                  <Box sx={{display: 'flex'}}> 
                      <Typography className="pet-category-title">Raids</Typography>
                      <div className="space-divider" />
                    </Box>
                    <Box className="pet-grid">
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Olmlet" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Olmlet} alt="Olmlet" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Lil' zik" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.LilZik} alt="Lil' zik" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Tumeken's guardian" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet penance queen" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.PetPenanceQueen} alt="Pet penance queen" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Phoenix" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Phoenix} alt="Phoenix" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Smolcano" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.Smolcano} alt="Smolcano" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Tiny tempor" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                        <img src={Pet.TinyTempor} alt="Tiny tempor" />
                      </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Abyssal protector" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
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
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Pet snakeling" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.PetSnakeling} alt="Pet snakeling" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Chompy chick" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.ChompyChick} alt="Chompy chick" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Skotos" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Skotos} alt="Skotos" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Herbi" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Herbi} alt="Herbi" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Bloodhound" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Bloodhound} alt="Bloodhound" />
                    </Box>
                    <Box className={Object.entries(emptyPets.pets).find(
                        ([petName, count]) => petName === "Quetzin" && count === 1
                      ) ? 'obtained-pet-icon' : "pet-icon"}>
                      <img src={Pet.Quetzin} alt="Quetzin" />
                    </Box>
                  </Box>
                </Grid>                
              </Grid>
            </Box>
          )}
        </div>
      </Container>
      </Box>
    </Page>
  );
}
