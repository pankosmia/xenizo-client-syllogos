import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ExchangeData from "./Repositories";
import Navigation from "../components/Navigation";
import { bcvContext, postEmptyJson } from "pithekos-lib";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import moment from "moment";

const ProjectPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTitle, setExpandedTitle] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState({ username: "" });

  const navigate = useNavigate();
  const { bcvRef } = useContext(bcvContext);
  moment.locale('en'); // Définir la langue


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
        "http://192.168.1.35:4000/api/contributions"
      );
      setContributions(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contributions:", error);
      setError("Erreur lors de la récupération des contributions.");
    }
  };

  const handleCloture = async (_id) => {
    try {
      const response = await axios.post(
        "http://192.168.1.35:4000/api/contributions/cloture",
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

  const handleViewDiscussion = async (_id) => {
    try {
      const response = await axios.get(
        `http://192.168.1.35:4000/api/contributions/${_id}/messages`
      );
      setMessages(response.data);
      setActiveDiscussionId(_id);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://192.168.1.35:4000/api/contributions/${activeDiscussionId}/messages`,
        {
          content: newMessage,
        }
      );
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };
  const groupedContributions = contributions.reduce((acc, contribution) => {
    const title = contribution.nameProject;
    if (!acc[title]) acc[title] = [];
    acc[title].push(contribution);
    return acc;
  }, {});

  Object.keys(groupedContributions).forEach((title) => {
    groupedContributions[title].sort((a, b) =>
      a.nameProject.localeCompare(b.nameProject)
    );
  });

  const formattedDate = moment(messages.createdAt).format('MMMM DD, YYYY [at] hh:mm A');

  return (
    <Box
      sx={{
        height: "90vh",
        overflowY: "auto",
        padding: 4,
        bgcolor: "background.default",
      }}
    >
      <Navigation />
      <ExchangeData />

      <Typography variant="h4" align="center" gutterBottom>
        Liste des Projets
      </Typography>

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
                  <strong> Loise  - {formattedDate} </strong> <br/>
                  {message.content} 
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Aucun message pour cette discussion.
              </Typography>
            )}
          </Box>

          <TextField
            label="Écrire un message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Envoyer
          </Button>
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
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() =>
                        setExpandedTitle(expandedTitle === title ? null : title)
                      }
                    >
                      {expandedTitle === title ? "▲" : "▼"} Détails
                    </Button>
                  </CardActions>
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
                          <Typography variant="body2">
                            <strong>Nom de l'auteur:</strong>{" "}
                            {contribution.createdBy}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Description:</strong>{" "}
                            {contribution.description}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date de création:</strong>{" "}
                            {new Date(contribution.createdAt).toLocaleString(
                              "fr-FR"
                            )}
                          </Typography>

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
