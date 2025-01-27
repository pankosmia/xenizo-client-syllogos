import React, { createContext, useState, useContext } from 'react';

// Créer un contexte
const ContributionsContext = createContext();

// Fournisseur du contexte
export const ContributionsProvider = ({ children }) => {
  const [contributions, setContributions] = useState([]);

  return (
    <ContributionsContext.Provider value={{ contributions, setContributions }}>
      {children}
    </ContributionsContext.Provider>
  );
};

// Hook pour utiliser le contexte dans n'importe quel composant
export const useContributions = () => {
  return useContext(ContributionsContext);
};
