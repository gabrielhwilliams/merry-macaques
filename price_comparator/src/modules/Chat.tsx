import '../index.css'
import '../modulesCSS/Chat.css'
import './RecipeGemini'
import { Box, TextField, Stack, Typography, Avatar } from '@mui/material';

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
          sx={{ my: 1, width: '100%' }}
          noValidate
          autoComplete="off"
        >
          <TextField id="userPrompt" label="Ask Gemini for Recipe Suggestions" variant="outlined" 
          sx={{ width: '100%' }} />
        </Box>
      </div>
      <div className='ChatEnter'>
        <button className='ChatButton' onClick={() => AddIngredients(handleGenerate())}>
          <Stack direction="row" sx={{ my: 0, width: 1, alignItems:"center", justifyContent:"center" }}>
            <Typography variant="h4" fontWeight={500}>
              Ask
            </Typography>
            <span style={{ width: 20 }} /> {/* Spacer */}
            <img
              src="../../public/gemini-logo-white.png"
              alt="Gemini"
              loading="lazy"
              height= "72px"
              width= "128px"
            />
          </Stack>
        </button> {/* NEEDS TO ADD COLOR THAT IS NOT ALREADY USED */}
      </div>
    </div>
  );
}