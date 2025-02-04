import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import '../styles/App.css';
import { Box, Typography, Button, Collapse } from "@mui/material";
import moment from "moment";

const ArchivePage = () => {
  const [archivedContributions, setArchivedContributions] = useState([]);
  const [groupedArchives, setGroupedArchives] = useState({});
  const [expandedArchive, setExpandedArchive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  moment.locale("en");
  const navigate = useNavigate();

  useEffect(() => {
    // const sessionToken = Cookies.get('session'); // Vérification du cookie de session

    // if (!sessionToken) {
    //     setLoading(false);
    //     navigate('/client'); // Redirection vers la page de connexion
    //     return;
    // }

    const fetchArchivedContributions = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.35:4000/api/contributions/archived"
        );
        const grouped = groupArchivesByTitleAndProject(response.data); // Regrouper par selectedTitle et nameProject
        setGroupedArchives(grouped);
        setArchivedContributions(response.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des contributions archivées :",
          err
        );
        setError("Impossible de charger les contributions archivées.");
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

  return (
    <Box sx={{ padding: 4 }}>
      {error && <Typography color="error">{error}</Typography>}
      {Object.keys(groupedArchives).length > 0 ? (
        Object.keys(groupedArchives).map((projectTitle) => (
          <Box key={projectTitle} sx={{ marginBottom: 3 }}>
            {/* En-tête cliquable pour toggler l'affichage du projet */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => toggleArchiveExpansion(projectTitle)}
            >
              <Typography variant="h6">Projet : {projectTitle}</Typography>
              <Button size="small">
                {expandedArchive === projectTitle ? "▲" : "▼"}
              </Button>
            </Box>

            {/* Contenu collapsible contenant les discussions pour le projet */}
            <Collapse in={expandedArchive === projectTitle}>
              {Object.keys(groupedArchives[projectTitle]).map((subProject) =>
                groupedArchives[projectTitle][subProject].map((archive) => (
                  <Box
                    key={archive._id}
                    sx={{ marginBottom: 2, paddingLeft: 2 }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Messages :
                    </Typography>
                    {archive.messages && archive.messages.length > 0 ? (
                      archive.messages.map((message, index) => {
                        const formattedDate = moment(
                          message.createdAt
                        ).isValid()
                          ? moment(message.createdAt).format(
                              "MMMM DD, YYYY [at] hh:mm A"
                            )
                          : "Date invalide";
                        return (
                          <Box key={index} sx={{ marginBottom: 1 }}>
                            <Typography variant="body2">
                              <strong>
                                {message.author} - {formattedDate}
                              </strong>
                            </Typography>
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Aucun message pour ce chapitre.
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </Collapse>
          </Box>
        ))
      ) : (
        <Typography variant="body1" align="center" color="textSecondary">
          Aucune archive trouvée.
        </Typography>
      )}
    </Box>
  );
};

export default ArchivePage;
