import React from "react";
import "./App.css";

import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, Typography } from "@mui/material";
import "@fontsource/poppins";
import theme from "./theme";


function App() {


  return (
    <Box sx={{ maxWidth: "100%" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Typography color="text.secondary">Hello...</Typography>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;
