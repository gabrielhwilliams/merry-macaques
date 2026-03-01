import '../index.css'
import '../modulesCSS/Chat.css'
import './RecipeGemini'
import { Box, TextField } from '@mui/material';
import { generateRecipes } from './RecipeGemini';

import AddIngredients from './RecipeList';

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
          <TextField id="userPrompt" label="Ask Gemini" variant="outlined" />
        </Box>
      </div>
      <div className='ChatEnter'>
        <button className='ChatButton' onClick={() => AddIngredients(generateRecipes((document.getElementById("userPrompt") as HTMLInputElement).value))}>Ask</button>
      </div>
    </div>
  );
}