import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Navigation from '../components/Navigation';

const ProfileUser = () => {
    const [userData, setUserData] = useState({
        userId: '',
        username: '',
        avatar_url: '',
        organizations: [], 
    });
    const [expandedOrg, setExpandedOrg] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
    const sessionToken = Cookies.get('session'); 
    console.log('Session token:', sessionToken);

    if (!sessionToken) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
    }

    const fetchUserData = async () => {
        try {
            const userResponse = await axios.get('/api/user', { params: { session_token: sessionToken} });

            const orgResponse = await axios.get('/api/organizations', {
                params: { session_token: sessionToken },
            });
            console.log("Données des organisations reçues :", orgResponse.data);

            // Mettre à jour les données utilisateur
            setUserData({
                ...userResponse.data, 
                organizations: orgResponse.data || [], 
            });

            setLoading(false); 
        } catch (error) {
            if (error.response) {
                console.error("Erreur de réponse API :", error.response.data);
            } else if (error.request) {
                console.error("Aucune réponse reçue :", error.request);
            } else {
                console.error("Erreur lors de la configuration de la requête :", error.message);
            }
            setError("Impossible de récupérer les données utilisateur ou organisations.");
            setLoading(false);
        }
    };

    fetchUserData();
}, []);

    const handleOrgClick = (orgId) => {
        setExpandedOrg(expandedOrg === orgId ? null : orgId);
    };

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        
        <div>
            <Navigation/>
            <div>
                <h2>Bienvenue, {userData.username || 'Utilisateur'} !</h2> 
                {userData.avatar_url && (
                    <img
                        src={userData.avatar_url}
                        alt={`${userData.username}'s avatar`}
                        style={{ width: '80px', borderRadius: '50%' }}
                    />
                )}
            </div>

            <p>ID Utilisateur : {userData.userId}</p> 

            <div>
                <h3>Organisations</h3>
                <ul>
                    {userData.organizations?.length > 0 ? (
                        userData.organizations.map((org) => (
                            <div key={org.orgId}>
                                <li
                                
                                    onClick={() => handleOrgClick(org.orgId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {org.username} 
                                </li>
                                {expandedOrg === org.orgId && (
                                    <div>
                                        <li>
                                            Équipes
                                        </li>
                                        {org.teams && org.teams.length > 0 ? (
                                            org.teams.map((team) => (
                                                <li key={team.teamId}>
                                                    {team.name}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Aucune équipe trouvée.</li>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <li>Aucune organisation trouvée.</li>
                    )}
                </ul>
            </div>

            <Link to="/client">Retour</Link>
        </div>
    );
};

export default ProfileUser;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const ProfileUser = () => {
//     const [userData, setUserData] = useState({
//         userId: '',
//         username: '',
//         avatar_url: '',
//         organizations: [],
//     });
//     const [expandedOrg, setExpandedOrg] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const sessionToken = Cookies.get('session'); // Récupérer le cookie de session
//         console.log('Session token:', sessionToken);

//         if (!sessionToken) {
//             setError("Utilisateur non connecté.");
//             setLoading(false);
//             return;
//         }

//         const fetchUserData = async () => {
//             try {
//                 // Envoyer le cookie de session au serveur pour récupérer les données utilisateur
//                 const userResponse = await axios.post('/api/user', { session_token: sessionToken }, { withCredentials: true });
//                 console.log("Données utilisateur reçues :", userResponse.data);

//                 // Récupérer les données des organisations
//                 const orgResponse = await axios.get('/api/organizations', {
//                     params: { session_token: sessionToken },
//                     withCredentials: true,
//                 });
//                 console.log("Données des organisations reçues :", orgResponse.data);

//                 // Mettre à jour les données utilisateur
//                 setUserData({
//                     ...userResponse.data,
//                     organizations: orgResponse.data || [],
//                 });

//                 setLoading(false);
//             } catch (error) {
//                 if (error.response) {
//                     console.error("Erreur de réponse API :", error.response.data);
//                 } else if (error.request) {
//                     console.error("Aucune réponse reçue :", error.request);
//                 } else {
//                     console.error("Erreur lors de la configuration de la requête :", error.message);
//                 }
//                 setError("Impossible de récupérer les données utilisateur ou organisations.");
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const handleOrgClick = (orgId) => {
//         setExpandedOrg(expandedOrg === orgId ? null : orgId);
//     };

//     if (loading) {
//         return <div className="text-center mt-5">Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="text-center text-danger mt-5">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <div className="d-flex align-items-center justify-content-between mb-4">
//                 <h2>Bienvenue, {userData.username || 'Utilisateur'} !</h2>
//                 {userData.avatar_url && (
//                     <img
//                         src={userData.avatar_url}
//                         alt={`${userData.username}'s avatar`}
//                         style={{ width: '80px', borderRadius: '50%' }}
//                     />
//                 )}
//             </div>

//             <p>ID Utilisateur : {userData.userId}</p>

//             <div className="profile-section mb-4">
//                 <h3>Organisations</h3>
//                 <ul className="list-group">
//                     {userData.organizations?.length > 0 ? (
//                         userData.organizations.map((org) => (
//                             <div key={org.orgId} className="mb-3">
//                                 <li
//                                     className="list-group-item d-flex justify-content-between align-items-center"
//                                     onClick={() => handleOrgClick(org.orgId)}
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     {org.username}
//                                 </li>
//                                 {expandedOrg === org.orgId && (
//                                     <div className="list-group">
//                                         <li className="list-group-item bg-secondary text-white text-center mt-1">
//                                             Équipes
//                                         </li>
//                                         {org.teams && org.teams.length > 0 ? (
//                                             org.teams.map((team) => (
//                                                 <li key={team.teamId} className="list-group-item">
//                                                     {team.name}
//                                                 </li>
//                                             ))
//                                         ) : (
//                                             <li className="list-group-item">Aucune équipe trouvée.</li>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     ) : (
//                         <li className="list-group-item">Aucune organisation trouvée.</li>
//                     )}
//                 </ul>
//             </div>

//             <Link to="/client" className="btn btn-secondary">Retour</Link>
//         </div>
//     );
// };

// export default ProfileUser;
