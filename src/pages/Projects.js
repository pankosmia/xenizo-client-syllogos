import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { bcvContext} from "pithekos-lib";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import moment from "moment";

const ProjectPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTitle, setExpandedTitle] = useState(null);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const { bcvRef } = useContext(bcvContext);
  moment.locale("en"); // Définir la langue

  // useEffect(() => {
  //     const fetchData = async () => {
  //         const sessionToken = Cookies.get('session');

  //         if (!sessionToken) {
  //             setLoading(false);
  //             navigate('/client');
  //             return;
  //         }

  //         try {
  //             const userResponse = await axios.get('/api/user', { params: { session_token: sessionToken } });

  //             if (userResponse.data && userResponse.data.username) {
  //                 setUserData(userResponse.data.username);
  //                 await fetchContributions();
  //             } else {
  //                 setError("Impossible de récupérer le nom d'utilisateur.");
  //             }
  //         } catch (error) {
  //             console.error("Erreur lors de la récupération des données utilisateur:", error);
  //             setError("Erreur lors de la récupération des données utilisateur.");
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContributions(); // Appel direct de la fonction fetchContributions
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des contributions:",
          error
        );
        setError("Erreur lors de la récupération des contributions.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Appelé une seule fois après le rendu initial

  const fetchContributions = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.34:4000/api/contributions"
      );
      setContributions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des contributions:", error);
      setError("Erreur lors de la récupération des contributions.");
    }
  };

  const handleCloture = async (_id) => {
    try {
      const response = await axios.post(
        "http://192.168.1.34:4000/api/contributions/cloture",
        { _id }
      );
      if (response.data.success) {
        setContributions(
          contributions.filter((contribution) => contribution._id !== _id)
        );
        setActiveProjectCount((prevCount) => prevCount - 1);
      } else {
        console.error(
          "Erreur lors de la clôture de la contribution:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Erreur lors de la requête de clôture:", error);
    }
  };

  const handleViewDiscussion = async (id) => {
    try {
      const response = await axios.get(
        `http://192.168.1.34:4000/api/contributions/${id}/messages`
      );
      setMessages(response.data);
      setActiveDiscussionId(id);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const groupedContributions = contributions?.length
    ? contributions.reduce((acc, contribution) => {
        const title = contribution.nameProject;
        if (!acc[title]) acc[title] = [];
        acc[title].push(contribution);
        return acc;
      }, {})
    : {};
      console.log(groupedContributions);

  Object.keys(groupedContributions).forEach((title) => {
    groupedContributions[title].sort((a, b) =>
      a.nameProject.localeCompare(b.nameProject)
    );
  });

  const formattedDate = moment(messages.createdAt).format(
    "MMMM DD, YYYY [at] hh:mm A"
  );

  return (
    <Box
      sx={{
        height: "90vh",
        overflowY: "auto",
        padding: 4,
        bgcolor: "background.default",
      }}
    >
      {activeDiscussionId ? (
        <Box>
          <Button
            onClick={() => setActiveDiscussionId(null)}
            variant="outlined"
            color="primary"
          >
            Retour
          </Button>
          <Typography variant="h5" align="center" gutterBottom>
            Discussion
          </Typography>

          <Box
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: 2,
            }}
          >
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Box key={index}>
                  <strong> Loise - {message.formattedDate} </strong> <br />
                  {message.content}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Aucun message pour cette discussion.
              </Typography>
            )}
          </Box>
        </Box>
      ) : Object.keys(groupedContributions).length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {Object.keys(groupedContributions).map((title) => {
            const projectCount = groupedContributions[title].length;

            return (
              <Box key={title} sx={{ width: "100%", sm: "48%", md: "30%" }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {projectCount} projet(s)
                    </Typography>
                  </CardContent>
                  {expandedTitle === title && (
                    <Box
                      sx={{
                        padding: 2,
                        height: "80vh",
                        overflowY: "auto",
                        marginBottom: 2,
                      }}
                    >
                      {groupedContributions[title].map((contribution) => (
                        <Box key={contribution._id}>
                          <Divider sx={{ marginY: 2 }} />
                          <CardActions>
                            <Button
                              onClick={() =>
                                handleViewDiscussion(contribution._id)
                              }
                              size="small"
                              color="primary"
                            >
                              Afficher
                            </Button>
                            {contribution.statut !== "cloture" && (
                              <Button
                                onClick={() => handleCloture(contribution._id)}
                                size="small"
                                color="secondary"
                              >
                                Clôturer
                              </Button>
                            )}
                          </CardActions>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body1" align="center" color="textSecondary">
          Aucune contribution trouvée pour ce titre de projet.
        </Typography>
      )}
    </Box>
  );
};

export default ProjectPage;
