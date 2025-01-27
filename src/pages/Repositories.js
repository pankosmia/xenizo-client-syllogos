import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { bcvContext, postEmptyJson } from "pithekos-lib";
import { TextField, Button, Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArchivePage from "./Archive";
import { ContributionsProvider } from "../ContributionContext";

const ExchangeData = () => {
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [projectNameError, setProjectNameError] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("opened");
  const [newMessage, setNewMessage] = useState("");

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

  const handleCreateConversation = async (e) => {
    e.preventDefault();
  
    const newConversation = {
      nameProject, // Nom du projet
      bookName,
      chapter,
      verse,
      author: "Default Author", // Remplace par l'utilisateur connecté
      content: newMessage, // Message initial saisi par l'utilisateur
      createdAt: new Date(),
    };
  
    try {
      const response = await axios.post(`http://192.168.1.34:4000/api/contributions`, newConversation);
      console.log("Nouvelle contribution créée :", response.data);
      setNewMessage(""); // Réinitialise le message
      setFormVisible(false); // Masque le formulaire après soumission
    } catch (error) {
      console.error("Erreur lors de la création de la contribution :", error);
    }
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
        <Box component="form" onSubmit={handleCreateConversation}>
          <Typography variant="h5" gutterBottom>
            {nameProject}
          </Typography>
          <Box
            sx={{
              display: "flex", // Active Flexbox
              justifyContent: "space-between", // Écarte les éléments (gauche et droite)
              alignItems: "flex-start", // Aligne verticalement les éléments
              padding: "10px", // Ajoute un peu de marge intérieure
              border: "none", // (Optionnel) Bordure pour visualiser la disposition
            }}
          >
            <Typography
              component="a"
              href="syllogos#/projects"
              className="custom-button-page-project"
              onClick={() => setActiveTab("opened")}
              sx={{
                color:
                  activeTab === "opened" ? "primary.main" : "text.secondary",
                borderBottom: activeTab === "opened" ? "3px solid" : "none",
              }}
            >
              <MessageIcon sx={{ marginRight: "8px" }} />
              {/* Ajoute un espace entre l'icône et le texte */}
              OPEN
            </Typography>

            <Typography
              component="a"
              className="custom-button-page-project"
              href="syllogos#/archives"
              onClick={() => setActiveTab("archived")}
              sx={{
                color:
                  activeTab === "archived" ? "primary.main" : "text.secondary",
                borderBottom: activeTab === "archived" ? "3px solid" : "none",
              }}
            >
              <ArchiveIcon sx={{ marginRight: "8px" }} />
              RESOLVED
            </Typography>
          </Box>

          {/* Description */}
          <Box
            sx={{
              display: "flex", // Flexbox pour aligner en ligne
              alignItems: "end", // Centrer verticalement
              gap: 1, // Espacement entre les éléments
            }}
          >
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
                "& .MuiOutlinedInput-root": {
                  border: "none", // Supprime le contour
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Supprime le contour principal
                },
              }}
            />

            {/* Bouton de soumission */}
            <Button
              type="submit"
              variant="text"
              className="button-submit-message"
              onClick={handleCreateConversation}
            >
              <SendIcon className="iconbutton" />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ExchangeData;
