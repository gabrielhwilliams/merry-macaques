import '../index.css'
import '../modulesCSS/Chat.css'
import './RecipeGemini'
import { Box, TextField } from '@mui/material';

import { generateRecipes } from './RecipeGemini';
import { useState } from "react";

import AddIngredients from './RecipeList';

export default function Chat() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
      setLoading(true);
      try {
          const result = await generateRecipes((document.getElementById("userPrompt") as HTMLInputElement).value);
          setResponse(JSON.stringify(result, null, 2));
      } catch (error) {
          console.error("Error generating content:", error);
          setResponse("Failed to generate content.");
      } finally {
          setLoading(false);
      }    
  };

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
        <button className='ChatButton' onClick={() => AddIngredients(handleGenerate())}>Ask</button> // NEEDS TO ADD COLOR THAT IS NOT ALREADY USED
      </div>
    </div>
  );
}