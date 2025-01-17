const AGENTS = require('../models/agents-model');
const Proposal = require('../models/proposal-model');
const mongoose = require('mongoose');  // Make sure to include mongoose for the session

exports.addProposalToAgent = async (req, res) => {
    const session = await mongoose.startSession();  // Start a new session

    try {
        const { proposalCode, agentCode } = req.body;

        // Find the agent by agentCode
        const agent = await AGENTS.findOne({ agentCode });

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        const proposalLimits = {
            basic: 3,
            standard: 10,
            premium: 50,
        };

        const { agentType, proposalLimit, registeredProposals } = agent;

        // Determine the allowed limit based on agentType
        const allowedLimit = proposalLimits[agentType] || proposalLimit;

        // Check if the number of registered proposals exceeds the limit
        if (registeredProposals.length >= allowedLimit) {
            return res.status(400).json({
                message: `Proposal limit exceeded. Agents with ${agentType} type can only register up to ${allowedLimit} proposal(s).`,
            });
        }

        // Check if the agent already has this proposal assigned
        const hasProposalAssigned = registeredProposals.some(
            (proposal) => proposal.proposalCode === proposalCode
        );

        if (hasProposalAssigned) {
            return res.status(400).json({
                message: 'This proposal is already assigned to this agent.',
            });
        }

        // Start a transaction
        session.startTransaction();

        // Add the new proposal to the agent's registered proposals
        agent.registeredProposals.push({ proposalCode });
        await agent.save({ session });

        // Check if the proposal already has this agent assigned
        const updatedProposal = await Proposal.findOneAndUpdate(
            { proposalCode },
            { $addToSet: { 'agentAssigned': { agentCode } } },
            { new: true, session }
        );

        if (!updatedProposal) {
            throw new Error('Proposal not found');
        }

        // Commit the transaction if everything is successful
        await session.commitTransaction();

        // Send the success response
        res.status(200).json({
            message: 'Proposal added successfully',
            registeredProposals: agent.registeredProposals,
            updatedProposal,
        });
    } catch (error) {
        // Rollback the transaction if something goes wrong
        await session.abortTransaction();
        console.error('Error adding proposal:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        // End the session
        session.endSession();
    }
};
