import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

// Création du contexte
const AuthContext = createContext();

// Hook pour accéder facilement au contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur de contexte pour l'application
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifie la présence du cookie de session au démarrage
        const sessionCookie = Cookies.get('session');
        setIsAuthenticated(sessionCookie);

        // Définir un intervalle pour surveiller la session
        const interval = setInterval(() => {
            const sessionToken = Cookies.get('session');
            if (!sessionToken) {
                console.log('Session expirée.');
                setIsAuthenticated(false);
            }
        }, 5000);

        // Nettoyage à la fin
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
