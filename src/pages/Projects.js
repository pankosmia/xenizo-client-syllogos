import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ExchangeData from './Repositories';
import Navigation from '../components/Navigation';
import {bcvContext,postEmptyJson} from "pithekos-lib";

const ProjectPage = () => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTitle, setExpandedTitle] = useState(null);
    const [expandedBook, setExpandedBook] = useState(null);
    const [activeProjectCount, setActiveProjectCount] = useState(0);
    const [activeDiscussionId, setActiveDiscussionId] = useState(null); 
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 
    const [userData, setUserData] = useState({ username: '' });

    const navigate = useNavigate();
    const {bcvRef} =useContext(bcvContext);

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
                console.error('Erreur lors de la récupération des contributions:', error);
                setError('Erreur lors de la récupération des contributions.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []); // Appelé une seule fois après le rendu initial
    

    const fetchContributions = async () => {
        try {
            const response = await axios.get('http://192.168.1.35:4000/api/contributions');
            setContributions(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des contributions:', error);
            setError('Erreur lors de la récupération des contributions.');
        }
    };

    const handleCloture = async (_id) => {
        try {
            const response = await axios.post('http://192.168.1.35:4000/api/contributions/cloture', { _id });
            if (response.data.success) {
                setContributions(contributions.filter(contribution => contribution._id !== _id));
                setActiveProjectCount(prevCount => prevCount - 1);
            } else {
                console.error('Erreur lors de la clôture de la contribution:', response.data.error);
            }
        } catch (error) {
            console.error('Erreur lors de la requête de clôture:', error);
        }
    };

    const handleViewDiscussion = async (_id) => {
        try {
            const response = await axios.get(`http://192.168.1.35:4000/api/contributions/${_id}/messages`);
            setMessages(response.data); 
            setActiveDiscussionId(_id); 
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && activeDiscussionId && userData) {
            try {
                const response = await axios.post(`http://192.168.1.35:4000/api/contributions/${activeDiscussionId}/messages`, {
                    author: userData,
                    content: newMessage,
                });
    
                setMessages(prevMessages => [...prevMessages, response.data]); 
                setNewMessage(''); 
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        } else {
            console.error('Veuillez entrer un message valide');
        }
    };

    const groupedContributions = contributions.reduce((acc, contribution) => {
        const title = contribution.nameProject;
        if (!acc[title]) acc[title] = [];
        acc[title].push(contribution);
        return acc;
    }, {});

    Object.keys(groupedContributions).forEach(title => {
        groupedContributions[title].sort((a, b) => a.nameProject.localeCompare(b.nameProject));
    });

    const toggleProjectExpansion = (title) => {
        setExpandedTitle(expandedTitle === title ? null : title);
    };

    return (
        <div>
            <Navigation/>
            <p onClick={()=> postEmptyJson("/navigation/bcv/MRK/3/5")}>Do Bcv {JSON.stringify(bcvRef.current)}</p>
            <ExchangeData />

            {loading ? (
                <p>Chargement des données...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div>
                    <h1>Liste des Contributions</h1>

                    {activeDiscussionId ? (
                        <div>
                            <button onClick={() => setActiveDiscussionId(null)}>
                                Retour
                            </button>
                            <h3>Discussion</h3>
                            <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                                {messages.length > 0 ? (
                                    messages.map((message, index) => (
                                        <div key={index}>
                                            <strong>{message.author} :</strong> {message.content}
                                        </div>
                                    ))
                                ) : (
                                    <p>Aucun message pour cette discussion.</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Écrire un message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button onClick={handleSendMessage}>
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    ) : (
                        Object.keys(groupedContributions).length > 0 ? (
                            Object.keys(groupedContributions).map(title => {
                                const projectCount = groupedContributions[title].length;

                                return (
                                    <div key={title}>
                                        <div
                                            onClick={() => toggleProjectExpansion(title)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div>
                                                <strong>Projet : {title} <span>({projectCount} projets)</span></strong>
                                            </div>
                                            <div >
                                                <button>
                                                    {expandedTitle === title ? '▲' : '▼'}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedTitle === title && (

                                            <div>
                                                    {groupedContributions[title].map(contribution => (
                                                        <div key={contribution._id}>
                                                            <div><strong>Nom du Livre :</strong> {contribution.bookName}</div>
                                                            <div><strong>Chapitre :</strong> {contribution.chapter}</div>
                                                            <div><strong>Verset :</strong> {contribution.verse}</div>
                                                            <div><strong>Date de création :</strong> {new Date(contribution.createdAt).toLocaleString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}</div>
                                                            <div>
                                                                <button
                                                                    onClick={() => handleViewDiscussion(contribution._id)}
                                                                >
                                                                    Afficher
                                                                </button>
                                                                {contribution.statut !== 'cloture' && (
                                                                    <button
                                                                        onClick={() => handleCloture(contribution._id)}>
                                                                        Clôturer
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    ))}
                                
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>Aucune contribution trouvée pour ce titre de projet.</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectPage;




