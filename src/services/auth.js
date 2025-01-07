import axios from 'axios';

export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get('https://git.door43.org/api/v1/user', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération du profil utilisateur.');
    }
};

export const fetchOrganizationsWithTeamsAndRepos = async (token, username) => {
    try {
        const { data: organizationsWithDetails } = await axios.post('/get-organizations', {
            accessToken: token,
            username,
        });

        const fetchDataForOrg = async (endpoint) => {
            const promises = organizationsWithDetails.map(async (org) => {
                const { data } = await axios.post(endpoint, {
                    accessToken: token,
                    orgusername: org.username,
                });
                return data.map(item => ({ ...item, organization: org.username }));
            });
            const allData = await Promise.all(promises);
            return allData.flat();
        };

        const [teamsData] = await Promise.all([
            fetchDataForOrg('/api/get-teams'),
            fetchDataForOrg('/api/get-organizationrepos'),
        ]);

        return { organizationsWithDetails, teamsData };
    } catch (error) {
        throw new Error('Erreur lors de la récupération des organisations, équipes ou projets.');
    }
};

export const exchangeCodeForAccessToken = async (code) => {
    try {
        const { data } = await axios.post(`/client`, { code });
        return data.access_token;
    } catch (error) {
        throw new Error("Erreur lors de l'échange du code pour le token.");
    }
};

export const logout = async () => {
    try {
        await axios.get('/logout');
    } catch (error) {
        throw new Error('Erreur lors de la déconnexion.');
    }
};

