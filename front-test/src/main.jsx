import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import axios from "axios";
import "@/index.css";
import { ThemeProvider } from "./context/darkModeContext.jsx";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);
