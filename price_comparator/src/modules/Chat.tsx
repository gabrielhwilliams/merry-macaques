import '../index.css'
import '../modulesCSS/Chat.css'
import { Box, TextField } from '@mui/material';

export default function Chat() {

  return (
    <div className='ChatContainer'>
      <div className='ChatMessage'>
        <Box
          component="form"
          sx={{ '& > :not(style)': { my: 1, width: 1} }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Ask Gemini" variant="outlined" />
        </Box>
      </div>
      <div className='ChatEnter'>
        <button className='ChatButton'>Ask</button>
      </div>
    </div>
  );
}