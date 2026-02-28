import '../index.css'
import * as React from 'react';
import { TextField,Box, } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import '../modulesCSS/Location.css'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const places = [
  'Walmart', 
  'Target', 
  'Costco', 
  'Kroger', 
  'Safeway', 
  'Whole Foods', 
  'Aldi', 
  'Trader Joe\'s'
];

export default function Location() {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div className='Location'>
      <div className='addressTextField'>
        <Box
          component="form"
          sx={{ '& > :not(style)': { my: 1, width: '100%' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Enter Address" variant="outlined" />
        </Box>
      </div>

      <div className='storeSelect'>
        <FormControl sx={{ my: 1, width: '100%' }}>
          <InputLabel id="demo-multiple-checkbox-label">Select Nearby Stores</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Select Nearby Stores" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {places.map((place) => {
              const selected = personName.includes(place);
              const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

              return (
                <MenuItem key={place} value={place}>
                  <SelectionIcon
                    fontSize="small"
                    style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                  />
                  <ListItemText primary={place} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}