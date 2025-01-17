const PROPOSAL = require("../models/proposal-model"); // Import the model

// Register a new proposal (POST)
exports.sendProposal = async (req, res) => {
  try {
    const {
      personalInfo,
      educationalDetails,
      professionalDetails,
      religion,
      residenceDetails,
      familyDetails,
      requirements,
    } = req.body;

    const nameInitials = personalInfo.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900); // Generates a 3-digit random number
    const proposalCode = `${nameInitials}${randomDigits}`;

    // Check if a proposal with the same proposalCode already exists
    let proposal = await PROPOSAL.findOne({ proposalCode });
    if (proposal) {
      return res
        .status(400)
        .json({ message: "Proposal with this proposalCode already exists" });
    }

    // Create and save the new proposal
    proposal = new PROPOSAL({
      proposalCode,
      personalInfo,
      educationalDetails,
      professionalDetails,
      religion,
      residenceDetails,
      familyDetails,
      requirements,
    });

    await proposal.save();
    res
      .status(201)
      .json({ message: "Proposal registered successfully", proposal });
    console.log("Proposal registered successfully:", proposal);
  } catch (error) {
    console.error("Error registering proposal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.sendProposalbyPanel = async (req, res) => {
  try {
    const {
      personalInfo,
      educationalDetails,
      professionalDetails,
      religion,
      agentAssigned,
      residenceDetails,
      familyDetails,
      requirements,
    } = req.body;

    const nameInitials = personalInfo.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900); // Generates a 3-digit random number
    const proposalCode = `${nameInitials}${randomDigits}`;

    // Check if a proposal with the same proposalCode already exists
    let proposal = await PROPOSAL.findOne({ proposalCode });
    if (proposal) {
      return res
        .status(400)
        .json({ message: "Proposal with this proposalCode already exists" });
    }

    // Create and save the new proposal
    proposal = new PROPOSAL({
      proposalCode,
      personalInfo,
      educationalDetails,
      agentAssigned,
      professionalDetails,
      religion,
      residenceDetails,
      familyDetails,
      requirements,
    });

    await proposal.save();
    res
      .status(201)
      .json({ message: "Proposal registered successfully", proposal });
    console.log("Proposal registered successfully:", proposal);
  } catch (error) {
    console.error("Error registering proposal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getAllProposals = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count of proposals
    const total = await PROPOSAL.countDocuments();
    
    // Fetch paginated proposals
    const proposals = await PROPOSAL
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({ 
      proposals,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};



// Get a single proposal by ID (GET)
exports.getProposalByProposalCode = async (req, res) => {
  try {
    const { proposalCode } = req.query; // Get the username from the query parameters

    // Find a proposal by agentAssigned.username
    const proposal = await PROPOSAL.findOne({ proposalCode: proposalCode });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({ proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProposalByAgentCode = async (req, res) => {
  try {
    const { agentCode } = req.query;
    const LIMIT = 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * LIMIT;

    // Get total count of proposals for this agent
    const total = await PROPOSAL.countDocuments({
      "agentAssigned.agentCode": agentCode,
    });

    // Find proposals with pagination
    const proposal = await PROPOSAL
      .find({
        "agentAssigned.agentCode": agentCode,
      })
      .skip(skip)
      .limit(LIMIT)
      .exec();

    if (!proposal || proposal.length === 0) {
      return res.status(404).json({ message: "No proposals found for this agent" });
    }

    res.status(200).json({ 
      proposal,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / LIMIT)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProposalById = async (req, res) => {
  try {
    const { proposalCode } = req.query; // Extract proposalCode from query parameters
    const updateData = req.body; // Extract fields to update from request body

    // Find the proposal by proposalCode and update its details
    const updatedProposal = await PROPOSAL.findOneAndUpdate(
      { proposalCode },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProposalTimeline = async (req, res) => {
  try {
    const { proposalCode } = req.query;
    const { timeline } = req.body;

    const updatedProposal = await PROPOSAL.findOneAndUpdate(
      { proposalCode },
      { timeline },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res
      .status(200)
      .json({ message: "Timeline updated", proposal: updatedProposal });
  } catch (error) {
    console.error("Error updating timeline:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProposalByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Get the username from the query parameters

    // Find a proposal by agentAssigned.username
    const proposal = await PROPOSAL.findOne({ "personalInfo.email": email });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({ proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProposalByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Extract email from query parameters
    const updateData = req.body; // Extract fields to update from request body

    // Find the proposal by email and update its details
    const updatedProposal = await PROPOSAL.findOneAndUpdate(
      { "personalInfo.email": email },
      { $set: updateData }, // Use $set to explicitly update fields
      { new: true, runValidators: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteProposalByCode = async (req, res) => {
  try {
    const { proposalCode } = req.query;

    // Check if proposal code is provided
    if (!proposalCode) {
      return res.status(400).json({
        success: false,
        message: "Proposal code is required",
      });
    }

    // Find and delete the proposal
    const deletedProposal = await PROPOSAL.findOneAndDelete({ proposalCode });

    // If proposal not found
    if (!deletedProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
      data: deletedProposal,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "Error deleting proposal",
      error: error.message,
    });
  }
};
