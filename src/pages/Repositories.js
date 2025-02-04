import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { bcvContext, postEmptyJson } from "pithekos-lib";
import { TextField, Button, Box, Typography, CardContent } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArchivePage from "./Archive";
import { ContributionsProvider } from "../ContributionContext";
import ProjectPage from "./Projects";
import Navigation from "../components/Navigation";
import moment from "moment";

const ExchangeData = () => {
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [messages, setMessages] = useState("");
  const [error, setError] = useState(null);
  const [projectNameError, setProjectNameError] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("opened");
  const [newMessage, setNewMessage] = useState("");
  const [contributions, setContributions] = useState([]);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
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
  const chapter = bcvRef.current.chapter;
  const verse = bcvRef.current.verse;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const nameProjectFilter = nameProject;

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
        "http://192.168.1.35:4000/api/contributions"
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
  useEffect(() => {
    let interval;
    if (activeDiscussionId) {
      interval = setInterval(() => {
        fetchMessages(activeDiscussionId);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeDiscussionId]);

  useEffect(()=>{
    let internal;
    if(newMessage){
      internal = setInterval(()=>{
        fetchContributions(newMessage);
      },3000);
    }
  },[newMessage]);

  const fetchMessages = async (id) => {
    try {
      const response = await axios.get(
        `http://192.168.1.35:4000/api/contributions/${id}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const handleViewDiscussion = async (id) => {
    setActiveDiscussionId(id);
    await fetchMessages(id);
  };

  Object.keys(groupedContributions).forEach((nameProject) => {
    groupedContributions[nameProject].sort((a, b) =>
      a.nameProject.localeCompare(b.nameProject)
    );

    //const nomprojet = nameProject; // On stocke le nom du projet
    // if (nomprojet === nameProjectFilter) {
    //   console.log(
    //     `Affichage des contributions pour ${nomprojet}:`,
    //     groupedContributions[nomprojet]
    //   );

    //   groupedContributions[nomprojet].forEach((contribution) => {
    //     console.log(
    //       `- Contribution ID: ${contribution._id}, Statut: ${contribution.statut}`
    //     );
    //   });
    // }

  });

  const handleCreateConversation = async (e) => {
    e.preventDefault();

    const newConversation = {
      nameProject,
      bookName,
      chapter,
      verse,
      author: "Default Author",
      content: newMessage,
      createdAt: new Date(),
    };
    try {
      const response = await axios.post(
        `http://192.168.1.35:4000/api/contributions`,
        newConversation
      );
      console.log("Nouvelle contribution créée :", response.data);
      setNewMessage("");
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
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h5" gutterBottom>
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
              className="custom-button-page-project"
              onClick={() => setActiveTab("opened")}
              sx={{
                color: activeTab === "opened" ? "primary.main" : "text.secondary",
                borderBottom: activeTab === "opened" ? "3px solid" : "none",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <MessageIcon sx={{ marginRight: "8px" }} /> OPEN
            </Typography>
  
            <Typography
              component="a"
              className="custom-button-page-project"
              onClick={() => setActiveTab("archived")}
              sx={{
                color: activeTab === "archived" ? "primary.main" : "text.secondary",
                borderBottom: activeTab === "archived" ? "3px solid" : "none",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
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
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflowY: "auto",
                      padding: 2,
                    }}
                  >
                    {messages.length > 0 ? (
                      messages.map((message, index) => {
                        const formattedDate = moment(message.createdAt).isValid()
                          ? moment(message.createdAt).format(
                              "MMMM DD, YYYY [at] hh:mm A"
                            )
                          : "Date invalide";
  
                        return (
                          <Box key={index} sx={{ marginBottom: 1 }}>
                            <strong>Loise - {formattedDate}</strong>
                            <br />
                            {message.content}
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
                    onClick={() => setActiveDiscussionId(null)}
                    variant="outlined"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    Retour
                  </Button>
                </Box>
              ) : (
                Object.keys(groupedContributions)
                  .filter((nameProject) => nameProject === nameProjectFilter)
                  .map((nameProject) => (
                    <Box key={nameProject} sx={{ marginBottom: 2 }}>
                      <Typography variant="h6">{nameProject}</Typography>
                      {groupedContributions[nameProject].map((contribution) => (
                        <Box
                          key={contribution._id}
                          sx={{ display: "flex", gap: 1, marginBottom: 1 }}
                        >
                          <Button
                            onClick={() => handleViewDiscussion(contribution._id)}
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
                        </Box>
                      ))}
                    </Box>
                    
                  ))
              )}
            </CardContent>
          )}
  
          <Box component="form" onSubmit={handleCreateConversation} sx={{ marginTop: 2 }}>
            <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
              <TextField
                name="newMessage"
                placeholder={`Send a message about ${nameProject}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                className="text-block-message"
                sx={{
                  "& .MuiOutlinedInput-root": { border: "none" },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
              <Button type="submit" variant="text" className="button-submit-message">
                <SendIcon className="iconbutton" />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  
};

export default ExchangeData;
