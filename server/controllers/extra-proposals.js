// controllers/extraProposalsController.js

const ExtraProposals = require("../models/extraProposals"); // Adjust the path as necessary

// CREATE - Add a new extra proposal
exports.createProposal = async (req, res) => {
  try {
    const { images, proposalDetails } = req.body;
    const newProposal = new ExtraProposals({
      images,
      proposalDetails,
    });
    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create extra proposal",
      details: error.message,
    });
  }
};

// READ - Get all extra proposals
exports.getExtraProposals = async (req, res) => {
  try {
    const proposals = await ExtraProposals.find();
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve extra proposals",
      details: error.message,
    });
  }
};

// READ - Get a single extra proposal by ID
exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await ExtraProposals.findById(id);
    if (!proposal) {
      return res.status(404).json({ error: "Extra proposal not found" });
    }
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve extra proposal",
      details: error.message,
    });
  }
};

// UPDATE - Update an extra proposal by ID
exports.updateProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, proposalDetails } = req.body;
    const updatedProposal = await ExtraProposals.findByIdAndUpdate(
      id,
      { images, proposalDetails },
      { new: true, runValidators: true }
    );
    if (!updatedProposal) {
      return res.status(404).json({ error: "Extra proposal not found" });
    }
    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update extra proposal",
      details: error.message,
    });
  }
};

// DELETE - Remove an extra proposal by ID
exports.deleteProposalById = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedProposal = await ExtraProposals.findByIdAndDelete({ _id: id });
    if (!deletedProposal) {
      return res.status(404).json({ error: "Extra proposal not found" });
    }
    res.status(200).json({ message: "Extra proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete extra proposal",
      details: error.message,
    });
    console.error("Failed to fetch agents:", error);
  }
};
