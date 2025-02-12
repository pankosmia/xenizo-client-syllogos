// Le bon code sans modif
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import Profile from "../components/Profile";
import {
  exchangeCodeForAccessToken,
  fetchUserProfile,
  fetchOrganizationsWithTeamsAndRepos,
  logout,
} from "../services/auth";
//import { useAuth } from "../services/AuthContext";
import {Button} from "@mui/material";
import logo from "../assets/img/logo.svg";

function Door43LoginButton() {
  const config = require("../config.json");
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");
  const returnedState = urlParams.get("state");
  const storedState = Cookies.get("oauth_state");
  const url = config.REDIRECT_URI;

  const loginWithDoor43 = () => {
    window.location.href = `${url}/auth`;
  };
  // const{isAuthenticated, setIsAuthenticated}=useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      //setIsAuthenticated(false);
      window.location.href = `${url}`;
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (storedState && storedState === returnedState && code) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = await exchangeCodeForAccessToken(code);
          const userProfile = await fetchUserProfile(token);
          const { login, avatar_url } = userProfile;
          setUser(login);
          setAvatarUrl(avatar_url);

          const { organizationsWithDetails, teamsData } =
            await fetchOrganizationsWithTeamsAndRepos(token, login);
          setOrganizations(organizationsWithDetails);
          setTeams(teamsData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [code, returnedState, storedState]);

  return (
    <div>
      {user ? (
        <div>
          <Profile username={user} avatarUrl={avatarUrl} />
          <Button onClick={handleLogout}>Se déconnecter</Button>
        </div>
      ) : (
        <Button
          onClick={loginWithDoor43}
          className="button-door43"
          variant="contained"
        >
          <img
            width="30"
            height="30"
            src={logo}
            alt="logo"
            aria-hidden="true"
            style={{ marginRight: "8px" }}
          />
          Log in
        </Button>
      )}
      {loading && <p>chargement</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Door43LoginButton;

