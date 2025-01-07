// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navigation from '../components/Navigation';
// import Profile from '../components/ConnectWithDoor43';

// const OrganizationPage = () => {
//     const [user, setUser] = useState(null);
//     const [avatarUrl, setAvatarUrl] = useState('');
//     const [organizations, setOrganizations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         const storedUser = localStorage.getItem('name');
//         const storedAvatarUrl = localStorage.getItem('avatar_url');
//         const storedUserId = localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur connecté

//         if (storedUser) {
//             setUser(storedUser);
//             setAvatarUrl(storedAvatarUrl);
//         }

//         const fetchOrganizations = async () => {
//             try {
//                 const response = await axios.get('http://localhost:4000/api/organizations');
                
//                 // Filtrer les organisations où l'utilisateur fait partie des membres
//                 const userOrganizations = response.data.filter(org =>
//                     org.members.some(member => member.userId === storedUserId)
//                 );

//                 setOrganizations(userOrganizations);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des organisations:', error);
//                 setError('Erreur lors de la récupération des organisations.');
//                 setLoading(false);
//             }
//         };

//         if (storedUser) {
//             fetchOrganizations();
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const normalizeString = (str) => {
//         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
//     };

//     const filteredOrganizations = organizations.filter(org =>
//         normalizeString(org.username).includes(normalizeString(searchTerm))
//     );

//     return (
//         <div>
//             <Profile />
//             <Navigation />
//             {loading ? (
//                 <p>Chargement des données...</p>
//             ) : error ? (
//                 <p>{error}</p>
//             ) : user ? (
//                 <div className="container">
//                     <h1 className="my-4">Liste des Organisations</h1>
//                     <div className="mb-3">
//                         <input
//                             type="text"
//                             placeholder="Rechercher par nom d'organisation..."
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             className="form-control"
//                         />
//                     </div>
//                     <div className="row bg-secondary text-center text-white py-2">
//                         <div className="col-3">Nom de l'Organisation</div>
//                         <div className="col-3">Date de Création</div>
//                         <div className="col-3">Équipes</div>
//                         <div className="col-3">Membres</div>
//                     </div>
//                     {filteredOrganizations.length > 0 ? (
//                         filteredOrganizations.map(org => (
//                             <div className="row border-bottom text-center py-3" key={org._id}>
//                                 <div className="col-3">{org.username}</div>
//                                 <div className="col-3">
//                                     {new Date(org.createdAt).toLocaleString('fr-FR', {
//                                         day: 'numeric',
//                                         month: 'numeric',
//                                         year: 'numeric',
//                                         hour: '2-digit',
//                                         minute: '2-digit',
//                                     })}
//                                 </div>
//                                 <div className="col-3">
//                                     {org.teams && org.teams.length > 0 ? (
//                                         org.teams.map(team => (
//                                             <div key={team.teamId}>
//                                                 <strong>{team.name}</strong>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p>Aucune équipe</p>
//                                     )}
//                                 </div>
//                                 <div className="col-3">
//                                     {org.members && org.members.length > 0 ? (
//                                         org.members.map(member => (
//                                             <div key={member.userId}>{member.username}</div>
//                                         ))
//                                     ) : (
//                                         <p>Aucun membre</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-center">Aucune organisation trouvée.</p>
//                     )}
//                 </div>
//             ) : (
//                 <h6>Veuillez vous connecter pour voir les organisations.</h6>
//             )}
//         </div>
//     );
// };

// export default OrganizationPage;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navigation from '../components/Navigation';
// import Profile from '../components/ConnectWithDoor43';

// const OrganizationPage = () => {
//     const [user, setUser] = useState(null);
//     const [avatarUrl, setAvatarUrl] = useState('');
//     const [organizations, setOrganizations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         const storedUser = localStorage.getItem('name');
//         const storedAvatarUrl = localStorage.getItem('avatar_url');
//         const storedUserId = localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur connecté

//         if (storedUser) {
//             setUser(storedUser);
//             setAvatarUrl(storedAvatarUrl);
//         }

//         const fetchOrganizations = async () => {
//             try {
//                 const response = await axios.get('http://localhost:4000/api/organizations');
                
//                 // Filtrer les organisations où l'utilisateur fait partie des membres
//                 const userOrganizations = response.data.filter(org =>
//                     org.members.some(member => member.userId === storedUserId)
//                 );

//                 setOrganizations(userOrganizations);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des organisations:', error);
//                 setError('Erreur lors de la récupération des organisations.');
//                 setLoading(false);
//             }
//         };

//         if (storedUser) {
//             fetchOrganizations();
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const normalizeString = (str) => {
//         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
//     };

//     const filteredOrganizations = organizations.filter(org =>
//         normalizeString(org.username).includes(normalizeString(searchTerm))
//     );

//     return (
//         <div>
//             <Profile />
//             <Navigation />
//             {loading ? (
//                 <p>Chargement des données...</p>
//             ) : error ? (
//                 <p>{error}</p>
//             ) : user ? (
//                 <div className="container">
//                     <h1 className="my-4">Liste des Organisations</h1>
//                     <div className="mb-3">
//                         <input
//                             type="text"
//                             placeholder="Rechercher par nom d'organisation..."
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             className="form-control"
//                         />
//                     </div>
//                     <div className="row bg-secondary text-center text-white py-2 organization">
//                         <div className="col-3 d-sm-block">Nom de l'Organisation</div>
//                         <div className="col-3 d-sm-block">Date de Création</div>
//                         <div className="col-3 d-sm-block">Équipes</div>
//                         <div className="col-3 d-sm-block">Membres</div>
//                     </div>
//                     {filteredOrganizations.length > 0 ? (
//                         filteredOrganizations.map(org => (
//                             <div className="row border-bottom text-center py-3" key={org._id}>
//                                 <div className="col-3 col-sm-3">{org.username}</div>
//                                 <div className="col-3 col-sm-3">
//                                     {new Date(org.createdAt).toLocaleString('fr-FR', {
//                                         day: 'numeric',
//                                         month: 'numeric',
//                                         year: 'numeric',
//                                         hour: '2-digit',
//                                         minute: '2-digit',
//                                     })}
//                                 </div>
//                                 <div className="col-3 col-sm-3">
//                                     {org.teams && org.teams.length > 0 ? (
//                                         org.teams.map(team => (
//                                             <div key={team.teamId}>
//                                                 <strong>{team.name}</strong>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p>Aucune équipe</p>
//                                     )}
//                                 </div>
//                                 <div className="col-3 col-sm-3">
//                                     {org.members && org.members.length > 0 ? (
//                                         org.members.map(member => (
//                                             <div key={member.userId}>{member.username}</div>
//                                         ))
//                                     ) : (
//                                         <p>Aucun membre</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-center">Aucune organisation trouvée.</p>
//                     )}
//                 </div>
//             ) : (
//                 <h6>Veuillez vous connecter pour voir les organisations.</h6>
//             )}
//         </div>
//     );
// };

// export default OrganizationPage;
