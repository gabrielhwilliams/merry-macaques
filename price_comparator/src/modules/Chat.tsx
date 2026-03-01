import '../index.css'
import '../modulesCSS/Chat.css'
import './RecipeGemini'
import { Box, TextField, Stack, Typography } from '@mui/material';

import { generateRecipes } from './RecipeGemini';
import { useState } from "react";

type ThemeMode = 'light' | 'dark'

type ChatProps = {
  themeMode?: ThemeMode
}

export default function Chat({ themeMode = 'light' }: ChatProps) {
  const [_response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const geminiStarSrc = themeMode === 'dark' ? '/gemini-star.png' : '/gemini-star.png';

  const promptFieldSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      color: 'var(--color-text)',
      backgroundColor: 'var(--color-surface)',
      '& fieldset': {
        borderColor: 'var(--color-border)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-primary)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-primary)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--color-text-muted)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--color-primary)',
    },
  };

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
          sx={promptFieldSx} />
        </Box>
      </div>
      <div className='ChatEnter'>
        <button className='ChatButton' onClick={() => handleGenerate() } disabled={loading}>
          <Stack direction="row" sx={{ my: 0, width: 1, alignItems:"center", justifyContent:"center" }}>
            <Typography variant="h4" fontWeight={500}>
              Ask
            </Typography>
            <span style={{ width: 16 }} />
            <img src={geminiStarSrc} alt="Gemini star" loading="lazy" height="20" width="20" />
            <span style={{ width: 10 }} />
            <Typography variant="h4" fontWeight={500}>
              Gemini
            </Typography>
          </Stack>
        </button> {/* NEEDS TO ADD COLOR THAT IS NOT ALREADY USED */}
      </div>
    </div>
  );
}
