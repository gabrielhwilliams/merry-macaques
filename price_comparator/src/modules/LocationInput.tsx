import '../index.css'
import { TextField,Box, } from '@mui/material';

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { my: 1, width: '100%' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Input Location" variant="outlined" />
    </Box>
  );
}