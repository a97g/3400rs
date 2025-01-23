import React, { useState } from 'react';
import { Box, TextField, Typography, Button, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridRowModesModel, GridRowModes, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import { Edit, Save, Cancel, Add } from '@mui/icons-material';

const petList = [
  "Pet chaos elemental", "Pet dagannoth supreme", "Pet dagannoth prime", "Pet dagannoth rex", "Pet penance queen",
  "Pet kree'arra", "Pet general graardor", "Pet zilyana", "Pet k'ril tsutsaroth", "Baby mole", "Prince black dragon",
  "Kalphite princess", "Pet smoke devil", "Pet kraken", "Pet dark core", "Pet snakeling", "Chompy chick", "Venenatis spiderling",
  "Callisto cub", "Vet'ion jr.", "Scorpia's offspring", "Tzrek-jad", "Hellpuppy", "Abyssal orphan", "Heron", "Rock golem",
  "Beaver", "Baby chinchompa", "Bloodhound", "Giant squirrel", "Tangleroot", "Rift guardian", "Rocky", "Phoenix", "Olmlet",
  "Skotos", "Jal-nib-rek", "Herbi", "Noon", "Vorki", "Lil' zik", "Ikkle hydra", "Sraracha", "Youngllef", "Smolcano",
  "Little nightmare", "Lil' creator", "Tiny tempor", "Nexling", "Abyssal protector", "Tumeken's guardian", "Muphin", "Wisp",
  "Butch", "Lil'viathan", "Baron", "Scurry", "Smol heredit", "Quetzin", "Nid", "Huberte", "Moxi"
];

export default function AsciiGenerator({ discordFormat }: { discordFormat: boolean }) {
  const [rsn, setRsn] = useState('');
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [asciiTable, setAsciiTable] = useState('');
  const [availablePets, setAvailablePets] = useState(petList);

  const handleRowEditStart = (params: any, event: any) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params: any, event: any) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
  };

  const processRowUpdate = (newRow: any) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setAvailablePets(availablePets.filter(pet => pet !== newRow.pet));
    return updatedRow;
  };

  const handleAddRow = () => {
    const newId = rows.length ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    setRows([...rows, { id: newId, pet: '', kc: '', date: '', isNew: true }]);
    setRowModesModel({ ...rowModesModel, [newId]: { mode: GridRowModes.Edit } });
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const columns: GridColDef[] = [
    {
      field: 'pet',
      headerName: 'Pet',
      width: 400,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        >
          {availablePets.map((pet) => (
            <MenuItem key={pet} value={pet}>
              {pet}
            </MenuItem>
          ))}
        </Select>
      )
    },
    { field: 'kc', headerName: 'KC / XP', width: 400, editable: true },
    { field: 'date', headerName: 'Date', width: 150, editable: true, type: 'date' },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem key={`save-${id}`} icon={<Save />} label="Save" onClick={handleSaveClick(id)}/>,
            <GridActionsCellItem key={`cancel-${id}`} icon={<Cancel />} label="Cancel" onClick={handleCancelClick(id)}/>,
          ];
        }
        return [
          <GridActionsCellItem key={`edit-${id}`} icon={<Edit />} label="Edit" onClick={handleEditClick(id)} sx={{color:'white'}}/>,
        ];
      },
    },
  ];

  const generateAsciiTable = () => {
    let table = `
╔═════════════════════════════════════════════════════════════════╗
║                              ${rsn}                               ║
╠═════════════════════════╦════════════════╦══════════════════════╣
║           Pet           ║     KC / XP    ║         Date         ║
╠═════════════════════════╬════════════════╬══════════════════════╣`;

    rows.forEach((row, index) => {
      table += `
║ ${String(index + 1)}. ${row.pet.padEnd(15 - row.pet.length)} ║ ${row.kc.padEnd(14)} ║ ${formatDate(String(row.date)).padEnd(20)} ║`;
    });

    table += `
╚═════════════════════════╩════════════════╩═════════════════════╝`;

    if (discordFormat) {
      table = `\`\`\`asciidoc\n${table}\n\`\`\``;
    }

    setAsciiTable(table);
    navigator.clipboard.writeText(table);
  };

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        label="RSN"
        value={rsn}
        onChange={(e) => setRsn(e.target.value)}
        fullWidth
        variant='outlined'
        sx={{ mb: 2, color: 'white','& .MuiInputLabel-root': {color: 'white !important'}, '& .MuiInputBase-input': {color: 'white !important'}, '& .MuiOutlinedInput-notchedOutline': {borderColor: 'white !important'} }}
      />
      <Box sx={{ height: 600, width: '100%', mb: 2, backgroundColor: '#1b1a1d' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          hideFooter={true}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              color: 'white'
            },
            '.MuiDataGrid-row--borderBottom': {
                background: '#1b1a1d !important',
            },
            '& .MuiDataGrid-row': {
                backgroundColor: '#242328 !important',
            },
            '& .MuiDataGrid-cell': {
              color: 'white'
            },
          }}
        />
      </Box>
      <Button variant="contained" startIcon={<Add />} onClick={handleAddRow} sx={{ mb: 2, mt: 2, mr: 5 }}>Add Pet</Button>
      <Button variant="contained" onClick={generateAsciiTable}>Generate ASCII Table</Button>
      {asciiTable && (
        <Box sx={{ mt: 3, whiteSpace: 'pre' }}>
          <Typography variant="body1">{asciiTable}</Typography>
        </Box>
      )}
    </Box>
  );
}