import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
const Home = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const config = require("../config.json");
  const url = config.auth_server;

  // Recuperation des dépots du serveur
  const fetchRepos = async () => {
    try {
      const response = await axios.get(`${url}/choose-repos`);
      setProjectNames(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  if (selectedRepo !== "") {
    fetch(`${url}/select-project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectProjectName: selectedRepo }),
    });
  }

  // const fetchCollaborators = async () => {
  //   try{
  //     const response = await axios.get(`${url}/repos-collaborators`);
  //     setCollaborators(response.data);
  //     console.log(response.data);
  //   }catch (err){
  //     console.error("Erreur lors de la récupération des collaborateurs:",err);
  //   }
  // }
  useEffect(() => {
    fetchRepos();
    //fetchCollaborators();
  }, []);

  const handleChange = (event) => {
    setSelectedRepo(event.target.value);
  };

  return (
    <div>
      <Navigation />
      <h2>Choisissez un dépôt</h2>
      <select value={selectedRepo} onChange={handleChange}>
        <option value="">Sélectionnez un dépôt</option>
        {projectNames.map((repo) => (
          <option key={repo} value={repo}>
            {repo}
          </option>
        ))}
      </select>
      {selectedRepo && <p>Dépôt sélectionné: {selectedRepo}</p>}
    </div>
  );
};

export default Home;
