const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING Controllers & Middlewares 😎 ===================================================
const {
  adminRegister,
  adminLogin,
} = require("../controllers/admin-auth-controller");
const {
  createProposal,
  getExtraProposals,
  deleteProposalById,
} = require("../controllers/extra-proposals");
const {
  agentsRegister,
  agentsLogin,
  getAllAgents,
  updateAgentStatus,
  getAgentById,
  getAgentTypeByCode,
} = require("../controllers/agents-auth-controller");
const { removeAgentFromProposal } = require("../controllers/unAssignAgent");
const {
  sendProposal,
  sendProposalbyPanel,
  getAllProposals,
  updateProposalById,
  deleteProposalByCode,
  getProposalByProposalCode,
  getProposalByAgentCode,
  updateProposalTimeline,
  getProposalByEmail,
  updateProposalByEmail,
  getFilteredProposals
} = require("../controllers/proposal-controller");
const { verifyAdminToken } = require("../middleware/adminAuthMiddleware");
const { verifyAgentsToken } = require("../middleware/agentsAuthMiddleware");
const { addProposalToAgent } = require("../controllers/assignProposal");
const protectAPIsMiddleware = require("../middleware/protectAPI");

// * ADMINISTRATOR 😎 ====================================================================
router.route("/admin-registration").post(adminRegister);
router.route("/admin-login").post(adminLogin);
router.route("/admin-authenticate").post(verifyAdminToken, (req, res) => {
  res.json({ message: "Welcome to Mariage Experts Portal" });
});

// * AGENTS 😎 ====================================================================
router.route("/agents-registration").post(agentsRegister);
router.route("/agents-login").post(agentsLogin);

router.route("/get-agentType").get(protectAPIsMiddleware, getAgentTypeByCode);
router.route("/get-all-agents").get(protectAPIsMiddleware, getAllAgents);
router.route("/get-agent").get(protectAPIsMiddleware, getAgentById);
router.route("/update-agent-status").put(updateAgentStatus);

router.route("/remove-assignment").delete(removeAgentFromProposal);
router.route("/assign-agent").post(addProposalToAgent);

router.route("/agent-authenticate").post(verifyAgentsToken, (req, res) => {
  res.json({ message: "Welcome to Mariage Experts Portal" });
});

// * FUNTIONALITY 😎 ====================================================================
router.route("/post-proposal").post(sendProposal);
router.route("/post-proposal-panel").post(sendProposalbyPanel);
router.route("/get-proposals").get(protectAPIsMiddleware, getAllProposals);
router
  .route("/get-proposal-by-code")
  .get(protectAPIsMiddleware, getProposalByProposalCode);
router
  .route("/get-proposal-by-agent")
  .get(protectAPIsMiddleware, getProposalByAgentCode);
router
  .route("/get-proposal-by-email")
  .get(protectAPIsMiddleware, getProposalByEmail);
router.route("/update-proposal").put(protectAPIsMiddleware, updateProposalById);
router
  .route("/update-proposal-timeline")
  .put(protectAPIsMiddleware, updateProposalTimeline);
router
  .route("/update-proposal-email")
  .put(protectAPIsMiddleware, updateProposalByEmail);
router.route("/delete-proposal").delete(deleteProposalByCode);

router.route("/post-extra-proposal").post(createProposal);
router.route("/get-extra-proposal").get(getExtraProposals);
router.route("/delete-extra-proposal").delete(deleteProposalById);

module.exports = router;
