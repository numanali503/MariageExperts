const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Define schema
const agentsSchema = new mongoose.Schema({
    agentCode: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: false },
    phone: { type: String, required: false },
    experience: { type: String, required: false },
    registeredProposals: [
        { proposalCode: { type: String, required: false, default: 0 } }
    ],
    country: { type: String, required: false },
    city: { type: String, required: false },
    area: { type: String, required: false },
    references: { type: String, required: false },
    image: { type: String, required: true },
    isAgent: { type: Boolean, default: true },
    status: { default: "active", type: String, required: false },
    agentType: { default: "basic", type: String, required: false },
    paymentStatus: { default: "pending", type: String, required: false },
    purchasedOn: { type: String, required: false },
    proposalLimit: { type: Number, required: false, default: 3 },
    purchasedAmount: { type: Number, required: false, default: 0 },
}, { timestamps: true });

// Middleware to hash password before saving
agentsSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
agentsSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to check and update agent status
agentsSchema.methods.checkAndUpdateStatus = async function () {
    if (this.purchasedOn) {
        const purchasedDate = moment(this.purchasedOn, "YYYY-MM-DD");
        const currentDate = moment();
        if (currentDate.diff(purchasedDate, 'years') >= 1) {
            this.agentType = "basic";
            this.paymentStatus = "unpaid";
            await this.save();
        }
    }
};

// Function to update all agents' statuses
const updateAgentsStatus = async () => {
    const Agent = mongoose.model('agents', agentsSchema);
    const agents = await Agent.find({});
    for (const agent of agents) {
        await agent.checkAndUpdateStatus();
    }
    console.log('Agents status checked and updated!');
};

// Run the job every 3 seconds
// setInterval(updateAgentsStatus, 3000);
// Run the job every 10 minutes
setInterval(updateAgentsStatus, 600000);

module.exports = mongoose.model('agents', agentsSchema);
