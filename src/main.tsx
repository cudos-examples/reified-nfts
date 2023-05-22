import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <SnackbarProvider maxSnack={2} preventDuplicate={true}>
      <App />
    </SnackbarProvider>
  </Router>
);
