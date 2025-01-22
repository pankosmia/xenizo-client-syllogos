import React, { useState } from "react";
import { Button, Typography, Box,TextField } from '@mui/material';

const Discussion = ({ nameProject }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { content: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Discussion du projet : {} 
      </Typography>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 2,
        }}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Box key={index}>
              <strong>{nameProject}:</strong> {message.content}
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
    </div>
  );
};

export default Discussion;
