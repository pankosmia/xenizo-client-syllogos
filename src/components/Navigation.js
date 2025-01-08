import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import '../index.css';

function Navigation() {

  const location = useLocation()

  return (
    <AppBar position="static" className="custom-appbar">
      <Toolbar>
        <Box>
          <Button color="inherit" component={Link} to="/"  sx={{
          color: location.pathname === '/' ? 'black' : 'white', }}>
          Page d'accueil
          </Button>
          <Button color="inherit" component={Link} to="/projects" sx={{
          color: location.pathname === '/projects' ? 'black' : 'white', }} >
           Projets
          </Button>
          <Button color="inherit" component={Link} to="/archives" sx={{
          color: location.pathname === '/archives' ? 'black' : 'white', }}>
          Archives
          </Button>
          <Button color="inherit" component={Link} to="/profile" sx={{
          color: location.pathname === '/profile' ? 'black' : 'white', }}>
           Profil
          </Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
