import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import { bcvContext, currentProjectContext } from "pithekos-lib";
import { TextField, Button, Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";

const NewContributionPage = () => {
  const [activeTab, setActiveTab] = useState("opened");
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const config = require("../config.json");
  moment.locale("en");

  const { bcvRef } = useContext(bcvContext);
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const author = "Loise";
  const url = config.auth_server;
  const { currentProjectRef } = useContext(currentProjectContext);

  const handleFabClick = () => {
    setShowForm((prev) => !prev);
  };
 
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
      nameOrganisation:currentProjectRef.current.organization ,
      nameRepository:currentProjectRef.current.project
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
      <p>
        Project :
        {!currentProjectRef.current
          ? "None"
          : `organisation ${currentProjectRef.current.organization}, Project ${currentProjectRef.current.project}`}
      </p>
      <Fab
        color="secondary"
        size="small"
        aria-label="add"
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>

      {showForm && (
        <Box
          component="form"
          onSubmit={handleCreateConversation}
          className="text-box-flex-direction"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {activeTab === "opened" && (
            <>
              <Box>
                <Typography>Choix des collaborateurs</Typography>
                <Checkbox />
                <Checkbox />
                <Checkbox />
              </Box>
              <Box sx={{ width: "50%" }} className="text-box">
                <TextField
                  name="description"
                  placeholder="Quick description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  className="text-block-message"
                  required
                />
              </Box>

              <Box sx={{ width: "50%" }} className="text-box">
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
                  sx={{ float: "right" }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
export default NewContributionPage;
