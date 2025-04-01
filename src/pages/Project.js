import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { bcvContext } from "pithekos-lib";
import { TextField, Button, Box, Typography, Grid2 } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import Navigation from "../components/Navigation";
import moment from "moment";

const PageProjectName = () => {
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
  const [organisations, setOrganisations] = useState();
  const [showFields, setShowFields] = useState(false);

  const config = require("../config.json");
  moment.locale("en");

  const groupedContributions = contributions?.length
    ? contributions.reduce((acc, contribution) => {
        if (!acc[contribution.nameProject]) acc[contribution.nameProject] = [];
        acc[contribution.nameProject].push(contribution);
        return acc;
      }, {})
    : {};

  const { bcvRef } = useContext(bcvContext);
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const nameProjectFilter = nameProject;
  const author = "Loise";
  const url = config.auth_server;

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

  useEffect(() => {
    const filtered = contributions.filter(
      (conv) => conv.nameProject === nameProject
    );
    setFilteredContributions(filtered);
  }, [contributions, nameProject]);

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
      const response = await axios.get(`${url}/contributions/${id}/messages`);
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
        `${url}/contributions`,
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
      <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
        {Object.keys(groupedContributions)
          .filter((projectName) => projectName === nameProjectFilter) // Correction ici
          .map((projectName) => (
            <Box key={projectName} sx={{ marginBottom: 2, minHeight: 100 }}>
              {groupedContributions[projectName].map((contribution) => (
                <Box key={contribution._id} className="text-box-project">
                  <Typography variant="subtitle1">
                    {contribution.nameProject} - {contribution.description}
                  </Typography>

                  <Box className="text-box">
                    {activeTab === "opened" && showDescription && (
                      <>
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

                        <Grid2
                          container
                          component="form"
                          onSubmit={handleCreateConversation}
                          className="text-box-flex-direction"
                          spacing={2}
                          direction="column"
                        >
                          <Box sx={{ width: "100%" }} className="text-box">
                            <TextField
                              name="newMessage"
                              placeholder={`Send a message about ${nameProjectFilter}`}
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
                              sx={{ float: "right" }}
                              disabled={!newMessage.trim()}
                            >
                              <SendIcon className="iconbutton" />
                            </Button>
                          </Box>
                        </Grid2>
                      </>
                    )}

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
          ))}
      </Box>
    </Box>
  );
};
export default PageProjectName;
