import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { currentProjectContext } from "pithekos-lib";
const Home = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const { currentProjectRef } = useContext(currentProjectContext);
  const config = require("../config.json");
  const url = config.auth_server;
  const urlLocal = config.rust_server;

  // Recuperation des dépots du serveur
  const fetchRepos = async () => {
    try {
      const response = await axios.get(
        `${urlLocal}/app-state/current-project/`
      );
      console.log(response.data);
      const currentProjectName = response.data.project;
      const currentOrganisationName = response.data.organization;
      console.log(`Project selec :`, currentProjectName);
      console.log(`orga selec :`, currentOrganisationName);

      if (response.data !== null) {
        const returnProject = await axios.get(`${url}/repos-collaborators?organisation_name=${currentOrganisationName}&project_name=${currentProjectName}&client_code=ff1ff09b-638d-448c-a6f1-a94adaab37e5`);
        console.log("envoi au serveur", returnProject);
        setCollaborators(returnProject.data.NameCollaborators);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div>
      <Navigation />
      <h2>Choisissez un dépôt</h2>
      <p>
        Project :
        {!currentProjectRef.current
          ? "None"
          : `organisation ${currentProjectRef.current.organization}, Project ${currentProjectRef.current.project}`}
      </p>
      {collaborators.length > 0 ? (
        collaborators.map((collaborator, index) => (
          <li key={index}>{collaborator.name}</li>
        ))
      ) : (
        <p>Aucun collaborateur trouvé pour ce projet.</p>
      )}
      {selectedRepo && <p>Dépôt sélectionné: {selectedRepo}</p>}
      <p></p>
    </div>
  );
};

export default Home;
