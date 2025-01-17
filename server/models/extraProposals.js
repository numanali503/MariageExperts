const mongoose = require('mongoose');

const extraProposalsSchema = new mongoose.Schema({
    images: { type: [String], required: false },
    proposalDetails: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('extra-proposals', extraProposalsSchema);
