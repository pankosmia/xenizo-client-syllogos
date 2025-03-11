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
  const [expandedDescription,setExpandedDescription] = useState(null);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  moment.locale("en");
  const navigate = useNavigate();
  const config = require("../config.json");

  useEffect(() => {
    const url = config.auth_server;

    const fetchArchivedContributions = async () => {
      try {
        const response = await axios.get(`${url}/contributions/archived`);
        const grouped = groupArchivesByTitleAndProject(response.data);
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
  }, [navigate]);

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
    console.log(title);
  };

  const toggleDescriptionExpansive = (description,contributionId)=>{
    setExpandedDescription((prevDescription)=>(prevDescription === description ? null : description));
    setExpandedDiscussion((prevId) => (prevId === contributionId ? null : contributionId));

  console.log("Description:", description);
  console.log("Discussion ID:", contributionId);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto",padding:"16px"}}>
      {error && <Typography color="error">{error}</Typography>}
      {Object.keys(groupedArchives).length > 0 ? (
        Object.keys(groupedArchives).map((projectTitle) => {
          return (
            <Box key={projectTitle}>
              <Box 
                className="text-box-project-archive"
                onClick={() => toggleArchiveExpansion(projectTitle)}
              >
                <Typography variant="subtitle1">{projectTitle}</Typography>
                <Button size="small">
                  {expandedArchive === projectTitle ? "▲" : "▼"}
                </Button>
              </Box>

              <Collapse in={expandedArchive === projectTitle}>
                {Object.keys(groupedArchives[projectTitle]).map((subProject) =>
                  groupedArchives[projectTitle][subProject].map((archive) => {
                    return (
                      <Box
                        key={archive._id}
                        sx={{
                          marginBottom: 2,
                          paddingLeft: 2,
                          backgroundColor: "#f5f5f5",
                          padding: "16px",
                          bordeRadius: "8px",
                          marginBottom: "16px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {projectTitle} -{" "}
                          {archive.description ||
                            "Pas de description disponible"}
                        </Typography>
                        {/* <Button>{expandedDescription === description ? "o" : "c"} </Button> */}
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
                    );
                  })
                )}
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
