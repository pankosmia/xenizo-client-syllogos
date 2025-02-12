// import React, { createContext, useState, useEffect } from 'react';
// import { useContext } from "react";

// import Cookies from 'js-cookie';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         const sessionCookie = Cookies.get('session');
//         setIsAuthenticated(sessionCookie);

//         const interval = setInterval(() => {
//             const sessionToken = Cookies.get('session');
//             if (!sessionToken) {
//                 console.log('Session expirée.');
//                 setIsAuthenticated(false);
//             }
//         }, 5000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <AuthContext value={{ isAuthenticated, setIsAuthenticated }}>
//             {children}
//         </AuthContext>
//     );
// };
