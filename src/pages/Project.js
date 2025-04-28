import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { bcvContext,currentProjectContext } from "pithekos-lib";
import {
  TextField,
  Button,
  Box,
  Typography,
  CardContent,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";

const PageProjectName = () => {
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [contributions, setContributions] = useState([]);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const[currentOrganisationName,setCurrentOrganisationName]=useState("");
  const config = require("../config.json");
  moment.locale("en");

  const { bcvRef } = useContext(bcvContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const nameRepository = currentProjectName;
  const nameProjectFilter = nameRepository;
  const author = "Loise";
  const url = config.auth_server;
  const urlLocal = config.rust_server;

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
      const response = await axios.get(`${url}/contributions`);
      setContributions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des contributions:", error);
      setError("Erreur lors de la récupération des contributions.");
    }
  };
  //Recuperation du project choisit
  const fetchRepos = async () => {
    try {
      const response = await axios.get(
        `${urlLocal}/app-state/current-project/`
      );
      setCurrentProjectName(response.data.project);
      setCurrentOrganisationName(response.data.organization);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };
  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    const filtered = contributions.filter(
      (conv) => conv.nameProject === nameProject
    );
    setFilteredContributions(filtered);
  }, [contributions, nameProject]);

  // clôturer une contribution
  const handleCloture = async (_id) => {
    try {
      const response = await axios.post(`${url}/contributions/cloture`, {
        _id,
      });
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
    if (!activeDiscussionId) return;

    fetchMessages(activeDiscussionId);
    const interval = setInterval(() => {
      fetchMessages(activeDiscussionId);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDiscussionId, nameProjectFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchContributions();
      fetchRepos();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async (id) => {
    try {
      const response = await axios.get(`${url}/contributions/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  // Regarder une discussions
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

  // Envoyer des messages
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeDiscussionId) return;

    const sendMessage = {
      author: author,
      content: newMessage,
    };

    try {
      const response = await axios.post(
        `${url}/contributions/${activeDiscussionId}/messages`,
        sendMessage
      );
      console.log("Nouveau message ajouté", response.data);

      setNewMessage("");
      fetchMessages(activeDiscussionId);
    } catch (err) {
      console.error("Erreur lors de la création d'un nouveau message", err);
    }
  };

  return (
    <Box>
      <Box sx={{ width: "auto", height: "auto", margin: "auto", padding: 3 }}>
        {contributions
          .filter((contribution) => contribution.nameProject === nameProject && contribution.nameRepository === nameRepository)
          .map((contribution) => (
            <Box key={nameProject}>
                <Box key={contribution._id} className="text-box-project">
                  <Typography variant="subtitle1">
                    {contribution.nameProject} - {contribution.description}
                  </Typography>
                  <CardContent>
                    {activeDiscussionId === contribution._id ? (
                      <Box>
                        <Box
                          sx={{
                            maxHeight: 500,
                            width: "auto",
                            overflowY: "auto",
                            minHeight: 344,
                            border: "none",
                            background: "none",
                          }}
                        >
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
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    my={2}
                                  >
                                    <Box
                                      flex={1}
                                      height="1px"
                                      bgcolor="orange"
                                    />
                                    <Chip
                                      label="New"
                                      size="small"
                                      sx={{
                                        backgroundColor: "orange",
                                        color: "white",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    paddingBottom={1}
                                    color="gray"
                                  >
                                    {message.author} • {formattedDate}
                                  </Typography>
                                  <Typography>{message.content}</Typography>
                                </Box>
                              );
                            })
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Aucun message pour cette discussion.
                            </Typography>
                          )}
                        </Box>
                        <Box
                          component="form"
                          onSubmit={handleSendMessage}
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 1,
                          }}
                          className="text-box"
                        >
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
                            variant="button"
                            sx={{
                              minWidth: "auto",
                              height: 56,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                            }}
                            disabled={!newMessage.trim()}
                          >
                            <SendIcon />
                          </Button>
                        </Box>

                        <Button
                          onClick={() => setActiveDiscussionId(null)}
                          className="button-afficher"
                        >
                          Retour
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 2,
                        }}
                      >
                        <input
                        type="hidden"
                        name="nameOrganisation"
                        value={currentOrganisationName}
                      />
                      <input
                        type="hidden"
                        name="nameRepository"
                        value={nameRepository}
                      />
                        <Button
                          onClick={() => {
                            handleViewDiscussion(contribution._id);
                            setActiveDiscussionId(contribution._id);
                          }}
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
                    )}
                  </CardContent>
                </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};
export default PageProjectName;
