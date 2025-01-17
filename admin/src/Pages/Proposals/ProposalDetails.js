import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/data";
import jsPDF from "jspdf";

const ProposalDetails = () => {
  const { proposalCode } = useParams();
  console.log(proposalCode);

  const { authURL } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentCode, setAgentCode] = useState("");
  const [currentProfileImage, setCurrentProfileImage] = useState(0);
  const [currentIdImage, setCurrentIdImage] = useState(0);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate(); // Add this import at the top: import { useNavigate } from 'react-router-dom';

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(
          `${authURL}/get-proposal-by-code?proposalCode=${proposalCode}`,
          {
            headers: {
              "x-api-key": "Imran@ME",
            },
          }
        );
        const data = await response.json();
        setProposal(data.proposal);
        setStatus(data.proposal.status || "active");
        // Update to use agentAssigned instead of assignedAgents
        if (data.proposal.agentAssigned) {
          setAssignedAgents(data.proposal.agentAssigned);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching proposal:", error);
        toast.error("Failed to fetch proposal details");
        setLoading(false);
      }
    };

    fetchProposal();
  }, [authURL, proposalCode]);

  const handleDeleteProposal = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to delete this proposal? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${authURL}/delete-proposal?proposalCode=${proposalCode}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Imran@ME",
          },
          body: JSON.stringify({ proposalCode }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Proposal deleted successfully");
        // Navigate back to proposals list or dashboard
        navigate("/dashboard/proposals"); // Adjust this path according to your routing
      } else {
        toast.error(result.message || "Failed to delete proposal");
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("Failed to delete proposal");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(
        `${authURL}/update-proposal?proposalCode=${proposalCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Imran@ME",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus(newStatus);
        setProposal((prev) => ({ ...prev, status: newStatus }));
        toast.success(result.message || "Status updated successfully");
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const assignAgent = async () => {
    if (!agentCode) {
      toast.error("Please provide an agent code");
      return;
    }

    try {
      const response = await fetch(`${authURL}/assign-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "Imran@ME",
        },
        body: JSON.stringify({
          proposalCode: proposal.proposalCode,
          agentCode,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Agent successfully assigned");
        // Update to use agentAssigned
        if (result.agentAssigned) {
          setAssignedAgents(result.agentAssigned);
        }
        setAgentCode(""); // Clear the input field
      } else {
        toast.error(`Error: ${result.message || "Unable to assign agent"}`);
      }
    } catch (error) {
      console.error("Error assigning agent:", error);
      toast.error("Error assigning agent");
    }
  };

  const removeAgent = async (agentToRemove) => {
    const agentCode = agentToRemove.agentCode || agentToRemove.code;

    if (
      !window.confirm(`Are you sure you want to remove agent ${agentCode}?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${authURL}/remove-assignment?proposalCode=${proposal.proposalCode}&agentCode=${agentCode}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": "Imran@ME",
          },
        }
      );

      if (response.ok) {
        toast.success("Agent removed successfully");
        setAssignedAgents((prevAgents) =>
          prevAgents.filter(
            (agent) => (agent.agentCode || agent.code) !== agentCode
          )
        );
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove agent");
      }
    } catch (error) {
      console.error("Error removing agent:", error);
      toast.error("Failed to remove agent");
    }
  };

  const ImageGallery = ({
    images,
    currentIndex,
    setCurrentIndex,
    aspectRatio = "square",
  }) => {
    if (!images || images.length === 0)
      return (
        <div className="text-gray-500 text-center py-8">
          No images available
        </div>
      );

    return (
      <div className="space-y-4">
        <div
          className={`relative flex items-center justify-center ${
            aspectRatio === "square" ? "aspect-square" : "h-96"
          }`}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="h-full w-auto object-contain rounded-lg"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                →
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? "bg-rose-950" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const DataRow = ({ label, value }) => (
    <div className="py-2">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-600">{value || "N/A"}</span>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <div className="bg-rose-50 border-2 border-rose-200 p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-rose-950 border-b pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-950"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">Proposal not found</div>
      </div>
    );
  }

  const generatePDF = () => {
    const formatText = (text) => {
      if (text === null || text === undefined) return "N/A";
      return String(text).trim();
    };

    // Create new document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    };

    // Define colors
    const primaryColor = hexToRgb("9f1239"); // Deep rose color
    const secondaryColor = primaryColor.map((c) => Math.floor(c * 0.8)); // Slightly darker version
    const accentColor = hexToRgb("fecdd3"); // Light pink for accents
    const textColor = [60, 60, 60]; // Dark gray for text

    // Add decorative header with gradient-like effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, "F");

    // Add decorative accent line
    doc.setFillColor(...accentColor);
    doc.rect(0, 35, 210, 2, "F");

    // Add title with enhanced styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Marriage Experts", 105, 22, { align: "center" });

    let y = 50; // Start content below header

    // Add profile image if available
    if (proposal?.personalInfo?.image?.[0]) {
      try {
        const imgData = proposal.personalInfo.image[0];
        // Add circular-looking border effect
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1);
        doc.roundedRect(70, y, 70, 70, 3, 3); // Rounded rectangle for image frame
        doc.addImage(imgData, "JPEG", 71, y + 1, 68, 68);

        // Add decorative corners
        const cornerSize = 5;
        // Top left
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(70, y + cornerSize, 70, y);
        doc.line(70, y, 70 + cornerSize, y);
        // Top right
        doc.line(140 - cornerSize, y, 140, y);
        doc.line(140, y, 140, y + cornerSize);
        // Bottom left
        doc.line(70, y + 70 - cornerSize, 70, y + 70);
        doc.line(70, y + 70, 70 + cornerSize, y + 70);
        // Bottom right
        doc.line(140 - cornerSize, y + 70, 140, y + 70);
        doc.line(140, y + 70, 140, y + 70 - cornerSize);

        y += 80;
      } catch (error) {
        console.error("Error adding image:", error);
        y += 10;
      }
    }

    // Utility function to add a styled section
    const addSection = (title, content) => {
      try {
        if (y + 40 > 280) {
          doc.addPage();
          y = 20;
        }

        // Add section title with enhanced styling
        doc.setFillColor(...primaryColor);
        doc.roundedRect(15, y, 180, 10, 2, 2, "F");

        // Add subtle accent
        doc.setFillColor(...accentColor);
        doc.rect(15, y + 10, 180, 0.5, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(formatText(title), 20, y + 7);
        y += 17;

        // Add content with enhanced styling
        doc.setTextColor(...textColor);
        doc.setFontSize(11);

        content.forEach((line) => {
          if (y + 7 > 280) {
            doc.addPage();
            y = 20;
          }

          if (typeof line === "object" && line !== null) {
            const label = formatText(line.label);
            const value = formatText(line.value);

            // Label with primary color
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primaryColor);
            doc.text(label + ": ", 20, y);

            const labelWidth = doc.getTextWidth(label + ": ");

            // Value in dark gray
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...textColor);
            const maxWidth = 125;
            const splitValue = doc.splitTextToSize(value, maxWidth);

            doc.text(splitValue, 20 + labelWidth, y);
            y += 7 * splitValue.length;
          } else {
            doc.text(formatText(line), 20, y);
            y += 7;
          }
        });

        // Add decorative bottom border
        y += 3;
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(0.2);
        doc.line(15, y, 195, y);
        y += 10;
      } catch (error) {
        console.error(`Error in section ${title}:`, error);
      }
    };

    if (proposal) {
      try {
        // Personal Information
        addSection("Personal Information", [
          { label: "Name", value: proposal.personalInfo?.name },
          { label: "Age", value: proposal.personalInfo?.age },
          { label: "Height", value: proposal.personalInfo?.height },
          { label: "Gender", value: proposal.personalInfo?.gender },
          {
            label: "Marital Status",
            value: proposal.personalInfo?.maritalStatus,
          },
          { label: "Date of Birth", value: proposal.personalInfo?.dob },
        ]);

        // Professional Details
        addSection("Professional Details", [
          {
            label: "Profession",
            value: proposal.professionalDetails?.profession,
          },
          {
            label: "Designation",
            value: proposal.professionalDetails?.designation,
          },
          { label: "Company", value: proposal.professionalDetails?.company },
          { label: "Department", value: proposal.professionalDetails?.dept },
          {
            label: "Monthly Income",
            value: proposal.professionalDetails?.monthlyIncome,
          },
        ]);

        // Educational Details
        addSection("Educational Details", [
          {
            label: "Qualification",
            value: proposal.educationalDetails?.qualification,
          },
        ]);

        // Religion Details
        addSection("Religion Details", [
          { label: "Religion", value: proposal.religion?.religion },
          { label: "Sect", value: proposal.religion?.sect },
          { label: "Caste", value: proposal.religion?.caste },
          { label: "Sub Caste", value: proposal.religion?.subCaste },
          {
            label: "Mother Tongue",
            value: proposal.residenceDetails?.motherTongue,
          },
        ]);

        // Residence Details
        addSection("Residence Details", [
          {
            label: "Permanent Address",
            value: proposal.residenceDetails?.address,
          },
          {
            label: "Temporary Address",
            value: proposal.residenceDetails?.temporaryAddress,
          },
          {
            label: "House Status",
            value: proposal.residenceDetails?.houseType,
          },
          { label: "House Size", value: proposal.residenceDetails?.houseSize },
          { label: "Contact", value: proposal.residenceDetails?.cell },
          {
            label: "Nationality",
            value: proposal.residenceDetails?.nationality,
          },
        ]);

        // Family Information
        const brothers = proposal.familyDetails?.brothers || [];
        const sisters = proposal.familyDetails?.sisters || [];
        addSection("Family Information", [
          { label: "Father's Name", value: proposal.familyDetails?.father },
          {
            label: "Father's Occupation",
            value: proposal.familyDetails?.fatherOcc,
          },
          { label: "Mother's Name", value: proposal.familyDetails?.mother },
          {
            label: "Mother's Occupation",
            value: proposal.familyDetails?.motherOcc,
          },
          {
            label: "Brothers",
            value: brothers.length
              ? brothers
                  .map((b) => `${formatText(b.name)} - ${formatText(b.status)}`)
                  .join(", ")
              : "No brothers",
          },
          {
            label: "Sisters",
            value: sisters.length
              ? sisters
                  .map((s) => `${formatText(s.name)} - ${formatText(s.status)}`)
                  .join(", ")
              : "No sisters",
          },
        ]);

        // Partner Requirements
        addSection("Partner Requirements", [
          {
            label: "Marital Status",
            value: proposal.requirements?.maritalStatus,
          },
          { label: "Age", value: proposal.requirements?.age },
          { label: "Height", value: proposal.requirements?.height },
          { label: "Religion", value: proposal.requirements?.religion },
          { label: "Sect", value: proposal.requirements?.sect },
          { label: "Caste", value: proposal.requirements?.caste },
          { label: "City", value: proposal.requirements?.city },
          { label: "Nationality", value: proposal.requirements?.nationality },
          {
            label: "Qualification",
            value: proposal.requirements?.qualification,
          },
          { label: "Occupation", value: proposal.requirements?.occupation },
          {
            label: "Other Requirements",
            value: proposal.requirements?.otherReq,
          },
        ]);

        // Add footer with page numbers and decorative elements
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          // Add decorative footer line
          doc.setDrawColor(...primaryColor);
          doc.setLineWidth(0.5);
          doc.line(20, 285, 190, 285);

          // Add page numbers
          doc.setTextColor(...primaryColor);
          doc.setFontSize(10);
          doc.text(`Page ${i} of ${pageCount}`, 105, 292, { align: "center" });
        }

        // Save the PDF
        doc.save(`Marriage_Experts_${formatText(proposalCode)}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF. Please try again.");
      }
    }
  };

  const profileImages = proposal.personalInfo?.image || [];
  const idImages = [
    proposal.personalInfo?.cnicFront,
    proposal.personalInfo?.cnicBack,
  ].filter(Boolean);

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-rose-50 border-2 border-rose-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-rose-950">
              Proposal Details
            </h2>
            <div className="flex items-center gap-4">
              {/* Status dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Status:</label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className={`px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-rose-500
      ${updatingStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <option value="Active">Active</option>
                  <option value="In Active">In Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Sarted">Not Sarted</option>
                </select>
                {updatingStatus && (
                  <div className="ml-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-rose-950"></div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={generatePDF}
                  className="bg-rose-950 text-white px-4 py-2 rounded-lg shadow-md hover:bg-rose-800 flex items-center gap-2"
                >
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleDeleteProposal}
                  disabled={isDeleting}
                  className={`bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 flex items-center gap-2 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <span>Deleting...</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                    </>
                  ) : (
                    <span>Delete Proposal</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Proposal Code Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-rose-950">
              Proposal Code
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-rose-200">
              <p className="text-lg text-gray-800">{proposal.proposalCode}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-rose-950">
              Assigned Agents
            </h3>
            <div className="space-y-4">
              {assignedAgents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedAgents.map((agent, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm border border-rose-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {agent.name || agent.agentCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          Code: {agent.code || agent.agentCode}
                        </p>
                        {agent.role && (
                          <p className="text-sm text-gray-600">
                            Role: {agent.role}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeAgent(agent)}
                        className="text-rose-600 hover:text-rose-800 p-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No agents assigned yet</p>
              )}
            </div>
          </div>

          {/* Assign New Agent Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign New Agent:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value)}
                placeholder="Enter Agent Code - ABC123..."
                className="flex-1 px-4 py-2 border rounded-md shadow-sm"
              />
              <button
                onClick={assignAgent}
                className="px-6 py-2 bg-rose-950 text-white rounded-md hover:bg-rose-900 transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SectionCard title="Profile Images">
            <ImageGallery
              images={profileImages}
              currentIndex={currentProfileImage}
              setCurrentIndex={setCurrentProfileImage}
              aspectRatio="square"
            />
          </SectionCard>

          <SectionCard title="ID Cards">
            <ImageGallery
              images={idImages}
              currentIndex={currentIdImage}
              setCurrentIndex={setCurrentIdImage}
              aspectRatio="video"
            />
          </SectionCard>
        </div>

        <SectionCard title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataRow label="Name" value={proposal.personalInfo?.name} />
            <DataRow label="Age" value={proposal.personalInfo?.age} />
            <DataRow label="Height" value={proposal.personalInfo?.height} />
            <DataRow label="Gender" value={proposal.personalInfo?.gender} />
            <DataRow
              label="Marital Status"
              value={proposal.personalInfo?.maritalStatus}
            />
            <DataRow label="Date of Birth" value={proposal.personalInfo?.dob} />
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="Educational Details">
            <DataRow
              label="Qualification"
              value={proposal.educationalDetails?.qualification}
            />
          </SectionCard>

          <SectionCard title="Professional Details">
            <div className="grid gap-4">
              <DataRow
                label="Profession"
                value={proposal.professionalDetails?.profession}
              />
              <DataRow
                label="Designation"
                value={proposal.professionalDetails?.designation}
              />
              <DataRow
                label="Company"
                value={proposal.professionalDetails?.company}
              />
              <DataRow
                label="Department"
                value={proposal.professionalDetails?.dept}
              />
              <DataRow
                label="Monthly Income"
                value={proposal.professionalDetails?.monthlyIncome}
              />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Religion Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataRow label="Religion" value={proposal.religion?.religion} />
            <DataRow label="Sect" value={proposal.religion?.sect} />
            <DataRow label="Caste" value={proposal.religion?.caste} />
            <DataRow label="Sub Caste" value={proposal.religion?.subCaste} />
            <DataRow
              label="Mother Tongue"
              value={proposal.residenceDetails?.motherTongue}
            />
          </div>
        </SectionCard>

        <SectionCard title="Residence Details">
          <div className="grid grid-cols-1 gap-4">
            <DataRow
              label="Permanent Address"
              value={proposal.residenceDetails?.address}
            />
            <DataRow
              label="Temporary Address"
              value={proposal.residenceDetails?.temporaryAddress}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DataRow
                label="House Status"
                value={proposal.residenceDetails?.houseType}
              />
              <DataRow
                label="House Size"
                value={proposal.residenceDetails?.houseSize}
              />
              <DataRow
                label="Contact"
                value={proposal.residenceDetails?.cell}
              />
              <DataRow
                label="Nationality"
                value={proposal.residenceDetails?.nationality}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Family Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DataRow
                label="Father's Name"
                value={proposal.familyDetails?.father}
              />
              <DataRow
                label="Father's Occupation"
                value={proposal.familyDetails?.fatherOcc}
              />
              <DataRow
                label="Mother's Name"
                value={proposal.familyDetails?.mother}
              />
              <DataRow
                label="Mother's Occupation"
                value={proposal.familyDetails?.motherOcc}
              />
            </div>
            <div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Brothers:</h4>
                {proposal.familyDetails?.brothers?.length > 0 ? (
                  proposal.familyDetails.brothers.map((brother, index) => (
                    <div key={index} className="ml-4 py-1">
                      {brother.name} - {brother.status}
                    </div>
                  ))
                ) : (
                  <div className="ml-4 text-gray-500">No brothers</div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sisters:</h4>
                {proposal.familyDetails?.sisters?.length > 0 ? (
                  proposal.familyDetails.sisters.map((sister, index) => (
                    <div key={index} className="ml-4 py-1">
                      {sister.name} - {sister.status}
                    </div>
                  ))
                ) : (
                  <div className="ml-4 text-gray-500">No sisters</div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Partner Requirements">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataRow
              label="Marital Status"
              value={proposal.requirements?.maritalStatus}
            />
            <DataRow label="Age" value={proposal.requirements?.age} />
            <DataRow label="Height" value={proposal.requirements?.height} />
            <DataRow label="Religion" value={proposal.requirements?.religion} />
            <DataRow label="Sect" value={proposal.requirements?.sect} />
            <DataRow label="Caste" value={proposal.requirements?.caste} />
            <DataRow label="City" value={proposal.requirements?.city} />
            <DataRow
              label="Nationality"
              value={proposal.requirements?.nationality}
            />
            <DataRow
              label="Qualification"
              value={proposal.requirements?.qualification}
            />
            <DataRow
              label="Occupation"
              value={proposal.requirements?.occupation}
            />
          </div>
          {proposal.requirements?.otherReq && (
            <div className="mt-4">
              <span className="font-semibold">Other Requirements:</span>
              <p className="mt-2 text-gray-600">
                {proposal.requirements?.otherReq}
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default ProposalDetails;
