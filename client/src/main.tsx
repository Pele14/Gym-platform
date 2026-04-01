import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./features/auth";
import "./global.css";

const THEME_STORAGE_KEY = "ui:theme";
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const initialTheme = storedTheme === "light" ? "light" : "dark";
document.documentElement.setAttribute("data-theme", initialTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);