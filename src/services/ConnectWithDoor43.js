import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import Profile from '../components/Profile';
import { exchangeCodeForAccessToken, fetchUserProfile, fetchOrganizationsWithTeamsAndRepos, logout } from '../services/auth';
import { useAuth } from '../services/AuthContext';

function Door43LoginButton() {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
 
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');
    const storedState = Cookies.get('oauth_state');

    const loginWithDoor43 = () => {
        window.location.href = '/auth';
    };
    const{isAuthenticated, setIsAuthenticated}=useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            window.location.href = '/'; // Rediriger vers la page d'accueil
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

                    const { organizationsWithDetails, teamsData } = await fetchOrganizationsWithTeamsAndRepos(token, login);
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
                   <button onClick={handleLogout} className="door43-button">Se déconnecter</button>
                </div>
            ) : (
                <button onClick={loginWithDoor43} className="door43-button">
                    Se connecter avec Door43
                </button>
            )}
            {loading && <p>chargement</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default Door43LoginButton;
