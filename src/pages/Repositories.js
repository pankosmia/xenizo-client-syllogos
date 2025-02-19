import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { bcvContext} from "pithekos-lib";
import {
  TextField,
  Button,
  Box,
  Typography,
  CardContent,
  Grid2,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArchivePage from "./Archives";
import Navigation from "../components/Navigation";
import moment from "moment";


const ExchangeData = () => {
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [author, setAuthor] = useState("");
  const [activeTab, setActiveTab] = useState("opened");
  const [description, setDescription] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [contributions, setContributions] = useState([]);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  const config = require("../config.json");
  moment.locale("en");

  const groupedContributions = contributions?.length
    ? contributions.reduce((acc, contribution) => {
        if (!acc[contribution.nameProject]) acc[contribution.nameProject] = [];
        acc[contribution.nameProject].push(contribution);
        return acc;
      }, {})
    : {};

  //console.log("groupe de contribution:", groupedContributions);

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
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const nameProjectFilter = nameProject;
  const author = "Loise";
  const url = config.auth_server
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContributions();
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
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await axios.get(
        `${url}/api/contributions`
      );
      setContributions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des contributions:", error);
      setError("Erreur lors de la récupération des contributions.");
    }
  };

  useEffect(() => {
    const filtered = contributions.filter(
      (conv) => conv.nameProject === nameProject
    );
    setFilteredContributions(filtered);
  }, [contributions, nameProject]);

  const handleCloture = async (_id) => {
    try {
      const response = await axios.post(
        `${url}/api/contributions/cloture`,
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
  useEffect(() => {
    let interval;
    if (activeDiscussionId) {
      fetchMessages(activeDiscussionId);

      interval = setInterval(() => {
        fetchMessages(activeDiscussionId);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeDiscussionId, nameProjectFilter]);

  useEffect(() => {
    let internal;
    if (newMessage) {
      internal = setInterval(() => {
        fetchContributions(newMessage);
      }, 3000);
    }
  }, [newMessage]);

  const fetchMessages = async (id) => {
    try {
      const response = await axios.get(
        `${url}/api/contributions/${id}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const handleViewDiscussion = async (id, contributions) => {
    const selectedContribution = contributions.find(
      (contribution) => contribution._id === id
    );

    if (selectedContribution) {
      setActiveDiscussionId(id);
      setDescription(selectedContribution.description);
      setShowDescription(false);
      await fetchMessages(id);
    }
  };

  Object.keys(groupedContributions).forEach((nameProject) => {
    groupedContributions[nameProject].sort((a, b) =>
      a.nameProject.localeCompare(b.nameProject)
    );
  });

  const handleCreateConversation = async (e) => {
    e.preventDefault();

    const newConversation = {
      nameProject,
      bookName,
      chapter,
      verse,
      description: description,
      author: author,
      content: newMessage,
      createdAt: new Date(),
    };
    try {
      const response = await axios.post(
        `${url}/api/contributions`,
        newConversation
      );
      console.log("Nouvelle contribution créée :", response.data);
      setNewMessage("");
      setDescription("");
    } catch (error) {
      console.error("Erreur lors de la création de la contribution :", error);
    }
  };

  return (
    <Box>
      <Navigation />
      <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
        <Box
          sx={{
            border: "1px solid #ddd",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography className="sizeletters">
            {nameProject}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Typography
              component="a"
              href="syllogos#/contribution"
              className={`tab ${activeTab === "opened" ? "active" : ""} custom-button-page-project`}
              onClick={() => setActiveTab("opened")}
            >
              <MessageIcon sx={{ marginRight: "8px" }} /> OPEN
            </Typography>

            <Typography
              component="a"
              className={`tab ${activeTab === "archived" ? "active" : ""} custom-button-page-project`}
              onClick={() => setActiveTab("archived")}
            >
              <ArchiveIcon sx={{ marginRight: "8px" }} /> RESOLVED
            </Typography>
          </Box>

          {activeTab === "archived" ? (
            <ArchivePage />
          ) : (
            <CardContent>
              {activeDiscussionId ? (
                <Box>
                  <Box sx={{ maxHeight: 300, overflowY: "auto", padding: 2 }}>
                    {messages.length > 0 ? (
                      messages.map((message, index) => {
                        const formattedDate = moment(
                          message.createdAt
                        ).isValid()
                          ? moment(message.createdAt).format(
                              "DD MMM YYYY • hh:mm A"
                            )
                          : "Date invalide";

                        return (
                          <Box key={index} sx={{ marginBottom: 1 }}>
                            <strong>
                              {message.author} • {formattedDate}
                            </strong>
                            <br />
                            <Typography
                              sx={{ paddingTop: 2, paddingBottom: 2 }}
                            >
                              {message.content}
                            </Typography>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Aucun message pour cette discussion.
                      </Typography>
                    )}
                  </Box>
                  <Button
                    onClick={() => {
                      setActiveDiscussionId(null);
                      setShowDescription(true);
                    }}
                    variant="outlined"
                    className="button-return"
                  >
                    Retour
                  </Button>
                </Box>
              ) : (
                Object.keys(groupedContributions)
                  .filter((nameProject) => nameProject === nameProjectFilter)
                  .map((nameProject) => (
                    <Box key={nameProject} sx={{ marginBottom: 2, minHeight:100 }}>
                      {groupedContributions[nameProject].map((contribution) => (
                        <Box
                          key={contribution._id}
                         className="text-box-project"
                        
                        >
                          <Typography variant="subtitle1">
                            {contribution.nameProject} - {contribution.description}
                          </Typography>

                          <Box className="text-box">
                            <Button
                              onClick={() =>
                                handleViewDiscussion(
                                  contribution._id,
                                  groupedContributions[nameProjectFilter]
                                )
                              }
                              className="button-afficher"
                            >
                              Afficher
                            </Button>
                            {contribution.statut !== "cloture" && (
                              <Button
                                onClick={() => handleCloture(contribution._id)}
                                className="button-close"
                              >
                                Clôturer
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))
              )}
            </CardContent>
          )}

          <Grid2
            component="form"
            onSubmit={handleCreateConversation}
           className="text-box-flex-direction"
          >
            {showDescription && (
              <Grid2 className="text-box" item xs={4}>
                <TextField
                  name="description"
                  placeholder="Quick description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  className="text-block-message"
                  required
                />
              </Grid2>
            )}

            <Grid2 className="text-box" item xs={8}>
              <TextField
                name="newMessage"
                placeholder={`Send a message about ${nameProject}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
                className="text-block-message"
              />
              <Button
                type="submit"
                variant="text"
                className="button-submit-message"
              >
                <SendIcon className="iconbutton" />
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
};
export default ExchangeData;
