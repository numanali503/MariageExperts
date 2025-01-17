const AGENTS = require('../models/agents-model');
const jwt = require('jsonwebtoken');

exports.agentsRegister = async (req, res) => {
    try {
        const { password, agentCode, fullName, gender, phone, experience, country, city, area, references, image } = req.body;

        let agents = await AGENTS.findOne({ agentCode });
        if (agents) {
            return res.status(400).json({ message: 'Generated agentCode already exists, please try again.' });
        }

        agents = new AGENTS({ agentCode, password, fullName, gender, phone, experience, country, city, area, references, image });
        await agents.save();

        res.status(201).json({ message: 'User registered successfully', agentCode });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.agentsLogin = async (req, res) => {
    try {
        const { agentCode, password } = req.body;
        const agents = await AGENTS.findOne({ agentCode });
        if (!agents) {
            return res.status(400).json({ message: 'There is no user with this agentCode exists' });
        }
        const isMatch = await agents.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        await agents.save();

        const token = jwt.sign(
            { id: agents._id, agentCode: agents.agentCode, isAgent: agents.isAgent },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token, agentCode: agents.agentCode });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllAgents = async (req, res) => {
    try {
        const agents = await AGENTS.find();
        res.status(200).json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAgentById = async (req, res) => {
    try {
        const { agentCode } = req.query;

        const agent = await AGENTS.findOne({ agentCode });

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json(agent);
    } catch (error) {
        console.error('Error fetching agent by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAgentStatus = async (req, res) => {
    try {
        const { agentCode } = req.query;
        const updateData = req.body;

        const updatedAgent = await AGENTS.findOneAndUpdate(
            { agentCode },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAgent) {
            return res.status(404).json({ message: 'Agent with this agentCode does not exist' });
        }

        res.status(200).json({ message: 'Agent updated successfully', updatedAgent });
    } catch (error) {
        console.error('Error updating agent:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAgentTypeByCode = async (req, res) => {
    const { agentCode } = req.query;
    try {
        const agent = await AGENTS.findOne({ agentCode });
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Get current date and purchasedOn date
        const currentDate = new Date();
        const purchasedOn = new Date(agent.purchasedOn);

        // Check if the purchasedOn date exceeds one year from the current date
        const expirationDate = new Date(purchasedOn);
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Add one year to purchasedOn date

        // Compare the expirationDate with currentDate
        if (currentDate > expirationDate) {
            return res.status(412).json({ message: 'Error: Plan expired' });
        }

        res.json({
            agentType: agent.agentType,
            paymentStatus: agent.paymentStatus,
            purchasedOn: agent.purchasedOn
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

