import React, { useState } from 'react';

const Discussion = ({ nameProject, discussionId }) => {
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
            <h3>Discussion du projet : {nameProject}</h3> {/* Affichage du nom du projet */}
            <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div key={index}>
                            <strong>{nameProject}:</strong> {message.content}
                        </div>
                    ))
                ) : (
                    <p>Aucun message pour cette discussion.</p>
                )}
            </div>
            <div className="mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Écrire un message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-success mt-2" onClick={handleSendMessage}>
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Discussion;
