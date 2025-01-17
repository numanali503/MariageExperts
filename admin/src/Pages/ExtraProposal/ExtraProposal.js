import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ExtraProposal() {
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

  // Filter proposals based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProposals(proposals);
    } else {
      const filtered = proposals.filter((proposal) => {
        const temp = document.createElement("div");
        temp.innerHTML = proposal.proposalDetails;
        const text = temp.textContent || temp.innerText;
        return text.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProposals(filtered);
    }
  }, [searchTerm, proposals]);

  // Custom CSS for heading styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ql-editor h1 { font-size: 2em; font-weight: bold; }
      .ql-editor h2 { font-size: 1.5em; font-weight: bold; }
      .ql-editor h3 { font-size: 1.17em; font-weight: bold; }
      .prose h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
      .prose h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
      .prose h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch proposals
  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://marriage.bzsconnect.com/api/auth/get-extra-proposal"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      const data = await response.json();
      setProposals(data);
      setFilteredProposals(data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleProposalSelect = (proposal) => {
    setSelectedProposal(proposal);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedProposal(null);
    setImages([]);
    setText("");
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      setImages([...images, ...base64Images]);
    } catch (error) {
      console.error("Error converting images to Base64:", error);
    }
  };

  const handleTextChange = (value) => {
    setText(value);
  };

  const handleSubmit = async () => {
    try {
      const requestBody = {
        images,
        proposalDetails: text,
      };

      const response = await fetch(
        "https://marriage.bzsconnect.com/api/auth/post-extra-proposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit proposal");
      }
      alert("Proposal created successfully");
      setImages([]);
      setText("");
      setIsCreating(false);
      fetchProposals();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to create proposal");
    }
  };

  const handleDelete = async () => {
    if (!selectedProposal) {
      alert("No proposal selected");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://marriage.bzsconnect.com/api/auth/delete-extra-proposal?id=${selectedProposal._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete proposal");
      }

      alert("Proposal deleted successfully");
      const updatedProposals = proposals.filter(
        (proposal) => proposal._id !== selectedProposal._id
      );
      setProposals(updatedProposals);
      setFilteredProposals(updatedProposals);
      setSelectedProposal(null);
    } catch (error) {
      console.error("Error deleting proposal:", error);
      alert("Failed to delete proposal");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFirstLine = (htmlContent) => {
    const temp = document.createElement("div");
    temp.innerHTML = htmlContent;
    const text = temp.textContent || temp.innerText;
    const firstLine = text.split("\n")[0].trim();
    return firstLine;
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-rose-900"></i>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white shadow-md overflow-y-auto">
        <div className="p-4 border-b space-y-4">
          <button
            onClick={handleCreateNew}
            className="w-full bg-rose-900 text-white px-4 py-2 rounded hover:bg-rose-800 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> Create New Proposal
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent pl-10"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <div className="divide-y">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal._id}
              onClick={() => handleProposalSelect(proposal)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedProposal?._id === proposal._id ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={proposal.images[0]}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-bold text-gray-900 truncate">
                    {getFirstLine(proposal.proposalDetails)}
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-400 flex-shrink-0"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {isCreating ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Upload Images
              </label>
              <div className="relative border-dashed border-2 border-gray-300 p-8 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">
                  Drag & drop or click to upload images
                </p>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Proposal Details
              </label>
              <ReactQuill
                value={text}
                onChange={handleTextChange}
                modules={modules}
                formats={formats}
                theme="snow"
                className="bg-white"
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>

            <button
              className="bg-rose-900 text-white px-6 py-2 rounded-lg hover:bg-rose-800 flex items-center"
              onClick={handleSubmit}
            >
              <i className="fas fa-paper-plane mr-2"></i> Submit Proposal
            </button>
          </div>
        ) : selectedProposal ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex justify-end p-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Proposal
              </button>
            </div>
            <Carousel
              showThumbs={true}
              infiniteLoop
              className="mb-6"
              showStatus={false}
            >
              {selectedProposal.images.map((image, idx) => (
                <div key={idx} className="h-96">
                  <img
                    src={image}
                    alt={`Proposal Image ${idx + 1}`}
                    className="object-contain h-full"
                  />
                </div>
              ))}
            </Carousel>
            <div className="p-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedProposal.proposalDetails,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a proposal or create a new one
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtraProposal;
