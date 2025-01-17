const axios = require('axios');

const apiKey = process.env.API_KEY; // API key

function agentCheckMiddleware(req, res, next) {
    const username = req.headers['agent-username'];

    if (!username) {
        return res.status(400).json({ error: 'Agent username is required in the header' });
    }

    const fetchAgent = async (username) => {
        try {
            const response = await axios.get(`http://localhost:6969/api/auth/get-agent`, {
                params: { username },
                headers: {
                    'x-api-key': apiKey,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch agent:', error.message);
            throw new Error('Internal server error');
        }
    };

    fetchAgent(username)
        .then(agent => {
            if (!agent) {
                return res.status(404).json({ error: 'Agent not found' });
            }

            const { agentType, registeredProposals } = agent;
            consoel.log('agentType:', agent);
            let limitExceeded = false;

            if (agentType === 'basic' && registeredProposals >= 1) {
                limitExceeded = true;
            } else if (agentType === 'standard' && registeredProposals > 10) {
                limitExceeded = true;
            } else if (agentType === 'premium' && registeredProposals > 50) {
                limitExceeded = true;
            }

            if (limitExceeded) {
                return res.status(403).json({ error: 'Proposal limit exceeded for agent type' });
            }
            req.agent = agent;
            next();
        })
        .catch(err => {
            console.error('Error fetching agent:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
}

module.exports = agentCheckMiddleware;
