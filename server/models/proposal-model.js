const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    proposalCode: { type: String, required: true },
    purchasedAmount: { type: String, required: false },
    purchasedOn: { type: String, required: false },
    timeline: {
      type: [{ step: String, timestamp: { type: Date, default: Date.now } }],
      required: false,
      default: [{ step: "Proposal register successfully" }],
    },
    status: {
      default: "active",
      type: String,
      required: false,
    },
    paymentStatus: {
      default: "unpaid",
      type: String,
      required: false,
    },
    clientType: {
      default: "basic",
      type: String,
      required: false,
    },
    agentAssigned: [
      {
        agentCode: { type: String, required: false },
      },
    ],
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      age: { type: Number, required: false },
      image: { type: [String], required: false },
      cnicFront: { type: String, required: false },
      cnicBack: { type: String, required: false },
      dob: { type: String, required: false },
      maritalStatus: { type: String, required: false },
      height: { type: String, required: false },
      gender: { type: String, required: false },
    },
    educationalDetails: {
      qualification: { type: String, required: false },
      institute: { type: String, required: false },
      highestDegree: { type: String, required: false },
    },
    professionalDetails: {
      profession: { type: String, required: false },
      designation: { type: String, required: false },
      company: { type: String, required: false },
      dept: { type: String, required: false },
      monthlyIncome: { type: String, required: false },
    },
    religion: {
      religion: { type: String, required: false },
      sect: { type: String, required: false },
      subCaste: { type: String, required: false },
      caste: { type: String, required: false },
    },
    residenceDetails: {
      address: { type: String, required: false },
      temporaryAddress: { type: String, required: false },
      houseType: { type: String, required: false },
      houseSize: { type: String, required: false },
      cell: { type: String, required: false },
      city: { type: String, required: false },
      nationality: { type: String, required: false },
      motherTongue: { type: String, required: false },
    },
    familyDetails: {
      father: { type: String, required: false },
      fatherOcc: { type: String, required: false },
      mother: { type: String, required: false },
      motherOcc: { type: String, required: false },
      brothers: {
        status: { type: Number, required: false },
        name: { type: Number, required: false },
        designation: { type: String, required: false },
        company: { type: String, required: false },
      },
      sisters: {
        status: { type: Number, required: false },
        designation: { type: String, required: false },
        company: { type: String, required: false },
        name: { type: Number, required: false },
      },
    },
    requirements: {
      age: { type: Number, required: false },
      maritalStatus: { type: String, required: false },
      occupation: { type: String, required: false },
      city: { type: String, required: false },
      nationality: { type: String, required: false },
      caste: { type: String, required: false },
      sect: { type: String, required: false },
      religion: { type: String, required: false },
      qualification: { type: String, required: false },
      otherReq: { type: String, required: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposals", proposalSchema);
