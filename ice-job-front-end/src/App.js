import React, { useState } from "react";
import "../src/styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "../src/components/header";
import Home from "../src/screen/home";
import Login from "./screen/login";
import Register from "./screen/register";
import Fav from "./screen/fav";
import MonCompte from "./screen/MonCompte";
import Footer from "./components/Footer";
import Admin from "./screen/Admin";
import Postule from "./screen/postule";
import { AuthProvider } from "./components/authContext";
import { JobProvider } from "./components/jobContext";

function App() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker le texte de recherche

  // Fonction pour mettre à jour le texte de recherche
  const handleSearch = (term) => {
    setSearchTerm(term); // Cette fonction met à jour searchTerm
    console.log("Search term in App: ", term);
  };

  return (
    <JobProvider>
      <AuthProvider>
        {location.pathname !== "/login" &&
          location.pathname !== "/register" &&
          location.pathname !== "/postule" && (
            <Header onSearch={handleSearch} />
          )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Fav" element={<Fav />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/postule" element={<Postule />} />
          <Route path="/MonCompte" element={<MonCompte />} />
          <Route path="/" element={<Home />} />
        </Routes>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" &&
          location.pathname !== "/postule" && <Footer />}
      </AuthProvider>
    </JobProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
