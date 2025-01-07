import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import '../index.css';

function Navigation() {
  return (
    <AppBar position="static" className="custom-appbar">
      <Toolbar>
        <Box>
          <Button color="inherit" component={Link} to="/" className={({ isActive }) => (isActive ? "active-link" : "link")}>
          Page d'accueil
          </Button>
          <Button color="inherit" component={Link} to="/projects" className={({ isActive }) => (isActive ? "active-link" : "link")}>
           Projets
          </Button>
          <Button color="inherit" component={Link} to="/archives" className={({ isActive }) => (isActive ? "active-link" : "link")}>
          Archives
          </Button>
          <Button color="inherit" component={Link} to="/profile" className={({ isActive }) => (isActive ? "active-link" : "link")}>
           Profil
          </Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
