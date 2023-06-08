import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#52A6F8",
      light: "#8bd6ff",
      dark: "#0077c4",
    },
    secondary: {
      main: "#2A4064",
      light: "#576b92",
      dark: "#001a39",
    },
    background: {
      default: "#1C2030",
      paper: "#576b92",
    },
    text: {
      primary: "#000",
      secondary: "#fff",
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    fontSize: 14,
  },
});

export default theme;
