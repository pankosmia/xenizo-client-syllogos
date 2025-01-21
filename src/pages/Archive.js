import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import Navigation from '../components/Navigation';
//import '../styles/App.css';
import { Box, Typography, Button, Collapse } from '@mui/material';

const ArchivePage = () => {
    const [archivedContributions, setArchivedContributions] = useState([]);
    const [groupedArchives, setGroupedArchives] = useState({});
    const [expandedArchive, setExpandedArchive] = useState(null); // Gérer l'expansion des titres
    const [expandedProject, setExpandedProject] = useState(null); // Gérer l'expansion des projets
    const [expandedChapterId, setExpandedChapterId] = useState(null); // Gérer l'expansion des chapitres avec ID unique
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook de navigation
    useEffect(() => {
        // const sessionToken = Cookies.get('session'); // Vérification du cookie de session

        // if (!sessionToken) {
        //     setLoading(false);
        //     navigate('/client'); // Redirection vers la page de connexion
        //     return;
        // }

        const fetchArchivedContributions = async () => {
            try {
                const response = await axios.get('http://192.168.1.35:4000/api/contributions/archived');
                const grouped = groupArchivesByTitleAndProject(response.data); // Regrouper par selectedTitle et nameProject
                setGroupedArchives(grouped);
                setArchivedContributions(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des contributions archivées :', err);
                setError('Impossible de charger les contributions archivées.');
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedContributions();
    }, [navigate]); // Le hook navigate est passé en dépendance

    const groupArchivesByTitleAndProject = (archives) => {
        return archives.reduce((acc, archive) => {
            const title = archive.nameProject || "Titre non spécifié";
            const projectName = archive.bookName || "Nom du projet non spécifié";
            
            if (!acc[title]) acc[title] = {};
            if (!acc[title][projectName]) acc[title][projectName] = [];

            acc[title][projectName].push(archive);
            return acc;
        }, {});
    };

   
    const toggleArchiveExpansion = (title) => {
        setExpandedArchive((prevTitle) => (prevTitle === title ? null : title));
    };

    const toggleProjectExpansion = (title, projectName) => {
        setExpandedProject((prevProject) => 
            prevProject === `${title}-${projectName}` ? null : `${title}-${projectName}`
        );
    };

    const toggleChapterExpansion = (chapterId) => {
      
        setExpandedChapterId((prevId) => (prevId === chapterId ? null : chapterId));
    };

    return (
        <Box sx={{ padding: 4 }}>
        {error && <Typography color="error">{error}</Typography>}
        <Navigation/>
        {Object.keys(groupedArchives).length > 0 ? (
            Object.keys(groupedArchives).map((title) => {
                const nameProject = Object.keys(groupedArchives[title]);
                const archiveCount = nameProject.length;
                console.log(groupedArchives);

            return (
              <Box key={title} sx={{ marginBottom: 3 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => toggleArchiveExpansion(title)}
                >
                  <Typography variant="h6">
                    Projet : {title} 
                  </Typography>
                  <Button>{expandedArchive === title ? '▲' : '▼'}</Button>
                </Box>
  
                <Collapse in={expandedArchive === title}>
                  <Box sx={{ marginLeft: 2 }}>
                    {Object.keys(groupedArchives[title]).map((projectName) => (
                      <Box key={projectName} sx={{ marginBottom: 2 }}>
                        <Box
                          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => toggleProjectExpansion(title, projectName)}
                        >
                          <Typography variant="body1">{projectName} <span>({archiveCount} projets)</span> </Typography>
                          <Button>{expandedProject === `${title}-${projectName}` ? '▲' : '▼'}</Button>
                        </Box>
  
                        <Collapse in={expandedProject === `${title}-${projectName}`}>
                          <Box sx={{ marginLeft: 2 }}>
                            {groupedArchives[title][projectName].map((archive) => (
                              <Box key={archive._id} sx={{ marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">
                                    Chapitre {archive.chapter} , Verset {archive.verse}
                                  </Typography>
                                  <Button
                                    onClick={() => toggleChapterExpansion(archive._id)}
                                    variant="outlined"
                                    size="small"
                                  >
                                    {expandedChapterId === archive._id ? '▲' : '▼'} Voir
                                  </Button>
                                </Box>
  
                                <Collapse in={expandedChapterId === archive._id}>
                                  <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="subtitle2">Messages :</Typography>
                                    {archive.messages.length > 0 ? (
                                      <Box
                                        sx={{
                                          maxHeight: '200px',
                                          overflowY: 'auto',
                                          border: '1px solid #ccc',
                                          padding: 2,
                                          marginTop: 1,
                                        }}
                                      >
                                        {archive.messages.map((message, index) => (
                                          <Box key={index} sx={{ marginBottom: 1 }}>
                                            <Typography variant="body2">
                                              <strong>{message.author} :</strong> {message.content}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                              {new Date(message.createdAt).toLocaleString('fr-FR')}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Box>
                                    ) : (
                                      <Typography variant="body2" color="textSecondary">
                                        Aucun message pour ce chapitre.
                                      </Typography>
                                    )}
                                  </Box>
                                </Collapse>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })
        ) : (
          <Typography variant="body1" align="center" color="textSecondary">
            Aucune archive trouvée.
          </Typography>
        )}
      </Box>
    );
  };
  
export default ArchivePage;
