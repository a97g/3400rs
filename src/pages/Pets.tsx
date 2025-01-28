/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useRef, useState } from 'react';
import { Box, Button, Container, Divider, IconButton, InputBase, Paper, Tooltip, Typography, Checkbox, ToggleButton, ToggleButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField as MuiTextField, Alert } from '@mui/material';
import Page from '../components/Page';
import axios from 'axios';
import { Help, PersonOutlined, Search, GroupsOutlined, JoinFull, SentimentDissatisfiedOutlined, LeaderboardOutlined, DetailsOutlined, PanToolAltOutlined, ColorLensOutlined, TableChartOutlined, ContentPasteGoOutlined, NumbersOutlined, ContentCopyOutlined } from '@mui/icons-material';
import 'react-circular-progressbar/dist/styles.css';
import goldavi from '../resources/pets/assets/goldavi.png';
import './Pets.css';
import PetTable from '../components/PetTable';
import PetLeaderboard from '../components/PetLeaderboard';
import AsciiGenerator from '../components/AsciiGenerator';
import { toPng } from 'html-to-image';

export default function Pets() {
  const totalPets = 62;
  const totalHours = 5270;

  const [group, setGroup] = useState('2394');
  const [player, setPlayer] = useState('3400');
  const [rsnError, setRsnError] = useState(false);
  const [missingMode, setMissingMode] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const [combinedMissing, setCombinedMissing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [kcMode, setKcMode] = useState(false);
  const [petBgColor1, setPetBgColor1] = useState('#492023');
  const [petBgColor2, setPetBgColor2] = useState('#463827');
  const [asciiGen, setAsciiGen] = useState(false);
  const [discordFormatting, setDiscordFormatting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importedTable, setImportedTable] = useState('');

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
      if (response && response.data && response.data.data) {
        setPetCounts(response.data.data);
        console.log(response.data.data);
      } else {
        setRsnError(true);
        setTimeout(() => {
          setRsnError(false);
        }, 5000);
      }
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

  const handleBgColorChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setPetBgColor1(newColor);
    document.documentElement.style.setProperty('--obtained-pet-bg', `linear-gradient(135deg, ${newColor}, ${petBgColor2})`);
  };

  const handleBgColorChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setPetBgColor2(newColor);
    document.documentElement.style.setProperty('--obtained-pet-bg', `linear-gradient(135deg, ${petBgColor1}, ${newColor})`);
  };

  const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment === 'individual') {
      setIsGroup(false);
      setAsciiGen(false);
      setPetCounts({ '': emptyPets });
      setIsLeaderboard(false);
    } else if (newAlignment === 'group') {
      setIsGroup(true);
      setAsciiGen(false);
      setPetCounts({ '': emptyPets });
      setMissingMode(false);
      setManualMode(false);
    } else if (newAlignment === 'ascii') {
      setAsciiGen(true);
      setIsGroup(false);
      setIsLeaderboard(false);
      setMissingMode(false);
      setManualMode(false);
    }
  };

  const handleImportDialogOpen = () => {
    setImportDialogOpen(true);
  };

  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
  };

  const handleImportTableChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setImportedTable(event.target.value);
  };

  const handleImportTable = () => {
    // Process the imported table and populate the fields in AsciiGenerator
    // Strip unneeded spaces and ASCII characters
    const lines = importedTable.split('\n').filter(line => line.trim() !== '');
    const rsn = lines[1].trim();
    const rows = lines.slice(4, -1).map(line => {
      const [index, pet, kc, date] = line.split('|').map(item => item.trim());
      return { id: parseInt(index), pet, kc, date };
    });

    // Set the RSN and rows in AsciiGenerator
    setRsn(rsn);
    setRows(rows);

    setImportDialogOpen(false);
  };

  const ref = useRef<HTMLDivElement>(null);
  
  const onDownloadTable = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${player}-pet-table.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getPetCount();
    }
  };

  return (
    <Page title="Pet List Generator | 34rs">
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ backgroundColor: '#1b1a1d', width: '304px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', ml: 3, mr: 3, position: 'sticky', top: 0, zIndex: 1 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 3, fontWeight: 600 }}>List Settings</Typography>
            <div className="nav-space-divider" />
            <ToggleButtonGroup
              value={isGroup ? 'group' : asciiGen ? 'ascii' : 'individual'}
              exclusive
              onChange={handleToggleChange}
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', backgroundColor: '#141316' }}
            >
              <ToggleButton value="individual" sx={{ flex: 1, color: 'white', '&.Mui-selected': { color: 'orange' } }}>
                <PersonOutlined />
                {/* Individual RSN */}
              </ToggleButton>
              <ToggleButton value="group" sx={{ flex: 1, color: 'white', '&.Mui-selected': { color: 'orange' } }}>
                <GroupsOutlined />
                {/* Group / Clan */}
              </ToggleButton>
              <ToggleButton value="ascii" sx={{ flex: 1, color: 'white', '&.Mui-selected': { color: 'orange' } }}>
                <TableChartOutlined />
                {/* Ascii Table Generator */}
              </ToggleButton>
            </ToggleButtonGroup>
            {!asciiGen && (
              <>
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
                {!isGroup && (
                  <>
                    <Button variant="contained" onClick={() => { setManualMode(!manualMode); }} className='setting-button settings-toggle' disabled={isGroup ? true : false} sx={{ display: 'flex', mb: 3, alignItems: 'center', justifyContent: 'space-between' }} >
                      <PanToolAltOutlined />
                      Manual Mode
                      <Checkbox checked={manualMode} onChange={() => { setManualMode(!manualMode); }} color="default"/>
                    </Button>
                    <Button variant="contained" onClick={() => { setKcMode(!kcMode); }} className='setting-button settings-toggle' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                      <NumbersOutlined />
                      Kc Mode
                      <Checkbox checked={kcMode} onChange={() => { setKcMode(!kcMode); }} color="default"/>
                    </Button>
                  </>
                )}
                {isGroup && (
                <Button variant="contained" onClick={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); } } className='setting-button settings-toggle' disabled={!isGroup ? true : false} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <LeaderboardOutlined />
                    Leaderboard Mode
                  <Checkbox checked={isLeaderboard} onChange={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); setCombinedMissing(false); } } color="default" className="settings-toggle" />
                </Button>
                )}
                <div className="nav-space-divider" />
                <Button variant="contained" onClick={() => { setIsDetailed(!isDetailed); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <DetailsOutlined />
                  Detailed Sprites
                  <Checkbox checked={isDetailed} onChange={() => { setIsDetailed(!isDetailed); }} color="default"/>
                </Button>
                {!isLeaderboard && (
                  <Button variant="contained" className='setting-button' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <ColorLensOutlined />
                  Pet Bg
                  <Box>
                    <input type="color" value={petBgColor1} onChange={handleBgColorChange1} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                    <input type="color" value={petBgColor2} onChange={handleBgColorChange2} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                  </Box>
                </Button>
                )}
                {!isGroup && (
                  <Button variant="contained" className='setting-button' sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '75px' }} onClick={onDownloadTable}>
                    <ContentCopyOutlined />
                    Download Table
                  </Button>
                )}
              </>
            )}
            {asciiGen && (
              <>
                <Button variant="contained" onClick={() => { setDiscordFormatting(!discordFormatting); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <ContentPasteGoOutlined />
                  Discord Formatting
                  <Checkbox checked={discordFormatting} onChange={() => { setDiscordFormatting(!discordFormatting); }} color="default"/>
                </Button>
                <Button variant="contained" onClick={handleImportDialogOpen} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center' }} >
                  Import Old Table
                </Button>
              </>
            )}
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
                <Typography sx={{ ml: 2, fontWeight: '500' }} variant='h4'>{asciiGen ? 'Ascii' : isGroup ? isLeaderboard ?  'Leaderboard' : 'Group' : 'Individual' }  Pet List Generator</Typography>
                {!isGroup && !asciiGen && (
                  <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Enter your RuneScape username and click the magnifying glass.
                  <br />
                  This will query the Temple's API to retrieve and display your pets in the chart below.
                  <br />
                  Use the sidebar options to customize the chart's visual appearance.
                  </Typography>
                )}
                {isGroup && !asciiGen && (
                  <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Enter your Group / Clans Temple Id and click the magnifying glass.
                  <br />
                  This will query the Temple's API to retrieve and display your groups pets in the chart below.
                  <br />
                  Use the sidebar options to customize the chart's visual appearance or toggle between leaderboard and comparative mode.
                  </Typography>
                )}
                {asciiGen && (
                  <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Enter in your pet names, kill counts, and dates to generate an ASCII table.
                  <br />
                  Use the sidebar options to customize the formatting for displaying in different locations.
                  <br />
                  After clicking Generate Ascii Table the table will be copied to your clipboard.
                  <br />
                  Some adjustments will need to be made, i did my best :D
                  </Typography>
                )}

              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', maxWidth: '300px', mr: 1 }}>
              {rsnError && (<Alert severity="error">No pet data found.</Alert>)}
              <Typography>{isGroup ? 'Temple Group Id' : 'Runescape Name'}</Typography>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, backgroundColor: '#242328', color: 'white' }}
                onSubmit={(e) => { e.preventDefault(); getPetCount(); }}
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
                  onKeyPress={handleKeyPress}
                />
                <IconButton type="button" sx={{ p: '10px', color: 'orange' }} aria-label="search" onClick={getPetCount}>
                  <Search />
                </IconButton>
              </Paper>
            </Box>
          </Box>
          <div className="nav-space-divider" />
          {/* <Box sx={{minWidth: '1400px'}}></Box> */}
          {!isLeaderboard && !asciiGen && (
            <PetTable 
              totalPets={totalPets}
              totalHours={totalHours}
              petCounts={petCounts} 
              isGroup={isGroup} 
              missingMode={missingMode} 
              detailedMode={isDetailed} 
              combinedMissing={combinedMissing} 
              manualMode={manualMode}
              kcMode={kcMode}
              ref={ref}
            />
          )}
          {isLeaderboard && !asciiGen && (
            <PetLeaderboard 
              totalPets={totalPets}
              totalHours={totalHours}
              petCounts={petCounts}
            />
          )}
          {asciiGen && (
            <AsciiGenerator discordFormat={discordFormatting} importedTable={importedTable} />
          )}
        </Container>
      </Box>

      <Dialog open={importDialogOpen} onClose={handleImportDialogClose}>
        <DialogTitle>Import Old Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Paste your old ASCII table below to import it.
          </DialogContentText>
          <MuiTextField
            autoFocus
            margin="dense"
            id="importedTable"
            label="Old ASCII Table"
            type="text"
            fullWidth
            multiline
            rows={10}
            value={importedTable}
            onChange={handleImportTableChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportDialogClose}>Close</Button>
          {/* <Button onClick={handleImportTable}>Import</Button> */}
        </DialogActions>
      </Dialog>
    </Page>
  );
}
function setRows(rows: { id: number; pet: string; kc: string; date: string; }[]) {
  throw new Error('Function not implemented.');
}

function setRsn(rsn: string) {
  throw new Error('Function not implemented.');
}

