// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navigation from "../components/Navigation";
// const config = require("../config.json");

// const Organisation = () => {
//   const [organisations, setOrganisations] = useState();
//   const url = config.auth_server;

//   useEffect(() => {
//     const fetchOrganisation = async () => {
//       try {
//         const reponse = await axios.get(`${url}/get-organisations`);
//         setOrganisations(reponse.data);
//       } catch (err) {
//         console.log("Erreur lors de la récuperation des organisations", err);
//       }
//     };
//     fetchOrganisation();
//   });
//   console.log(setOrganisations());

//   return (
//     <div>
//       <Navigation />
//       <div className="container">
//         <h1 className="my-4">Liste des Organisations</h1>
//         <div className="mb-3">
//           <input
//             type="text"
//             placeholder="Rechercher par nom d'organisation..."
//             className="form-control"
//           />
//         </div>
//         <div className="row bg-secondary text-center text-white py-2 organization">
//           <div className="col-3 d-sm-block">Nom de l'Organisation</div>
//           <div className="col-3 d-sm-block">Date de Création</div>
//           <div className="col-3 d-sm-block">Équipes</div>
//           <div className="col-3 d-sm-block">Membres</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Organisation;
