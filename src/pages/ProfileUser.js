import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

//     
//     const fetchUserData = async () => {
//         try {
//        
//             const orgResponse = await axios.get('/api/organizations', {
//                 params: { session_token: sessionToken },
//             });
//             console.log("Données des organisations reçues :", orgResponse.data);

//             // Mettre à jour les données utilisateur
//             setUserData({
//                 ...userResponse.data, 
//                 organizations: orgResponse.data || [], 
//             });

//             setLoading(false); 
//         } catch (error) {
//             if (error.response) {
//                 console.error("Erreur de réponse API :", error.response.data);
//             } else if (error.request) {
//                 console.error("Aucune réponse reçue :", error.request);
//             } else {
//                 console.error("Erreur lors de la configuration de la requête :", error.message);
//             }
//             setError("Impossible de récupérer les données utilisateur ou organisations.");
//             setLoading(false);
//         }
//     };

//     fetchUserData();
// }, []);

    // const handleOrgClick = (orgId) => {
    //     setExpandedOrg(expandedOrg === orgId ? null : orgId);
    // };

    // if (loading) {
    //     return <div>Chargement des données...</div>;
    // }

    // if (error) {
    //     return <div>{error}</div>;
    // }

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
                                {/* <li
                                
                                    onClick={() => handleOrgClick(org.orgId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {org.username} 
                                </li> */}
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

            <Link to="/">Retour</Link>
        </div>
    );
};

export default ProfileUser;
