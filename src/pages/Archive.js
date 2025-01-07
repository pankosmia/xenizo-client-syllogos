import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import Navigation from '../components/Navigation';
//import '../styles/App.css';

const ArchivePage = () => {
    const [archivedContributions, setArchivedContributions] = useState([]);
    const [groupedArchives, setGroupedArchives] = useState({});
    const [expandedArchive, setExpandedArchive] = useState(null); // Gérer l'expansion des titres
    const [expandedProject, setExpandedProject] = useState(null); // Gérer l'expansion des projets
    const [expandedChapterId, setExpandedChapterId] = useState(null); // Gérer l'expansion des chapitres avec ID unique
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Hook de navigation

    useEffect(() => {
        // const sessionToken = Cookies.get('session'); // Vérification du cookie de session

        // if (!sessionToken) {
        //     setLoading(false);
        //     navigate('/client'); // Redirection vers la page de connexion
        //     return;
        // }

        const fetchArchivedContributions = async () => {
            try {
                const response = await axios.get('/api/contributions/archived');
                const grouped = groupArchivesByTitleAndProject(response.data); // Regrouper par selectedTitle et nameProject
                setGroupedArchives(grouped);
                setArchivedContributions(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des contributions archivées :', err);
                setError('Impossible de charger les contributions archivées.');
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedContributions();
    }, [navigate]); // Le hook navigate est passé en dépendance

    const groupArchivesByTitleAndProject = (archives) => {
        return archives.reduce((acc, archive) => {
            const title = archive.nameProject || "Titre non spécifié";
            const projectName = archive.bookName || "Nom du projet non spécifié";
            
            if (!acc[title]) acc[title] = {};
            if (!acc[title][projectName]) acc[title][projectName] = [];

            acc[title][projectName].push(archive);
            return acc;
        }, {});
    };

   
    const toggleArchiveExpansion = (title) => {
        setExpandedArchive((prevTitle) => (prevTitle === title ? null : title));
    };

    const toggleProjectExpansion = (title, projectName) => {
        setExpandedProject((prevProject) => 
            prevProject === `${title}-${projectName}` ? null : `${title}-${projectName}`
        );
    };

    const toggleChapterExpansion = (chapterId) => {
      
        setExpandedChapterId((prevId) => (prevId === chapterId ? null : chapterId));
    };

    return (
        <div className="container-fluid px-3">
            <Navigation />
            {loading ? (
                <p>Chargement des données...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="container mt-4 mb-4">
                    <h1 className="my-3 text-center">Archives des Contributions</h1>

                    {Object.keys(groupedArchives).length > 0 ? (
                        Object.keys(groupedArchives).map((title) => {
                            const archiveCount = Object.keys(groupedArchives[title]).length;

                            return (
                                <div key={title} className="border-bottom mb-4">
                                    <div
                                        className="d-flex justify-content-between align-items-center py-2"
                                        onClick={() => toggleArchiveExpansion(title)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="col-10">
                                            <strong>Projet : {title} <span className="text-muted">({archiveCount} projets)</span></strong>
                                        </div>
                                        <div className="col-2 text-right">
                                            <button className="btn no-outline">
                                                {expandedArchive === title ? '▲' : '▼'}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedArchive === title && (
                                        <div className="p-3 bg-light">
                                            {/* Gestion de l'expansion des projets */}
                                            {Object.keys(groupedArchives[title]).map((projectName) => (
                                                <div key={projectName} className="border-bottom mb-3">
                                                    <div
                                                        className="d-flex justify-content-between align-items-center py-2"
                                                        onClick={() => toggleProjectExpansion(title, projectName)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="col-10">
                                                            <strong>{projectName}</strong>
                                                        </div>
                                                        <div className="col-2 text-right">
                                                            <button className="btn no-outline">
                                                                {expandedProject === `${title}-${projectName}` ? '▲' : '▼'}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {expandedProject === `${title}-${projectName}` && (
                                                        <div className="p-3 bg-light">
                                                            {groupedArchives[title][projectName].map((archive) => (
                                                                <div key={archive._id} className="mb-4 p-3 bg-white border rounded">
                                                                    <div>
                                                                        <strong>Chapitre {archive.chapter} , Verset {archive.verse} </strong>
                                                                        <button
                                                                            className="btn no-outline"
                                                                            onClick={() => toggleChapterExpansion(archive._id)} // Utilisation de l'ID unique pour chaque chapitre
                                                                        >
                                                                            {expandedChapterId === archive._id ? '▲' : '▼'} Voir
                                                                        </button>
                                                                    </div>

                                                                    {expandedChapterId === archive._id && (
                                                                        <div className="mt-3">
                                                                            <h6>Messages :</h6>
                                                                            {archive.messages.length > 0 ? (
                                                                                <div
                                                                                    style={{
                                                                                        maxHeight: '200px',
                                                                                        overflowY: 'auto',
                                                                                        border: '1px solid #ccc',
                                                                                        padding: '10px',
                                                                                    }}
                                                                                >
                                                                                    {archive.messages.map((message, index) => (
                                                                                        <div key={index} className="mb-2">
                                                                                            <strong>{message.author} :</strong>{' '}
                                                                                            {message.content}
                                                                                            <div className="text-muted small">
                                                                                                {new Date(message.createdAt).toLocaleString('fr-FR')}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <p>Aucun message pour ce chapitre.</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center">Aucune archive trouvée.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArchivePage;
