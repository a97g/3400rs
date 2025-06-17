/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Divider, IconButton, InputBase, Paper, Tooltip, Typography, Checkbox, ToggleButton, ToggleButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField as MuiTextField, Alert, Zoom, Snackbar } from '@mui/material';
import Page from '../components/Page';
import nav3400rs from "../resources/nav/nav3400rs.png";
import axios from 'axios';
import { Help, PersonOutlined, Search, GroupsOutlined, JoinFull, SentimentDissatisfiedOutlined, LeaderboardOutlined, DetailsOutlined, PanToolAltOutlined, ColorLensOutlined, TableChartOutlined, ContentPasteGoOutlined, BadgeOutlined, NumbersOutlined, ContentCopyOutlined, FilterHdrOutlined, KeyOutlined, UploadFileOutlined, MoodBadOutlined, ExpandMore } from '@mui/icons-material';
import 'react-circular-progressbar/dist/styles.css';
import goldavi from '../resources/pets/assets/goldavi.png';
import Temple from '../resources/pets/assets/temple.svg';
import Clog from '../resources/pets/assets/clog.webp';
import Hiscores from '../resources/pets/assets/hiscores.png';
import './Pets.css';
import PetTable from '../components/PetTable';
import PetLeaderboard from '../components/PetLeaderboard';
import AsciiGenerator from '../components/AsciiGenerator';
import { toPng } from 'html-to-image';
import CloseIcon from '@mui/icons-material/Close';

export default function Pets() {
  const totalPets = 64;
  const totalHours = 5370;

  const [group, setGroup] = useState('2394');
  const [player, setPlayer] = useState('3400');
  const [rsnError, setRsnError] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [missingMode, setMissingMode] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const [showDusts, setShowDusts] = useState(false);
  const [showToa, setShowToa] = useState(false);
  const [combinedMissing, setCombinedMissing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [kcMode, setKcMode] = useState(false);
  const [petBgColor1, setPetBgColor1] = useState('#492023');
  const [petBgColor2, setPetBgColor2] = useState('#463827');
  const [asciiGen, setAsciiGen] = useState(false);
  const [discordFormatting, setDiscordFormatting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importedTable, setImportedTable] = useState('');
  const [petCountColor, setPetCountColor] = useState('#3a4f5a');
  const [petHoursColor, setPetHoursColor] = useState('#9acfa3');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [missingSettingsOpen, setMissingSettingsOpen] = useState(false);
  const [imageSettingsOpen, setImageSettingsOpen] = useState(false);
  const [colorSettingsOpen, setColorSettingsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [hideAvatar, setHideAvatar] = useState(false);

  const emptyPets: PetCountResponse = { pets: {}, pet_hours: 0, pet_count: 0, player: ' ', rank: 0, };
  const emptyLog: LogCountResponse = {
      "player": "",
      "player_name_with_capitalization": "",
      "last_checked": "",
      "last_checked_string": "",
      "last_changed": "",
      "last_changed_string": "",
      "items": {},
      "killcounts": {},
      "total_ehc": 0
  }
  const [petCounts, setPetCounts] = useState<{ [key: string]: PetCountResponse }>({ '': emptyPets });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logCount] = useState<{ [key: string]: any }>({ '': emptyLog });

  const [transmogs, setTransmogs] = useState<{ [key: string]: number }>({
    'Metamorphic Dust': 0,
    'Sanguine Dust': 0,
    Akkha: 0,
    Baba: 0,
    Kephri: 0,
    Zebak: 0,
    Warden: 0
  });

  interface PetData {
    [key: string]: number;
  }

  interface PetCountResponse {
    pet_count: number;
    pet_hours: number;
    pets: PetData;
    player: string | number;
    rank: number;
    [key: string]: unknown;
  }

  interface LogCountResponse {
    player: string | number;
    player_name_with_capitalization: string | number;
    last_checked: string;
    last_checked_string: string;
    last_changed: string;
    last_changed_string: string;
    items: { [key: string]: { count: number }; };
    killcounts: { [key: string]: number };
    total_ehc: number;
  }

  const getPetCount = async () => {
    const proxyUrl = 'https://corsproxy.io/?';
    const url = `https://templeosrs.com/api/collection-log/player_collection_log.php?player=${player}&categories=all_pets,chambers_of_xeric,theatre_of_blood,tombs_of_amascut`;

    try {
      if (!isGroup) {
        // Only fetch from the new endpoint for individual mode
        const response = await axios.get(proxyUrl + encodeURIComponent(url));
        if (response && response.data.data) {
          // Map the response to your PetCountResponse structure
          const data = response.data.data;
          const allPets = data.items?.all_pets || [];
          const chambers = data.items?.chambers_of_xeric || [];
          const tob = data.items?.theatre_of_blood || [];
          const toa = data.items?.tombs_of_amascut || [];

          // Correct petIdOrder to match the provided order
          const petIdOrder = [
            13262,22746,13178,13247,11995,12651,12816,12644,12643,12645,13225,12650,12646,21748,21291,12647,12653,12655,12649,12652,13181,21273,12648,13177,13179,21992,20693,12921,20851,22473,19730,12703,13320,13321,13322,13324,20659,20661,20663,20665,21509,13071,23495,23760,23757,24491,25348,25602,26348,26901,27352,27590,28246,28250,28248,28252,28801,28960,28962,29836,30152,30154,30622,30888
          ];
          const petOrder = [
            "Abyssal orphan","Ikkle hydra","Callisto cub","Hellpuppy","Pet chaos elemental","Pet zilyana","Pet dark core","Pet dagannoth prime","Pet dagannoth supreme","Pet dagannoth rex","Tzrek-jad","Pet general graardor","Baby mole","Noon","Jal-nib-rek","Kalphite princess","Prince black dragon","Pet kraken","Pet kree'arra","Pet k'ril tsutsaroth","Scorpia's offspring","Skotos","Pet smoke devil","Venenatis spiderling","Vet'ion jr. ","Vorki","Phoenix","Pet snakeling","Olmlet","Lil' zik","Bloodhound","Pet penance queen","Heron","Rock golem","Beaver","Baby chinchompa","Giant squirrel","Tangleroot","Rocky","Rift guardian","Herbi","Chompy chick","Sraracha","Smolcano","Youngllef","Little nightmare","Lil' creator","Tiny tempor","Nexling","Abyssal protector","Tumeken's guardian","Muphin","Wisp","Baron","Butch","Lil'viathan","Scurry","Smol Heredit","Quetzin","Nid","Huberte","Moxi","Bran","Yami"
          ];
          const idToPetName: { [id: number]: string } = {};
          petIdOrder.forEach((id, idx) => {
            idToPetName[id] = petOrder[idx];
          });

          // Initialize all pets to 0 (not obtained)
          const pets: { [key: string]: number } = {};
          petOrder.forEach(name => { pets[name] = 0; });

          // Set obtained pets from API response
          allPets.forEach((pet: any) => {
            const petName = idToPetName[pet.id];
            if (petName) pets[petName] = pet.count >= 1 ? 1 : 0;
          });

          const petCount = Object.values(pets).filter(v => v > 0).length;

          // Parse transmogs
          let metaDust = 0, sanguineDust = 0, Akkha = 0, Baba = 0, Kephri = 0, Zebak = 0, Warden = 0;
          // Metamorphic Dust (22386) from chambers_of_xeric
          chambers.forEach((item: any) => { if (item.id === 22386 && item.count >= 1) metaDust = 1; });
          // Sanguine Dust (25746) from theatre_of_blood
          tob.forEach((item: any) => { if (item.id === 25746 && item.count >= 1) sanguineDust = 1; });
          // ToA transmogs from tombs_of_amascut
          toa.forEach((item: any) => {
            if (item.id === 27377 && item.count >= 1) Akkha = 1;
            if (item.id === 27378 && item.count >= 1) Baba = 1;
            if (item.id === 27379 && item.count >= 1) Kephri = 1;
            if (item.id === 27380 && item.count >= 1) Zebak = 1;
            if (item.id === 27381 && item.count >= 1) Warden = 1;
          });
          setTransmogs({
            'Metamorphic Dust': metaDust,
            'Sanguine Dust': sanguineDust,
            Akkha,
            Baba,
            Kephri,
            Zebak,
            Warden
          });

          setPetCounts({
            '1': {
              pets,
              pet_count: petCount,
              pet_hours: 0, // fetched elsewhere
              player: data.player_name_with_capitalization || data.player || player,
              rank: 0
            }
          });
        } else {
          setRsnError(true);
          setTimeout(() => setRsnError(false), 5000);
        }
      } else {
        // Keep group logic
        const url = 'https://templeosrs.com/api/pets/pet_count.php';
        const params = new URLSearchParams({ group: group, count: '200' });
        const response = await axios.get(proxyUrl + encodeURIComponent(url + '?' + params.toString()));
        if (response && response.data) {
          setPetCounts(response.data.data);
        } else {
          setRsnError(true);
          setTimeout(() => setRsnError(false), 5000);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    if (logCount && logCount.items) {
      setTransmogs({
        "Metamorphic Dust": logCount?.items["22386"].count, 
        "Sanguine Dust": logCount?.items["25746"].count,
        Akkha: logCount?.items["27377"].count,
        Baba: logCount?.items["27378"].count,
        Kephri: logCount?.items["27379"].count,
        Zebak: logCount?.items["27380"].count,
        Warden: logCount?.items["27381"].count
      });
    }
  }, [logCount]);

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

  const handlePetCountColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetCountColor(event.target.value);
  };

  const handlePetHoursColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetHoursColor(event.target.value);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [ref, player])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getPetCount();
    }
  };

  const handleSiteClick = (site: string) => {
    if (site === 'Temple') {
      window.location.href='https://templeosrs.com/'
    } else if(site === 'Hiscores' ) {
      window.location.href='https://secure.runescape.com/m=hiscore_oldschool/overall'
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--obtained-pet-bg', `linear-gradient(135deg, ${petBgColor1}, ${petBgColor2})`);
  }, [petBgColor1, petBgColor2]);

  useEffect(() => {
    if (rsnError) setOpenError(true);
  }, [rsnError]);

  return (
    <Page title="3400 Pet List Tools">
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ backgroundColor: '#1b1a1d', maxWidth: '330px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', zIndex: 1,  }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', ml: 3, mr: 3, position: 'sticky', top: 0, zIndex: 1, flexGrow: '0' }}>
            <Box sx={{display:'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 3}}>
            <img src={nav3400rs} alt="icon" className="icon"/>
            <Typography variant="h5" sx={{ textAlign: 'center',  fontWeight: 600 }}>Pet List Tools</Typography>
            </Box>
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
                <>
                <Button variant="contained" onClick={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); } } className='setting-button settings-toggle' disabled={!isGroup ? true : false} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <LeaderboardOutlined />
                    Leaderboard Mode
                  <Checkbox checked={isLeaderboard} onChange={() => { setIsLeaderboard(!isLeaderboard); setMissingMode(false); setCombinedMissing(false); } } color="default" className="settings-toggle" />
                </Button>
                </>
                )}
                {!manualMode && (
                  <>
                  <Button variant="outlined" className="dropdown-button" sx={{border: 0, mb: 2, mt: 1, display: 'flex', justifyContent: 'space-between', color: '#656566', "&:hover": {backgroundColor: "#1b1a1d"},"&:active": {backgroundColor: "#1b1a1d"}}} onClick={() => {setMissingSettingsOpen(!missingSettingsOpen);}} disableRipple>
                    <Typography>
                    Missing Settings
                    </Typography>
                    <ExpandMore sx={{ transform: missingSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}/>
                  </Button>
                  {missingSettingsOpen && (
                    <Zoom in={missingSettingsOpen} style={{ transitionDelay: missingSettingsOpen ? '100ms' : '0ms' }}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
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
                      </Box>
                    </Zoom>
                  )}
                  </>
                )}
                  <Button variant="outlined" className="dropdown-button" sx={{border: 0, mb: 2, mt: 1, display: 'flex', justifyContent: 'space-between', color: '#656566', "&:hover": {backgroundColor: "#1b1a1d"},"&:active": {backgroundColor: "#1b1a1d"}}} onClick={() => {setImageSettingsOpen(!imageSettingsOpen);}} disableRipple>
                    <Typography>
                    Image Settings
                    </Typography>
                    <ExpandMore sx={{ transform: imageSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}/>
                  </Button>
                  {imageSettingsOpen && (
                    <Zoom in={imageSettingsOpen} style={{ transitionDelay: imageSettingsOpen ? '100ms' : '0ms' }}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                      {!isLeaderboard && (
                      <Button variant="contained" onClick={() => { setIsDetailed(!isDetailed); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                        <DetailsOutlined />
                        Detailed Sprites
                        <Checkbox checked={isDetailed} onChange={() => { setIsDetailed(!isDetailed); }} color="default"/>
                      </Button>
                      )}
                      {!isGroup && !isLeaderboard && (
                        <>
                      <Button variant="contained" onClick={() => { setShowDusts(!showDusts); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                        <FilterHdrOutlined />
                        Include Dusts
                        <Checkbox checked={showDusts} onChange={() => { setShowDusts(!showDusts); }} color="default"/>
                      </Button>
                      <Button variant="contained" onClick={() => { setShowToa(!showToa); }} className='setting-button settings-toggle' sx={{ mb: 3,display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                        <KeyOutlined />
                        Include Toa Transmogs
                        <Checkbox checked={showToa} onChange={() => { setShowToa(!showToa); }} color="default"/>
                      </Button>
                      </>
                      )}
                      <Button variant="contained" onClick={() => { setIsCompact(!isCompact); }} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                      <BadgeOutlined />
                      Alternate Name Format
                      <Checkbox checked={isCompact} onChange={() => { setIsCompact(!isCompact); }} color="default"/>
                      </Button>
                      <Button variant="contained" onClick={() => { setHideAvatar(!hideAvatar); }} className='setting-button settings-toggle' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                      <MoodBadOutlined />
                      Hide Avatar
                      <Checkbox checked={hideAvatar} onChange={() => { setHideAvatar(!hideAvatar); }} color="default"/>
                      </Button>
                      {!isGroup && (
                      <Button variant="contained" component="label" className='setting-button' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, pb: 2,  mt: 3}}>
                        <UploadFileOutlined />
                        Upload Avatar
                        <MoodBadOutlined />
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
                      </Button>
                      )}
                    </Box>
                  </Zoom> 
                )}
                  <Button variant="outlined" className="dropdown-button" sx={{border: 0, mb: 2, mt: 1, display: 'flex', justifyContent: 'space-between', color: '#656566', "&:hover": {backgroundColor: "#1b1a1d"},"&:active": {backgroundColor: "#1b1a1d"}}} onClick={() => {setColorSettingsOpen(!colorSettingsOpen);}} disableRipple>
                    <Typography>
                    Color Settings
                    </Typography>
                    <ExpandMore sx={{ transform: colorSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}/>
                  </Button>
                {colorSettingsOpen && (
                    <Zoom in={colorSettingsOpen} style={{ transitionDelay: colorSettingsOpen ? '100ms' : '0ms' }}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                {!isLeaderboard && (
                  <>
                    <Button variant="contained" className='setting-button settings-toggle' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, pb: 2, flexGrow: '0' }}>
                      <ColorLensOutlined />
                      <Box />
                      Pet Bg
                      <Box />
                      <Box>
                        <input type="color" value={petBgColor1} onChange={handleBgColorChange1} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                        <input type="color" value={petBgColor2} onChange={handleBgColorChange2} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                      </Box>
                    </Button>
                  </>
                )}
                <Button variant="contained" className='setting-button' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, pb: 2, mt: 3}}>
                  <ColorLensOutlined />
                <Box />
                  Pet Count Color
                  <Box />
                  <Box>
                    <input type="color" value={petCountColor} onChange={handlePetCountColorChange} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                  </Box>
                </Button>
                <Button variant="contained" className='setting-button' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, pb: 2, mt: 3}}>
                  <ColorLensOutlined />
                  <Box />
                  Pet Hours Color
                  <Box />
                  <Box>
                    <input type="color" value={petHoursColor} onChange={handlePetHoursColorChange} style={{ marginLeft: '10px', borderRadius: '90px', width: '30px', cursor: 'pointer', backgroundColor: '#242328', border: 0 }} />
                  </Box>
                </Button>
                </Box>
                </Zoom> 
              )}
                {!isGroup && (
                  <>
                    <div className="nav-space-divider" />
                    <Button variant="contained" className='setting-button' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '75px' }} onClick={onDownloadTable}>
                      <ContentCopyOutlined />
                      Download Table
                    </Button>
                  </>
                )}
              </>
            )}
            {asciiGen && (
              <>
                <Button variant="contained" onClick={() => { setDiscordFormatting(!discordFormatting); }} className='setting-button settings-toggle' sx={{ mb: 3, flewGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <ContentPasteGoOutlined />
                  Discord Formatting
                  <Checkbox checked={discordFormatting} onChange={() => { setDiscordFormatting(!discordFormatting); }} color="default"/>
                </Button>
                <Button variant="contained" onClick={handleImportDialogOpen} className='setting-button settings-toggle' sx={{ mb: 3, display: 'flex', alignItems: 'center' }} >
                  Import Old Table - WIP
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, position: 'sticky', top: 0, zIndex: 1, flexGrow: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Button variant="outlined" sx={{border: 0}} onClick={() => handleSiteClick('Temple')}>
                <img src={Temple} alt="temple" className="temple"/>
              </Button>
              <Button variant="outlined" sx={{border: 0}} onClick={() => handleSiteClick('Hiscores')}>
                <img src={Hiscores} alt="temple" className="temple"/>
              </Button>
            </Box>
          </Box> 
        </Box>

        <Box sx={{ flexGrow: 1, padding: '0 !important' }}>
          <Box className="banner-box" sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', maxWidth: '700px', alignItems: 'flex-end', pl: 3 }}>
              <img src={goldavi} width="125px" height="125px" alt="gold trophy" />
              <Box>
                <Typography sx={{ ml: 2, fontWeight: '500' }} variant='h4'>{asciiGen ? 'Ascii' : isGroup ? isLeaderboard ?  'Leaderboard' : 'Group' : 'Individual' }  Pet List Generator</Typography>
                {!isGroup && !asciiGen && (
                  <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Enter your RuneScape username and click the magnifying glass.
                  <br />
                  By querying the Temple&apos;s API the table will display your pets below.
                  <br />
                  If your data is not found, use the TempleOSRS Plugin to update your data.
                  <br />
                  Use the sidebar options to customize the chart&apos;s visual appearance.
                  </Typography>
                )}
                {isGroup && !asciiGen && (
                  <Typography sx={{ ml: 2, fontWeight: '300' }} variant='body2'>
                  Enter your Group / Clans Temple Id and click the magnifying glass.
                  <br />
                  This will query the Temple&apos;s API to retrieve and display your groups pets in the chart below.
                  <br />
                  Use the sidebar options to customize the chart&apos;s visual appearance or toggle between leaderboard and comparative mode.
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
              <Snackbar
                open={openError}
                autoHideDuration={8000}
                onClose={() => setOpenError(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Zoom}
              >
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{ borderRadius: 3, boxShadow: 3, minWidth: 400, alignItems: 'center', fontSize: '1.1em', background: '#2d232b', color: '#fff' }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setOpenError(false)}
                      sx={{ mt: '-4px' }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                <h3 style={{ margin: 0, fontSize: '1.2em' }}>Error, No data found for this RSN.</h3>
                  To have your pet data uploaded to Temple, it requires the RuneLite plugin <b>TempleOSRS</b> to be installed and the <b>Automatically sync Collection Log</b> option to be selected.<br/>
                  For more information please refer to <a href="https://www.templeosrs.com/faq.php#FAQ_22" target="_blank" rel="noopener noreferrer" style={{color:'#ffb300'}}>this FAQ (Collection Log Section)</a>.
                </Alert>
              </Snackbar>
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <PetTable 
                totalPets={totalPets}
                totalHours={totalHours}
                petCounts={petCounts} 
                transmogs={transmogs}
                isGroup={isGroup} 
                missingMode={missingMode} 
                detailedMode={isDetailed} 
                showDusts={showDusts}
                showToa={showToa}
                combinedMissing={combinedMissing} 
                manualMode={manualMode}
                kcMode={kcMode}
                ref={ref}
                petCountColor={petCountColor}
                petHoursColor={petHoursColor}
                petBgColor1={petBgColor1}
                petBgColor2={petBgColor2}
                avatarImage={avatarImage}
                isCompact={isCompact}
                hideAvatar={hideAvatar}
                player={player}
                onSetPetCountColor={setPetCountColor}
                onSetPetHoursColor={setPetHoursColor}
                onSetPetBgColor1={setPetBgColor1}
                onSetPetBgColor2={setPetBgColor2}
                onSetPlayer={setPlayer}
                onSetHideAvatar={setHideAvatar}
                onSetIsCompact={setIsCompact}
              />
            </Box>
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
        </Box>
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

