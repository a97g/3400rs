/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Box, Button, Container, Divider, IconButton, InputBase, Paper, Tooltip, Typography, Checkbox } from '@mui/material';
import Page from '../components/Page';
import axios from 'axios';
import { Help, PersonOutlined, Search, GroupsOutlined, JoinFull, SentimentDissatisfiedOutlined, LeaderboardOutlined, DetailsOutlined, PanToolAltOutlined } from '@mui/icons-material';
import 'react-circular-progressbar/dist/styles.css';
import goldavi from '../resources/pets/assets/goldavi.png';
import './Pets.css';
import PetTable from '../components/PetTable';
import PetLeaderboard from '../components/PetLeaderboard';

export default function Pets() {
  const [group, setGroup] = useState('2394');
  const [player, setPlayer] = useState('3400');
  const [missingMode, setMissingMode] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const [combinedMissing, setCombinedMissing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  const emptyPets: PetCountResponse = { pets: {}, pet_hours: 0, pet_count: 0, player: ' ', rank: 0, };
  const [petCounts, setPetCounts] = useState<{ [key: string]: PetCountResponse }>({ '': emptyPets });

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

  const handleManualModeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newPlayer = event.target.value;
    setPlayer(newPlayer);
    if (manualMode) {
      const newPetCount: PetCountResponse = { pets: {}, pet_hours: 0, pet_count: 0, player: newPlayer, rank: 0 };
      setPetCounts({ '': newPetCount });
    }
  };

  return (
    <Page title="Pet List Generator | 34rs">
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ backgroundColor: '#1b1a1d', width: '304px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', ml: 3, mr: 3, position: 'sticky', top: 0, zIndex: 1 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 3 }}>List Settings</Typography>
            <div className="nav-space-divider" />
            <Button variant="contained" onClick={() => { setIsGroup(false); setPetCounts({ '': emptyPets }); setIsLeaderboard(false);}} className='setting-button' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <PersonOutlined />
              Individual RSN
              <Checkbox checked={!isGroup} onChange={() => { setIsGroup(false); setPetCounts({ '': emptyPets }); setIsLeaderboard(false); }} color="default" className="settings-toggle"/>
            </Button>
            <Button variant="contained" onClick={() => { setManualMode(!manualMode); }} className='setting-button settings-toggle' disabled={isGroup ? true : false} sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
              <PanToolAltOutlined />
              Manual Mode
              <Checkbox checked={manualMode} onChange={() => { setManualMode(!manualMode); }} color="default"/>
            </Button>
            <Button variant="contained" onClick={() => { setMissingMode(!missingMode);}} className='setting-button' disabled={isLeaderboard ? true : false} sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SentimentDissatisfiedOutlined />
              Only Missing
              <Checkbox checked={missingMode} onChange={() => setMissingMode(!missingMode)} color="default"className="settings-toggle" />
            </Button>
            <Button variant="contained" onClick={() => { setCombinedMissing(!combinedMissing);}} className='setting-button' disabled={isLeaderboard ? true : false} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <JoinFull />
              Combine Missing
              <Checkbox checked={combinedMissing} onChange={() => setCombinedMissing(!combinedMissing)} color="default" className="settings-toggle"/>
            </Button>
            <div className="nav-space-divider" />
            <Button variant="contained" onClick={() => { setIsGroup(true); setPetCounts({ '': emptyPets }); setMissingMode(false); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <GroupsOutlined />
              Group / Clan
              <Checkbox checked={isGroup} onChange={() => { setIsGroup(true); setPetCounts({ '': emptyPets }); setMissingMode(false); setManualMode(false);}} color="default" className="settings-toggle"/>
            </Button>
            <Button variant="contained" onClick={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); }} className='setting-button settings-toggle' disabled={!isGroup ? true : false} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
              <LeaderboardOutlined />
              Leaderboard Mode
              <Checkbox checked={isLeaderboard} onChange={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); setCombinedMissing(false); }} color="default" className="settings-toggle"/>
            </Button>
            <div className="nav-space-divider" />
            <Button variant="contained" onClick={() => { setIsDetailed(!isDetailed); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
              <DetailsOutlined />
              Detailed Sprites
              <Checkbox checked={isDetailed} onChange={() => { setIsDetailed(!isDetailed); }} color="default"/>
            </Button>

            <Button variant="contained" className='setting-button' sx={{mb: 3}}>Include Dusts?</Button>


            <Button variant="contained" className='setting-button' sx={{mb: 3}}>Pet Background Color</Button>
            <Button variant="contained" className='setting-button'>Ascii Table Generator</Button>

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, position: 'sticky', top: 0, zIndex: 1 }}>
            <Box>
              <Button variant="outlined">Settings</Button>
            </Box>
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{padding: '0 !important'}}>
          <Box className="banner-box">
            <Box sx={{ display: 'flex', maxwidth: '700px', alignItems: 'flex-end', pl: 3 }}>
              <img src={goldavi} width="125px" height="125px" alt="gold trophy" />
              <Box>
                <Typography sx={{ ml: 2, fontWeight: '500' }} variant='h4'>{isGroup ? isLeaderboard ? 'Leaderboard' : 'Group' : 'Individual' }  Pet List Generator</Typography>
                <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Please enter your RuneScape username and click the magnifying glass.
                  <br />
                  This will query the Temple's API to retrieve and display your pets in the chart below.
                  <br />
                  Use the sidebar options to customize the chart's visual appearance.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', maxWidth: '300px', mr: 1 }}>
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
                  onChange={(event) => isGroup ? setGroup(event.target.value) : handleManualModeChange(event)}
                />
                <IconButton type="button" sx={{ p: '10px', color: 'orange' }} aria-label="search" onClick={getPetCount}>
                  <Search />
                </IconButton>
              </Paper>
            </Box>
          </Box>
          <div className="nav-space-divider" />
          <Box sx={{minWidth: '1400px'}}></Box>
          {!isLeaderboard && (<PetTable petCounts={petCounts} isGroup={isGroup} missingMode={missingMode} detailedMode={isDetailed} combinedMissing={combinedMissing} manualMode={manualMode}/>)}
          {isLeaderboard && (<PetLeaderboard petCounts={petCounts}/>)}
        </Container>
      </Box>
    </Page>
  );
}
