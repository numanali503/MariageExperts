const Agent = require('../models/agents-model');
const Proposal = require('../models/proposal-model');
const mongoose = require('mongoose');  // Make sure to include mongoose for the session


exports.removeAgentFromProposal = async (req, res) => {
    try {
        const { agentCode, proposalCode } = req.query;

        if (!agentCode || !proposalCode) {
            return res.status(400).json({ message: 'Agent code and proposal code are required' });
        }

        const proposal = await Proposal.findOneAndUpdate(
            { proposalCode },
            { $pull: { agentAssigned: { $or: [{ agentCode }, { code: agentCode }] } } },
            { new: true }
        );

        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        const agent = await Agent.findOneAndUpdate(
            { agentCode },
            { $pull: { registeredProposals: { proposalCode } } },
            { new: true }
        );

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        return res.status(200).json({
            message: 'Agent removed successfully',
            proposal,
            agent
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};