import React, { useState, useEffect, RefObject } from 'react';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, useTheme, Fade, Switch, FormControlLabel, FormGroup, ToggleButton as MuiToggleButton, ToggleButtonGroup as MuiToggleButtonGroup, Checkbox, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import * as InvyPet from '../resources/pets/inv';
import * as DetailedPet from '../resources/pets/detailed';
import goldTrophy from '../resources/pets/assets/goldped.png';
import silverTrophy from '../resources/pets/assets/silverped.png';
import bronzeTrophy from '../resources/pets/assets/bronzeped.png';
import otherTrophy from '../resources/pets/assets/otherped.png';
import DefaultIcon from '../resources/pets/assets/chat.png';
import axios from 'axios';

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
  likelihoodMode: boolean;
  ref: RefObject<HTMLDivElement>;
  petCountColor: string;
  petHoursColor: string;
  petBgColor1: string;
  petBgColor2: string;
  onSetPetCountColor: (color: string) => void;
  onSetPetHoursColor: (color: string) => void;
  onSetPetBgColor1: (color: string) => void;
  onSetPetBgColor2: (color: string) => void;
  onSetPlayer: (name: string) => void;
  onSetHideAvatar: (hide: boolean) => void;
  onSetIsCompact: (compact: boolean) => void;
  player: string;
  avatarImage?: string | null;
  hideAvatar?: boolean;
  isCompact?: boolean;
}

export default function PetTable({ totalPets, totalHours, petCounts, transmogs, isGroup, missingMode, detailedMode, showDusts, showToa, combinedMissing, manualMode, kcMode, likelihoodMode, ref, petCountColor, petHoursColor, petBgColor1, petBgColor2, avatarImage, isCompact, hideAvatar, player, onSetPetCountColor, onSetPetHoursColor, onSetPetBgColor1, onSetPetBgColor2, onSetPlayer, onSetHideAvatar, onSetIsCompact }: PetTableProps) {
  const [manualPets, setManualPets] = useState<PetCountResponse>({
    pet_count: 0,
    pet_hours: 0,
    pets: {},
    player: '',
    rank: 0
  });
  // const [confirmed, setConfirmed] = useState(false);
  const [kcValues, setKcValues] = useState<{ [key: string]: string }>({});
  // For likelihood mode: per-pet KC for rate calculation
  const [likelihoodKcValues, setLikelihoodKcValues] = useState<{ [key: string]: string }>({});
  // Store the calculated rateDisplay for each pet
  const [likelihoodValues, setLikelihoodValues] = useState<{ [key: string]: string }>({});
  const [passedPets, setPassedPets] = useState(petCounts);
  const [exportedKcData, setExportedKcData] = useState<string | null>(null);
  const [petHoursMap, setPetHoursMap] = useState<{ [petName: string]: number }>({});
  const [accountType, setAccountType] = useState<'main' | 'ironman'>('main');
  const [kcExportOpen, setKcExportOpen] = useState(false);
  const [kcTableOpen, setKcTableOpen] = useState(true);
  const [likelihoodExportOpen, setLikelihoodExportOpen] = useState(false);
  const [likelihoodTableOpen, setLikelihoodTableOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


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

  useEffect(() => {
    const hoursUrl = 'https://templeosrs.com/api/pets/hours.php';
    const proxyUrl = 'https://corsproxy.io/?';
    async function fetchPetHours() {
      try {
        const response = await axios.get(proxyUrl + encodeURIComponent(hoursUrl));
        if (response && response.data) {
          // The response is an object with pet names as keys
          const hoursMap: { [petName: string]: number } = {};
          Object.values(response.data).forEach((entry: any) => {
            if (entry.pet_name && typeof entry.pet_hours === 'number') {
              hoursMap[entry.pet_name] = entry.pet_hours;
            }
          });
          setPetHoursMap(hoursMap);
        }
      } catch (error) {
        // fallback: do nothing, keep previous value
      }
    }
    fetchPetHours();
  }, []);

  const getPetIconClass = (petName: string, pets: PetData) => {
    if (manualMode) {
      return manualPets.pets[petName] ? 'obtained-pet-icon' : 'pet-icon';
    }
    return Object.entries(pets).find(([name, count]) => name === petName && count === 1)
      ? 'obtained-pet-icon'
      : 'pet-icon';
  };

  const handlePetClick = (petName: string) => {
    const excludedPets = ["Metamorphic Dust", "Sanguine Dust", "Akkha", "Baba", "Kephri", "Zebak", "Warden"];
    setManualPets(prevState => {
      const isExcluded = excludedPets.includes(petName);
      const newPetCount = isExcluded ? prevState.pet_count : Object.values(prevState.pets).filter(count => count === 1).length + (prevState.pets[petName] ? -1 : 1);
      const petHoursEntry = petHours.find(pet => pet.petName === petName);
      const newPetHours = petHoursEntry ? petHoursEntry.hours : 0;
      const totalPetHours = isExcluded ? prevState.pet_hours : prevState.pet_hours + (prevState.pets[petName] ? -newPetHours : newPetHours);
      return {
        ...prevState,
        pets: {
          ...prevState.pets,
          [petName]: prevState.pets[petName] ? 0 : 1
        },
        pet_count: newPetCount,
        pet_hours: totalPetHours
      };
    });
  };

  // const handleConfirm = () => {
  //   setConfirmed(true);
  // }

  const handleKcChange = (petName: string, value: string) => {
    setKcValues(prevState => ({
      ...prevState,
      [petName]: value
    }));
  };

  // For likelihood mode: handle per-pet KC for rate calculation
  const handleLikelihoodKcChange = (petName: string, value: string) => {
    setLikelihoodKcValues(prevState => ({
      ...prevState,
      [petName]: value
    }));
  };

  // Update likelihoodValues (rateDisplay) whenever likelihoodKcValues or accountType changes
  useEffect(() => {
    if (!likelihoodMode) return;
    const newLikelihoodValues: { [key: string]: string } = {};
    Object.keys(likelihoodKcValues).forEach(petName => {
      const rateObj = petRates.find(r => r.pet === petName);
      const dropRate = rateObj ? Number(rateObj.dropRate) : null;
      const kc = Number(likelihoodKcValues[petName] || 0);
      if (dropRate && kc > 0) {
        const x = kc / dropRate;
        newLikelihoodValues[petName] = x < 10 ? x.toFixed(2) + 'x' : Math.round(x) + 'x';
      } else {
        newLikelihoodValues[petName] = '';
      }
    });
    setLikelihoodValues(newLikelihoodValues);
  }, [likelihoodKcValues, accountType, likelihoodMode]);

  const handleExportPetData = () => {
    let exportSource: { [key: string]: PetCountResponse };
    if (manualMode) {
      exportSource = { 'manual': manualPets };
    } else {
      exportSource = passedPets;
    }
    // Export kc values and likelihood rates per pet
    const petsExport = Object.keys(exportSource).reduce((acc, key) => {
      const petCount = exportSource[key];
      const obtainedPets = Object.keys(petCount.pets).filter(petName => petCount.pets[petName] === 1);
      const petData = obtainedPets.reduce((petAcc, petName) => {
        petAcc[petName] = kcValues[petName] || 0;
        return petAcc;
      }, {} as { [key: string]: string | number });
      acc[key] = petData;
      return acc;
    }, {} as { [key: string]: { [key: string]: string | number } });

    // Export likelihoodKcValues (rate input) for obtained pets
    const likelihoodKcExport: { [key: string]: { [key: string]: string } } = {};
    Object.keys(exportSource).forEach(key => {
      const petCount = exportSource[key];
      const obtainedPets = Object.keys(petCount.pets).filter(petName => petCount.pets[petName] === 1);
      const kcObj: { [key: string]: string } = {};
      obtainedPets.forEach(petName => {
        kcObj[petName] = likelihoodKcValues[petName] || '';
      });
      likelihoodKcExport[key] = kcObj;
    });

    const exportedData = {
      pets: petsExport,
      likelihoodKcValues: likelihoodKcExport,
      petCountColor,
      petHoursColor,
      petBgColor1,
      petBgColor2,
      player,
      hideAvatar,
      isCompact
    };
    const exportedString = JSON.stringify(exportedData, null, 2);
    setExportedKcData(exportedString);
    navigator.clipboard.writeText(exportedString)
      .then(() => {
        alert('Pet data copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy pet data: ', err);
      });
  };

  const handleImportPetData = () => {
    navigator.clipboard.readText()
      .then(text => {
        const importedData = JSON.parse(text);
        // Handle pets
        const petsData = importedData.pets || importedData; // fallback for old format
        const newKcValues = Object.keys(petsData).reduce((acc, key) => {
          const petData = petsData[key];
          Object.keys(petData).forEach(petName => {
            acc[petName] = petData[petName].toString();
          });
          return acc;
        }, {} as { [key: string]: string });
        setKcValues(newKcValues);

        // If likelihoodKcValues is empty for a pet, set it to sanitized KC value
        setLikelihoodKcValues(prev => {
          const updated = { ...prev };
          Object.keys(newKcValues).forEach(petName => {
            if (!prev[petName] || prev[petName] === '') {
              // Remove commas and non-digit characters
              const sanitized = newKcValues[petName].replace(/[^0-9]/g, '');
              updated[petName] = sanitized;
            }
          });
          return updated;
        });

        // Restore likelihoodKcValues (rate input) if present
        if (importedData.likelihoodKcValues) {
          // Flatten all pets from all keys into one object
          const allKc: { [key: string]: string } = {};
          Object.values(importedData.likelihoodKcValues).forEach((kcObj: any) => {
            Object.entries(kcObj).forEach(([petName, kc]) => {
              allKc[petName] = kc as string;
            });
          });
          setLikelihoodKcValues(allKc);
        }

        if (manualMode) {
          const updatedPets: PetData = { ...manualPets.pets };
          Object.keys(newKcValues).forEach(petName => {
            const val = newKcValues[petName];
            updatedPets[petName] = val !== "0" && val !== null && val !== undefined && val !== '' ? 1 : 0;
          });
          const newPetCount = Object.values(updatedPets).filter(v => v === 1).length;
          setManualPets(prev => ({
            ...prev,
            pets: updatedPets,
            pet_count: newPetCount
          }));
        }
        // Handle colors and settings
        if (importedData.petCountColor) onSetPetCountColor(importedData.petCountColor);
        if (importedData.petHoursColor) onSetPetHoursColor(importedData.petHoursColor);
        if (importedData.petBgColor1) onSetPetBgColor1(importedData.petBgColor1);
        if (importedData.petBgColor2) onSetPetBgColor2(importedData.petBgColor2);
        if (importedData.player) {
          onSetPlayer(importedData.player);
          if (manualMode) {
            setManualPets(prev => ({
              ...prev,
              player: importedData.player
            }));
          } else {
            // For non-manual mode, update the first petCounts entry
            setPassedPets(prev => {
              const keys = Object.keys(prev);
              if (keys.length > 0) {
                const firstKey = keys[0];
                return {
                  ...prev,
                  [firstKey]: {
                    ...prev[firstKey],
                    player: importedData.player
                  }
                };
              }
              return prev;
            });
          }
        }
        if (typeof importedData.hideAvatar === 'boolean') onSetHideAvatar(importedData.hideAvatar);
        if (typeof importedData.isCompact === 'boolean') onSetIsCompact(importedData.isCompact);
        alert('Pet data imported successfully!');
      })
      .catch(err => {
        console.error('Failed to read pet data from clipboard: ', err);
      });
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
          <Typography variant="body2" className="kc-mode-text">
            {kcValues[petName]}
          </Typography>
        )}
        {likelihoodMode && petIconClass === 'obtained-pet-icon' && (() => {
          // Color logic for rateDisplay (copied from grid rendering)
          let rateColor = 'white';
          const rateObj = petRates.find(r => r.pet === petName);
          const dropRate = rateObj ? Number(rateObj.dropRate) : null;
          const kc = Number(likelihoodKcValues[petName] || 0);
          if (dropRate && kc > 0) {
            const x = kc / dropRate;
            if (x < 1.25) rateColor = 'limegreen';
            else if (x < 2) rateColor = 'yellow';
            else if (x < 3) rateColor = 'orange';
            else if (x >= 3) rateColor = 'red';
          }
          return (
            <Typography variant="body2" className="likelihood-mode-text" sx={{ color: rateColor }}>
              {likelihoodValues[petName]}
            </Typography>
          );
        })()}
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
    "Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte","Bran","Yami",
    "Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel",
    "Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling",
    "Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme",
    "Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid",
    "Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi",
    "Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit",
    "Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring",
    "Olmlet", "Lil' zik", "Tumeken's guardian",
    "Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector",
    "Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin","Dom",
    "Metamorphic Dust", "Sanguine Dust",
    "Akkha", "Baba", "Kephri", "Zebak", "Warden"
  ];

  //something off here
  const petHours = [
    { petName: "Pet chaos elemental", hours: 3 },
    { petName: "Pet dagannoth supreme", hours: 57 },
    { petName: "Pet dagannoth prime", hours: 57 },
    { petName: "Pet dagannoth rex", hours: 57 },
    { petName: "Pet penance queen", hours: 308 },
    { petName: "Pet kree'arra", hours: 100 },
    { petName: "Pet general graardor", hours: 91 },
    { petName: "Pet k'ril tsutsaroth", hours: 77 },
    { petName: "Pet zilyana", hours: 77 },
    { petName: "Baby mole", hours: 33 },
    { petName: "Prince black dragon", hours: 25 },
    { petName: "Kalphite princess", hours: 60 },
    { petName: "Pet smoke devil", hours: 27 },
    { petName: "Pet kraken", hours: 30 },
    { petName: "Pet dark core", hours: 77 },
    { petName: "Pet snakeling", hours: 91 },
    { petName: "Chompy chick", hours: 2 },
    { petName: "Venenatis spiderling", hours: 51 },
    { petName: "Callisto cub", hours: 43 },
    { petName: "Vet'ion jr.", hours: 51 },
    { petName: "Scorpia's offspring", hours: 16 },
    { petName: "Tzrek-jad", hours: 27 },
    { petName: "Hellpuppy", hours: 46 },
    { petName: "Abyssal orphan", hours: 57 },
    { petName: "Phoenix", hours: 100 },
    { petName: "Olmlet", hours: 403 },
    { petName: "Skotos", hours: 65 },
    { petName: "Jal-nib-rek", hours: 43 },
    { petName: "Noon", hours: 83 },
    { petName: "Vorki", hours: 88 },
    { petName: "Ikkle hydra", hours: 100 },
    { petName: "Sraracha", hours: 30 },
    { petName: "Youngllef", hours: 114 },
    { petName: "Smolcano", hours: 56 },
    { petName: "Lil' creator", hours: 28 },
    { petName: "Rift guardian", hours: 68 },
    { petName: "Beaver", hours: 111 },
    { petName: "Rock golem", hours: 118 },
    { petName: "Baby chinchompa", hours: 99 },
    { petName: "Rocky", hours: 18 },
    { petName: "Tangleroot", hours: 82 },
    { petName: "Heron", hours: 84 },
    { petName: "Giant squirrel", hours: 133 },
    { petName: "Herbi", hours: 96 },
    { petName: "Bloodhound", hours: 286 },
    { petName: "Tiny tempor", hours: 100 },
    { petName: "Lil' zik", hours: 179 },
    { petName: "Little nightmare", hours: 187 },
    { petName: "Nexling", hours: 174 },
    { petName: "Abyssal protector", hours: 103 },
    { petName: "Tumeken's guardian", hours: 148 },
    { petName: "Muphin", hours: 83 },
    { petName: "Wisp", hours: 95 },
    { petName: "Butch", hours: 81 },
    { petName: "Baron", hours: 83 },
    { petName: "Lil'viathan", hours: 83 },
    { petName: "Scurry", hours: 50 },
    { petName: "Smol Heredit", hours: 40 },
    { petName: "Quetzin", hours: 42 },
    { petName: "Nid", hours: 33 },
    { petName: "Huberte", hours: 47 },
    { petName: "Moxi", hours: 36 },
    { petName: "Bran", hours: 100 },
    { petName: "Yami", hours: 10 },
    { petName: "Dom", hours: 0 }
  ];

  const petRates = [
    { main: "100", iron: "48", dropRate: "300", pet: "Pet chaos elemental" },
    { main: "88", iron: "22", dropRate: "5000", pet: "Pet dagannoth supreme" },
    { main: "88", iron: "25", dropRate: "5000", pet: "Pet dagannoth prime" },
    { main: "88", iron: "25", dropRate: "5000", pet: "Pet dagannoth rex" },
    { main: "3.25", iron: "26", dropRate: "1000", pet: "Pet penance queen" },
    { main: "50", iron: "95", dropRate: "5000", pet: "Pet kree'arra" },
    { main: "55", iron: "105", dropRate: "5000", pet: "Pet general graardor" },
    { main: "65", iron: "100", dropRate: "5000", pet: "Pet k'ril tsutsaroth" },
    { main: "65", iron: "85", dropRate: "5000", pet: "Pet zilyana" },
    { main: "90", iron: "30", dropRate: "3000", pet: "Baby mole" },
    { main: "120", iron: "75", dropRate: "3000", pet: "Prince black dragon" },
    { main: "50", iron: "23", dropRate: "3000", pet: "Kalphite princess" },
    { main: "110", iron: "35", dropRate: "3000", pet: "Pet smoke devil" },
    { main: "100", iron: "18", dropRate: "3000", pet: "Pet kraken" },
    { main: "65", iron: "48", dropRate: "5000", pet: "Pet dark core" },
    { main: "44", iron: "80", dropRate: "4000", pet: "Pet snakeling" },
    { main: "300", iron: "75", dropRate: "500", pet: "Chompy chick" },
    { main: "55", iron: "60", dropRate: "2000", pet: "Venenatis spiderling" },
    { main: "55", iron: "18", dropRate: "2800", pet: "Venenatis spiderling (Spindel)" },
    { main: "65", iron: "6.5", dropRate: "2000", pet: "Callisto cub" },
    { main: "65", iron: "32", dropRate: "2800", pet: "Callisto cub (Artio)" },
    { main: "55", iron: "2", dropRate: "2000", pet: "Vet'ion jr." },
    { main: "55", iron: "0.9", dropRate: "2800", pet: "Vet'ion jr. (Calvar'ion)" },
    { main: "130", iron: "81", dropRate: "2016", pet: "Scorpia's offspring" },
    { main: "2.5", iron: "100", dropRate: "67", pet: "Tzrek-jad" },
    { main: "2", iron: "54", dropRate: "100", pet: "Tzrek-jad (Offtask)" },
    { main: "65", iron: "32", dropRate: "3000", pet: "Hellpuppy" },
    { main: "45", iron: "38", dropRate: "2560", pet: "Abyssal orphan" },
    { main: "50", iron: "50", dropRate: "5000", pet: "Phoenix" },
    { main: "1.71", iron: "12", dropRate: "178", pet: "Phoenix (Solo)" },
    { main: "3.5", iron: "2.7", dropRate: "53", pet: "Olmlet" },
    { main: "3", iron: "1.8", dropRate: "1210", pet: "Olmlet (Challenge mode)" },
    { main: "1", iron: "80", dropRate: "65", pet: "Skotos" },
    { main: "1", iron: "31", dropRate: "43", pet: "Jal-nib-rek" },
    { main: "0.67", iron: "33", dropRate: "50", pet: "Jal-nib-rek (Offtask)" },
    { main: "36", iron: "9", dropRate: "3000", pet: "Noon" },
    { main: "34", iron: "2.7", dropRate: "3000", pet: "Vorki" },
    { main: "3", iron: "3", dropRate: "650", pet: "Lil' zik" },
    { main: "2.8", iron: "2.3", dropRate: "500", pet: "Lil' zik (Hard Mode)" },
    { main: "30", iron: "27", dropRate: "3000", pet: "Ikkle hydra" },
    { main: "100", iron: "50", dropRate: "3000", pet: "Sraracha" },
    { main: "7", iron: "50", dropRate: "800", pet: "Youngllef (Corrupted Gauntlet)" },
    { main: "10", iron: "56", dropRate: "2000", pet: "Youngllef (Normal Gauntlet)" },
    { main: "40", iron: "40", dropRate: "2250", pet: "Smolcano" },
    { main: "430", iron: "10", dropRate: "12000", pet: "Lil' creator" },
    { main: "80", iron: "7.2", dropRate: "8000", pet: "Tiny tempor" },
    { main: "23.5", iron: "9", dropRate: "4100", pet: "Nexling" },
    { main: "39", iron: "6.5", dropRate: "4000", pet: "Abyssal protector" },
    { main: "2.5", iron: "2.5", dropRate: "371", pet: "Tumeken's guardian" },
    { main: "3.75", iron: "20", dropRate: "800", pet: "Little nightmare" },
    { main: "7.5", iron: "3", dropRate: "1400", pet: "Phosani" },
    { main: "6", iron: "6", dropRate: "1000", pet: "Bloodhound" },
    { main: "0", iron: "0", dropRate: "400", pet: "Lil' Creator" },
    { main: "30", iron: "25", dropRate: "2500", pet: "Muphin" },
    { main: "21", iron: "21", dropRate: "2000", pet: "Wisp" },
    { main: "37", iron: "33", dropRate: "3000", pet: "Butch" },
    { main: "30", iron: "28", dropRate: "2500", pet: "Baron" },
    { main: "30", iron: "25", dropRate: "2500", pet: "Lil'viathan" },
    { main: "60", iron: "60", dropRate: "3000", pet: "Scurry" },
    { main: "2.5", iron: "2.5", dropRate: "100", pet: "Smol heredit" },
    { main: "45", iron: "45", dropRate: "3000", pet: "Nid" },
    { main: "45", iron: "45", dropRate: "1500", pet: "Nid (Destroy)" },
    { main: "8.5", iron: "8.5", dropRate: "400", pet: "Huberte" },
    { main: "84", iron: "84", dropRate: "3000", pet: "Moxi" },
    { main: "60", iron: "60", dropRate: "3000", pet: "Bran" },
    { main: "60", iron: "60", dropRate: "1500", pet: "Bran (Sacrifice)" },
    { main: "10", iron: "10", dropRate: "100", pet: "Yami" },
    { main: "0", iron: "0", dropRate: "6500", pet: "Herbi" },
    { main: "0", iron: "0", dropRate: "1000", pet: "Quetzin" },
  ];


  const getTotalPetHours = () => {
    if (manualMode) {
      return manualPets.pet_hours;
    }
    if (petCounts && petCounts['1'] && petCounts['1'].pets && Object.keys(petHoursMap).length > 0) {
      return Object.entries(petCounts['1'].pets)
        .filter(([petName, obtained]) => obtained === 1 && petHoursMap[petName] !== undefined)
        .reduce((sum, [petName]) => sum + petHoursMap[petName], 0);
    }
    return 0;
  };

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ p: isMobile ? 0 : '24px', pt: isMobile ? '24px' : 0}}>
    {Object.keys(passedPets).length > 0 && (
      Object.entries(passedPets).map(([key, petCount]) => (
        <div key={key}>
        <Box ref={ref} sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid container className="pet-container">
            {!isCompact ? 
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
            <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{display: 'flex', flexGrow: '0'}}>
              <div style={{ height: "160px", width: "120px" }}>
                <CircularProgressbar 
                value={manualMode ? manualPets.pet_count / totalPets : petCount.pet_count / totalPets} 
                maxValue={1} 
                text={`${manualMode ? manualPets.pet_count : petCount.pet_count} / ${totalPets}`} 
                styles={buildStyles({
                strokeLinecap: 'round',
                pathTransitionDuration: 3,

                // Colors
                pathColor: petCountColor,
                textColor: petCountColor,
                trailColor: '#181818',
                })}/>
                <Typography variant="h6" sx={{textAlign: 'center', mt: 1}}>Pet Count</Typography>
              </div>
            </Box>
            </Grid>

            {!isGroup && (
              <>
              <Grid size={{xs: 4}} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                {/* <img src={avatarImage || `https://services.runescape.com/m=avatar-rs/${petCount.player}/chat.png`} alt="avatar" className='charIcon' style={{ maxWidth: '100px', maxHeight: '100px' }} /> */}
                {!hideAvatar && (<img src={avatarImage || DefaultIcon} alt="avatar" className='charIcon' style={{ maxWidth: '100px', maxHeight: '100px' }} />)}
                <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{player}</Typography>
              </Grid>
              </>
            )}

            {isGroup && (
            <Grid size={{xs: 4}} sx={{display: 'flex', justifyContent: 'center'}}>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography variant="h3" sx={{textAlign: 'center', mb: 5}}>{petCount.player}</Typography>
              <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative', flexGrow: 0}}>
                <div style={{ height: "170px", width: "200px" }}>
                <img src={getTrophyImage(petCount.rank) || otherTrophy} alt="trophy" style={{ position: 'absolute', top: 0, width: '200px', height: '150px', zIndex: '0' }} />
                <Typography variant="h6" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>Rank</Typography>
                <Typography variant="h1" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>{petCount.rank}</Typography>
                </div>
              </Box>
              
              </Box>
            </Grid>
            )}

            <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{display: 'flex', flexGrow: '0'}}>
              <div style={{ height: "160px", width: "120px" }}>
                <CircularProgressbar 
                value={getTotalPetHours() / totalHours} 
                maxValue={1} 
                text={`${getTotalPetHours()}h`}
                styles={buildStyles({
                  strokeLinecap: 'round',
                  pathTransitionDuration: 3,

                  // Colors
                  pathColor: petHoursColor,
                  textColor: petHoursColor,
                  trailColor: '#181818',
                })}
                />
                <Typography variant="h6" sx={{textAlign: 'center', mt: 1}}>Pet Hours</Typography>
              </div>
            </Box>
            </Grid>
            </Box> :
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
            {!isGroup && (
              <>
              <Grid size={{xs: 7}} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                {/* <img src={avatarImage || `https://services.runescape.com/m=avatar-rs/${petCount.player}/chat.png`} alt="avatar" className='charIcon' style={{ maxWidth: '100px', maxHeight: '100px' }} /> */}
                {!hideAvatar && (<img src={avatarImage || DefaultIcon} alt="avatar" className='charIcon' style={{ maxWidth: '100px', maxHeight: '100px' }} />)}
                <Typography variant="h3" sx={{textAlign: 'center', ml: 5}}>{player}</Typography>
              </Grid>
              </>
            )}

            {isGroup && (
            <Grid size={{xs: 7}} sx={{display: 'flex', justifyContent: 'center', ml: 5}}>
              <Box sx={{display: 'flex', flexDirection: 'row'}}>
              <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative', flexGrow: 0}}>
                <div style={{ height: "170px", width: "200px" }}>
                <img src={getTrophyImage(petCount.rank) || otherTrophy} alt="trophy" style={{ position: 'absolute', top: 0, width: '200px', height: '150px', zIndex: '0' }} />
                <Typography variant="h6" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>Rank</Typography>
                <Typography variant="h1" sx={{textAlign: 'center', position: 'relative', zIndex: '1'}}>{petCount.rank}</Typography>
                </div>
              </Box>
              <Typography variant="h3" sx={{textAlign: 'center', ml: 5, mt: 4}}>{petCount.player}</Typography>
              
              </Box>
            </Grid>
            )}

            <Grid size={{xs: 4 }} sx={{display: 'flex', justifyContent: 'end'}}>
            <Box sx={{display: 'flex', flexGrow: '0'}}>
              <div style={{ height: "160px", width: "120px" }}>
                <CircularProgressbar 
                value={manualMode ? manualPets.pet_count / totalPets : petCount.pet_count / totalPets} 
                maxValue={1} 
                text={`${manualMode ? manualPets.pet_count : petCount.pet_count} / ${totalPets}`} 
                styles={buildStyles({
                strokeLinecap: 'round',
                pathTransitionDuration: 3,

                // Colors
                pathColor: petCountColor,
                textColor: petCountColor,
                trailColor: '#181818',
                })}/>
                <Typography variant="h6" sx={{textAlign: 'center', mt: 1}}>Pet Count</Typography>
              </div>
            </Box>
            </Grid>
            </Box> }
              {manualMode && missingMode && combinedMissing ? (
                renderMissingPets(manualPets.pets)
              ) : manualMode && combinedMissing ? (
                <>
                  {renderObtainedPets("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte", "Bran", "Yami"], manualPets.pets)}
                  {renderObtainedPets("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], manualPets.pets)}
                  {renderObtainedPets("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], manualPets.pets)}
                  {renderObtainedPets("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], manualPets.pets)}
                  {renderObtainedPets("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], manualPets.pets)}
                  {renderObtainedPets("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], manualPets.pets)}
                  {renderObtainedPets("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], manualPets.pets)}
                  {renderObtainedPets("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], manualPets.pets)}
                  {renderObtainedPets("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], manualPets.pets)}
                  {renderObtainedPets("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], manualPets.pets)}
                  {renderObtainedPets("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin", "Dom"], manualPets.pets)}
                  {renderMissingPets(manualPets.pets)}
                </>
              ) : manualMode ? (
                <>
                  {renderPetGrid("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte", "Bran", "Yami"], manualPets.pets)}
                  {renderPetGrid("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], manualPets.pets)}
                  {renderPetGrid("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], manualPets.pets)}
                  {renderPetGrid("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], manualPets.pets)}
                  {renderPetGrid("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], manualPets.pets)}
                  {renderPetGrid("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], manualPets.pets)}
                  {renderPetGrid("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], manualPets.pets)}
                  {renderPetGrid("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], manualPets.pets)}
                  {renderPetGrid("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], manualPets.pets)}
                  {renderPetGrid("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], manualPets.pets)}
                  {renderPetGrid("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin", "Dom"], manualPets.pets)}
                  {showDusts && renderPetGrid("Dusts", ["Metamorphic Dust", "Sanguine Dust"], petCount.pets)}
                  {showToa && renderPetGrid("Toa Transmogs", ["Akkha", "Baba", "Kephri", "Zebak", "Warden"], petCount.pets)}
                </>
              ): missingMode && combinedMissing && !manualMode ? (
                renderMissingPets(petCount.pets)
              ) : combinedMissing && !manualMode ? (
                <>
                  {renderObtainedPets("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte", "Bran", "Yami"], petCount.pets)}
                  {renderObtainedPets("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], petCount.pets)}
                  {renderObtainedPets("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], petCount.pets)}
                  {renderObtainedPets("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], petCount.pets)}
                  {renderObtainedPets("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], petCount.pets)}
                  {renderObtainedPets("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], petCount.pets)}
                  {renderObtainedPets("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], petCount.pets)}
                  {renderObtainedPets("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], petCount.pets)}
                  {renderObtainedPets("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], petCount.pets)}
                  {renderObtainedPets("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], petCount.pets)}
                  {renderObtainedPets("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin", "Dom"], petCount.pets)}
                  {renderMissingPets(petCount.pets)}
                </>
              ) : (
                <>
                  {renderPetGrid("Group", ["Baby mole", "Prince black dragon", "Kalphite princess", "Pet dark core", "Sraracha", "Little nightmare", "Scurry", "Huberte", "Bran","Yami"], petCount.pets)}
                  {renderPetGrid("Skilling", ["Rift guardian", "Beaver", "Rock golem", "Baby chinchompa", "Rocky", "Tangleroot", "Heron", "Giant squirrel"], petCount.pets)}
                  {renderPetGrid("GWD", ["Pet kree'arra", "Pet general graardor", "Pet k'ril tsutsaroth", "Pet zilyana", "Nexling"], petCount.pets)}
                  {renderPetGrid("DKS", ["Pet dagannoth rex", "Pet dagannoth prime", "Pet dagannoth supreme"], petCount.pets)}
                  {renderPetGrid("Slayer", ["Pet smoke devil", "Pet kraken", "Hellpuppy", "Abyssal orphan", "Noon", "Ikkle hydra", "Nid"], petCount.pets)}
                  {renderPetGrid("Quest", ["Vorki", "Muphin", "Wisp", "Butch", "Baron", "Lil'viathan", "Moxi"], petCount.pets)}
                  {renderPetGrid("PvM Minigame", ["Tzrek-jad", "Jal-nib-rek", "Youngllef", "Lil' creator", "Smol Heredit"], petCount.pets)}
                  {renderPetGrid("Wilderness", ["Pet chaos elemental", "Venenatis spiderling", "Callisto cub", "Vet'ion jr. ", "Scorpia's offspring"], petCount.pets)}
                  {renderPetGrid("Raids", ["Olmlet", "Lil' zik", "Tumeken's guardian"], petCount.pets)}
                  {renderPetGrid("Skilling Minigames", ["Pet penance queen", "Phoenix", "Smolcano", "Tiny tempor", "Abyssal protector"], petCount.pets)}
                  {renderPetGrid("Miscellaneous", ["Pet snakeling", "Chompy chick", "Skotos", "Herbi", "Bloodhound", "Quetzin", "Dom"], petCount.pets)}
                  {showDusts && renderPetGrid("Dusts", ["Metamorphic Dust", "Sanguine Dust"], petCount.pets)}
                  {showToa && renderPetGrid("Toa Transmogs", ["Akkha", "Baba", "Kephri", "Zebak", "Warden"], petCount.pets)}
                </>
              )}
            </Grid>
          </Box>
          {kcMode && (
            <>
              <Typography variant='h4' sx={{fontWeight: 500, textAlign: 'center'}}>KC Mode{likelihoodMode && ' + Likelihood'}</Typography>
              <Box sx={{display: 'flex', mb: 2, justifyContent: 'space-evenly'}}>
                <Button variant="contained" className='setting-button settings-toggle' onClick={handleImportPetData}>Import Data</Button>
                <Button variant="contained" className='setting-button settings-toggle' onClick={handleExportPetData}>Export Data</Button>
                <Button variant="contained" className='setting-button settings-toggle' onClick={() => setKcExportOpen(v => !v)}>{kcExportOpen ? 'Hide Export' : 'Show Export'}</Button>
                <Button variant="contained" className='setting-button settings-toggle' onClick={() => setKcTableOpen(v => !v)}>{kcTableOpen ? 'Hide Table' : 'Show Table'}</Button>
              </Box>
              {exportedKcData && (
                <Box sx={{mb: 2, mx: 'auto', maxWidth: 700}}>
                  <Collapse in={kcExportOpen}>
                    <Typography variant="body2" sx={{whiteSpace: 'pre-wrap', color: 'white', background: '#222', p: 2, borderRadius: 2}}>
                      {exportedKcData}
                    </Typography>
                  </Collapse>
                </Box>
              )}
              <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <Collapse in={kcTableOpen} sx={{width: '100%'}}>
                  <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(3, 1fr)',
                          sm: 'repeat(4, 1fr)',
                          md: 'repeat(5, 1fr)',
                          lg: 'repeat(6, 1fr)',
                        },
                        gap: 2,
                        width: '100%',
                        maxWidth: 1200,
                        p: 2,
                        justifyItems: 'center',
                        alignItems: 'start',
                      }}
                    >
                      {petOrder.filter(petName => getPetIconClass(petName, petCount.pets) === 'obtained-pet-icon').map((petName) => {
                        const formatPetName = (name: string) => {
                          return name.replace(/['-.]/g, '').replace(/\b\w/g, char => char.toUpperCase()).replace(/\s+/g, '');
                        };
                        const petImage = detailedMode ? DetailedPet[formatPetName(petName) as keyof typeof DetailedPet] : InvyPet[formatPetName(petName) as keyof typeof InvyPet];
                        // For likelihood mode: get drop rate and calculate x
                        let rateDisplay = '';
                        let rateColor = 'white';
                        if (likelihoodMode) {
                          rateDisplay = likelihoodValues[petName] || '';
                          // For color, recalculate x for color only
                          const rateObj = petRates.find(r => r.pet === petName);
                          const dropRate = rateObj ? Number(rateObj.dropRate) : null;
                          const kc = Number(likelihoodKcValues[petName] || 0);
                          if (dropRate && kc > 0) {
                            const x = kc / dropRate;
                            if (x < 1.25) rateColor = 'limegreen';
                            else if (x < 2) rateColor = 'yellow';
                            else if (x < 3) rateColor = 'orange';
                            else if (x >= 3) rateColor = 'red';
                          }
                        }
                        return (
                          <Box
                            key={petName}
                            sx={{
                              background: '#181818',
                              borderRadius: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              boxShadow: 2,
                              p: 1,
                              width: '100%',
                              maxWidth: 160,
                              minHeight: likelihoodMode ? 210 : 140,
                            }}
                          >
                            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, minHeight: 44}}>
                              <img src={petImage} alt={petName} style={{width: '100%', maxWidth: 40, height: 40, objectFit: 'contain', zIndex: 1}} />
                            </Box>
                            <Typography variant="body2" sx={{color: 'white', minHeight: 32, textAlign: 'center', wordBreak: 'break-word', fontSize: '0.85em', mb: 1}}>{petName}</Typography>
                            <Typography variant="body2" sx={{color: 'white', minHeight: 32, textAlign: 'center', wordBreak: 'break-word', fontSize: '0.85em', mt: 1}}>Kc Display</Typography>
                            <TextField
                              variant="outlined"
                              size="small"
                              value={kcValues[petName] || ''}
                              onChange={(e) => handleKcChange(petName, e.target.value)}
                              sx={{
                                width: '90%',
                                input: { color: 'white', textAlign: 'center' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white !important' },
                              }}
                              InputProps={{
                                style: { color: 'white', textAlign: 'center' },
                              }}
                            />
                            {likelihoodMode && (
                              <>
                                <Typography variant="body2" sx={{color: 'white', minHeight: 32, textAlign: 'center', wordBreak: 'break-word', fontSize: '0.85em', mt: 1}}>Rate Display</Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  value={likelihoodKcValues[petName] || ''}
                                  onChange={(e) => handleLikelihoodKcChange(petName, e.target.value)}
                                  sx={{
                                    width: '90%',
                                    input: { color: 'white', textAlign: 'center' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white !important' },
                                  }}
                                  InputProps={{
                                    style: { color: 'white', textAlign: 'center' },
                                  }}
                                  placeholder="KC for rate"
                                />
                                <Typography variant="overline" sx={{color: rateColor, mt: 0.5, minHeight: 18, textAlign: 'center'}}>{likelihoodValues[petName]}</Typography>
                              </>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </>
          )}
        </div>
      ))
    )}
  </Box>
    </Fade>
  );
}
