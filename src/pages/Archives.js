import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { currentProjectContext, bcvContext } from "pithekos-lib";
import { Box, Typography, Button, Collapse } from "@mui/material";
import moment from "moment";

const ArchivePage = () => {
  const [archivedContributions, setArchivedContributions] = useState([]);
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [groupedArchives, setGroupedArchives] = useState({});
  const [expandedArchive, setExpandedArchive] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  moment.locale("en");
  const navigate = useNavigate();
  const config = require("../config.json");
  const { bcvRef } = useContext(bcvContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;
  const nameRepository = currentProjectRef.current.project;
  console.log("archive projet actuel", nameRepository);
  const url = config.auth_server;
  const urlLocal = config.rust_server;

  const fetchRepos = async () => {
    try {
      const response = await axios.get(
        `${urlLocal}/app-state/current-project/`
      );
      setCurrentProjectName(response.data.project);
    } catch (error) {
      console.log("Erreur lors de la récupération du projet actuel", error);
    }
  };
  useEffect(() => {
    fetchRepos();
  }, []);
  useEffect(() => {
    const filtered = archives.filter(
      (conv) => conv.nameProject === nameProject
    );
    setFilteredArchives(filtered);
  }, [archives, nameProject]);

  // test pour avoir les archives qui correspondent au projet choisi
  const fetchArchives = async () => {
    try {
      const response = await axios.get(`${url}/contributions/archived`);
      setArchives(response.data);
      setLoading(false);
    } catch (error) {
      console.log(
        "Erreur lors de la récupération des contributions archivées.",
        error
      );
      setError("Erreur lors de la récupération des contrubutions archivées.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchArchives();
      } catch (error) {
        console.log(
          "Erreur lors de la récupération des contributions archivées.",
          error
        );
        setError("Erreur lors de la récupération des contributions archivées.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleArchiveExpansion = (title) => {
    setExpandedArchive((prevTitle) => (prevTitle === title ? null : title));
    console.log(title);
  };

  return (
    <Box sx={{ width: "auto", margin: "auto", padding: "16px" }}>
      {error && <Typography color="error">{error}</Typography>}
  
      {archives.filter(
        (archive) =>
          archive.nameRepository === nameRepository &&
          archive.nameProject === nameProject
      ).length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary">
          Aucune conversation archivée pour ce projet.
        </Typography>
      ) : (
        archives
          .filter(
            (archive) =>
              archive.nameRepository === nameRepository &&
              archive.nameProject === nameProject
          )
          .map((archive) => (
            <Box key={archive._id}>
              <Box
                className="text-box-project-archive"
                onClick={() => toggleArchiveExpansion(archive.nameProject)}
              >
                <Typography variant="subtitle1">{archive.nameProject}</Typography>
                <Button size="small">
                  {expandedArchive === archive.nameProject ? "▲" : "▼"}
                </Button>
              </Box>
  
              <Collapse in={expandedArchive === archive.nameProject}>
                <Box
                  sx={{
                    marginBottom: 2,
                    paddingLeft: 2,
                    backgroundColor: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {archive.nameProject} –{" "}
                    {archive.description || "Pas de description disponible"}
                  </Typography>
  
                  {archive.messages && archive.messages.length > 0 ? (
                    archive.messages.map((message, index) => {
                      const formattedDate = moment(message.createdAt).isValid()
                        ? moment(message.createdAt).format(
                            "MMMM DD, YYYY [at] hh:mm A"
                          )
                        : "Date invalide";
                      return (
                        <Box key={index} sx={{ marginBottom: 1 }}>
                          <Typography variant="body2">
                            <strong>
                              {message.author} – {formattedDate}
                            </strong>
                          </Typography>
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Aucun message pour ce chapitre.
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </Box>
          ))
      )}
    </Box>
  );
};  
export default ArchivePage;
