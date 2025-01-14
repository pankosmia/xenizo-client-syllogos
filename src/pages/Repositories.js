// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const ExchangeData = () => {
//     const [organizations, setOrganizations] = useState([]);
//     const [filteredTeams, setFilteredTeams] = useState([]);
//     const [filteredRepositories, setFilteredRepositories] = useState([]);
//     const [selectedOrganization, setSelectedOrganization] = useState('');
//     const [selectedTeams, setSelectedTeams] = useState('');
//     const [selectedTitle, setSelectedTitle] = useState('');
//     const [nameProject, setNameProject] = useState('');
//     const [description, setDescription] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState(null);
//     const [projectNameError, setProjectNameError] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [username, setUsername] = useState("");

//     useEffect(() => {
//         const fetchOrganizations = async () => {
//             const sessionToken = Cookies.get("session");
//             console.log("Session token récupéré:", sessionToken);
//             if (!sessionToken) {
//                 setError("Veuillez vous connecter ");
//                 setLoading(false);
//                 return;
//             }

//             try {

//                 const userResponse = await axios.get('/api/user', { params: { session_token: sessionToken } });

//                 if (userResponse.data && userResponse.data.username) {
//                     setUsername(userResponse.data.username);
//                     console.log("Nom d'utilisateur récupéré:", userResponse.data.username);
//                 } else {
//                     setError("Impossible de récupérer le nom d'utilisateur.");
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await axios.get('/api/organizations', {
//                     params: { session_token: sessionToken },
//                 });
//                 console.log("Données des organisations récupérées:", response.data);

//                 setOrganizations(response.data);

//             } catch (err) {
//                 console.error("Erreur lors de la récupération des organisations:", err);
//                 setError("Impossible de récupérer les organisations.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrganizations();
//     }, []);

//     const filterTeamsByOrganization = (orgUsername) => {
//         console.log("Organisation sélectionnée pour les équipes:", orgUsername);
//         const selectedOrg = organizations.find(org => org.username === orgUsername);
//         setFilteredTeams(selectedOrg ? selectedOrg.teams || [] : []);
//         console.log("Équipes filtrées:", selectedOrg ? selectedOrg.teams || [] : []);
//         setSelectedTeams('');
//     };

//     const filterRepositoriesByOrganization = (orgUsername) => {
//         console.log("Organisation sélectionnée pour les dépôts:", orgUsername);
//         const selectedOrg = organizations.find(org => org.username === orgUsername);
//         setFilteredRepositories(selectedOrg ? selectedOrg.repositories || [] : []);
//         console.log("Dépôts filtrés:", selectedOrg ? selectedOrg.repositories || [] : []);
//         setSelectedTitle('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError(null);
//         setProjectNameError('');

//         console.log("Nom du projet soumis:", nameProject);

//         const projectExists = await checkProjectExists();
//         if (projectExists) {
//             setProjectNameError("Ce nom de projet n'est pas disponible");
//             console.log("Le projet existe déjà.");
//             return;
//         }

//         const contributionData = {
//             nameProject,
//             description,
//             selectedTeams,
//             selectedOrganization,
//             selectedTitle,
//             createdBy: username,
//         };

//         console.log("Données de la contribution soumises:", contributionData);

//         try {
//             const response = await axios.post('/api/contributions', contributionData);
//             console.log("Réponse du serveur après soumission:", response.data);
//             setMessage(response.data.message || 'Contribution créée avec succès !');
//             resetForm();
//         } catch (error) {
//             console.error('Erreur lors de la création de la contribution:', error);
//             setError('Erreur lors de la création de la contribution.');
//         }
//     };

//     const checkProjectExists = async () => {
//         try {
//             const response = await axios.get('/api/contributions/check', {
//                 params: {
//                     nameProject,
//                     selectedOrganization
//                 }
//             });

//             console.log("Résultat de la vérification du projet:", response.data.exists);
//             return response.data.exists;
//         } catch (error) {
//             console.error('Erreur lors de la vérification du nom du projet:', error);
//             return false;
//         }
//     };

//     const resetForm = () => {
//         console.log("Réinitialisation du formulaire.");
//         setSelectedTitle('');
//         setDescription('');
//         setSelectedOrganization('');
//         setError(null);
//         setNameProject('');
//         setSelectedTeams('');
//         setProjectNameError('');
//     };

//     return (
//         <div className="container-fluid px-3">
//             {loading ? (
//                 <p>Chargement des données...</p>
//             ) : error ? (
//                 <p>{error}</p>
//             ) : (
//                 <div>
//                     {/* Bouton pour afficher/masquer le formulaire */}
//                     <div className="d-flex justify-content-end align-items-center py-2">
//                         <button
//                             className="btn btn-pink"
//                             onClick={() => setShowForm(!showForm)} // Toggle pour afficher/masquer
//                             style={{ minWidth: '200px' }}
//                         >
//                             {showForm ? 'Masquer le formulaire' : 'Créer une nouvelle contribution'}
//                         </button>
//                     </div>

//                     {/* Formulaire affiché si showForm est true */}
//                     {showForm && (
//                         <div className="mt-3">
//                             <h1 className="my-3 text-center">Créer la contribution</h1>
//                             <form onSubmit={handleSubmit}>
//                                 <div className="form-group mt-3">
//                                     <label>Organisation</label>
//                                     <select
//                                         value={selectedOrganization}
//                                         onChange={(e) => {
//                                             const orgUsername = e.target.value;
//                                             console.log("Organisation sélectionnée:", orgUsername);
//                                             setSelectedOrganization(orgUsername);
//                                             filterTeamsByOrganization(orgUsername);
//                                             filterRepositoriesByOrganization(orgUsername);
//                                         }}
//                                         className="form-control"
//                                         required
//                                     >
//                                         <option value="">Sélectionnez une organisation</option>
//                                         {organizations.map((org) => (
//                                             <option key={org._id} value={org.username}>
//                                                 {org.username}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="form-group mt-3">
//                                     <label>Équipe</label>
//                                     <select
//                                         value={selectedTeams}
//                                         onChange={(e) => {
//                                             console.log("Équipe sélectionnée:", e.target.value);
//                                             setSelectedTeams(e.target.value);
//                                         }}
//                                         className="form-control"
//                                         required
//                                     >
//                                         <option value="">Sélectionnez une équipe</option>
//                                         {filteredTeams.map((team) => (
//                                             <option key={team.teamId} value={team.name}>
//                                                 {team.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="form-group mt-3">
//                                     <label>Projet</label>
//                                     <select
//                                         value={selectedTitle}
//                                         onChange={(e) => {
//                                             console.log("Projet sélectionné:", e.target.value);
//                                             setSelectedTitle(e.target.value);
//                                         }}
//                                         className="form-control"
//                                         required
//                                     >
//                                         <option value="">Sélectionnez un projet</option>
//                                         {filteredRepositories.map((repo) => (
//                                             <option key={repo.id} value={repo.title}>
//                                                 {repo.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="form-group mt-3">
//                                     <label>Nom du projet</label>
//                                     <textarea
//                                         placeholder="Nom du projet en BCV"
//                                         value={nameProject}
//                                         onChange={(e) => {
//                                             console.log("Nom du projet modifié:", e.target.value);
//                                             setNameProject(e.target.value);
//                                         }}
//                                         className="form-control"
//                                         required
//                                         style={{ maxHeight: '60px', minHeight: '40px' }}
//                                     />
//                                     {projectNameError && (
//                                         <p className="text-danger mt-2">{projectNameError}</p>
//                                     )}
//                                 </div>

//                                 <div className="form-group mt-3">
//                                     <label>Description (facultative)</label>
//                                     <textarea
//                                         value={description}
//                                         onChange={(e) => {
//                                             console.log("Description modifiée:", e.target.value);
//                                             setDescription(e.target.value);
//                                         }}
//                                         className="form-control"
//                                         style={{ maxHeight: '400px', minHeight: '80px' }}
//                                     />
//                                 </div>

//                                 <div className="form-group mt-4">
//                                     <button type="submit" className="btn btn-secondary w-100">
//                                         Créer Contribution
//                                     </button>
//                                 </div>
//                             </form>
//                             {message && <p className="text-success text-center mt-3">{message}</p>}
//                         </div>
//                     )}</div>
//                 )}</div>
//     );
// };

// export default ExchangeData;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { bcvContext, postEmptyJson } from "pithekos-lib";
import { TextField, Button, Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ExchangeData = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedTeams, setSelectedTeams] = useState("");
  //const [bookName, setBookName] = useState(""); // Nom du livre (entrée manuelle)
  //const [chapter, setChapter] = useState(""); // Chapitre
  //const [verse, setVerse] = useState(""); // Verset
  //const [nameProject, setNameProject] = useState(""); // Nom du projet (sélectionné)
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [projectNameError, setProjectNameError] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  // useEffect(() => {
  //     const fetchOrganizations = async () => {
  //         const sessionToken = Cookies.get("session");
  //         if (!sessionToken) {
  //             setError("Veuillez vous connecter");
  //             setLoading(false);
  //             return;
  //         }

  //         try {
  //             const userResponse = await axios.get('/api/user', { params: { session_token: sessionToken } });
  //             if (userResponse.data && userResponse.data.username) {
  //                 setUsername(userResponse.data.username);
  //             } else {
  //                 setError("Impossible de récupérer le nom d'utilisateur.");
  //                 setLoading(false);
  //                 return;
  //             }

  //             const response = await axios.get('/api/organizations', {
  //                 params: { session_token: sessionToken },
  //             });

  //             setOrganizations(response.data);

  //         } catch (err) {
  //             setError("Impossible de récupérer les organisations.");
  //             setLoading(false);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchOrganizations();
  // }, []);
  const { bcvRef } = useContext(bcvContext);

  const bookName =(bcvRef.current.bookCode);
  const chapter =(bcvRef.current.chapter);
  const verse = (bcvRef.current.verse);
  const nameProject = `${bookName}  ${chapter} : ${verse}`;



  const filterTeamsByOrganization = (orgUsername) => {
    const selectedOrg = organizations.find(
      (org) => org.username === orgUsername
    );
    setFilteredTeams(selectedOrg ? selectedOrg.teams || [] : []);
    setSelectedTeams("");
  };

  const filterRepositoriesByOrganization = (orgUsername) => {
    const selectedOrg = organizations.find(
      (org) => org.username === orgUsername
    );
    setFilteredRepositories(selectedOrg ? selectedOrg.repositories || [] : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setProjectNameError("");

    const contributionData = {
      nameProject, // Projet sélectionné
      bookName, // Nom du livre (manuel)
      chapter, // Chapitre
      verse, // Verset
      description,
      selectedTeams,
      selectedOrganization,
      createdBy: username,
    };

    try {
      const response = await axios.post("/api/contributions", contributionData);
      setMessage(response.data.message || "Contribution créée avec succès !");
      resetForm();
    } catch (error) {
      setError("Erreur lors de la création de la contribution.");
    }
  };

  const resetForm = () => {
    setDescription("");
    //setBookName("");
    //setChapter("");
    //setVerse("");
    setSelectedOrganization("");
    setError(null);
    //setNameProject("");
    setSelectedTeams("");
    setProjectNameError("");
  };

  // Fonction pour basculer l'affichage du formulaire
  const toggleForm = () => {
    setFormVisible((prevState) => !prevState);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 3 }}>
      {/* Bouton pour ouvrir ou masquer le formulaire */}
      <Button
        variant="contained"
        onClick={toggleForm}
        fullWidth
        sx={{ marginBottom: 2 }}
        className="custom-createproject"
      >
        {formVisible ? "Masquer le formulaire" : "Créer une contribution"}
      </Button>

      {/* Si formVisible est vrai, afficher le formulaire */}
      {formVisible && (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            {nameProject}
          </Typography>

          {/* Description */}
          <Box
            sx={{
              display: "flex", // Flexbox pour aligner en ligne
              alignItems: "end", // Centrer verticalement
              gap: 1, // Espacement entre les éléments
            }}
          >
            <TextField
              label="Message"
              name="message"
              placeholder={`send a message about ${nameProject}`}
              multiline
              rows={4}
              fullWidth
            />

            {/* Bouton de soumission */}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
            ></Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ExchangeData;
