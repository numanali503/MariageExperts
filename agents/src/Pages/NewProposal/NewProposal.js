import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Form = () => {
  const { authURL } = useAuth();
  const code = localStorage.getItem("agentCode");
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      age: "",
      email: "",
      image: [],
      maritalStatus: "",
      cnicFront: "",
      cnicBack: "",
      dob: "",
      height: "",
      gender: "",
    },
    educationalDetails: {
      qualification: "",
      institute: "",
      highestDegree: "",
    },
    professionalDetails: {
      profession: "",
      designation: "",
      company: "",
      dept: "",
      monthlyIncome: "",
    },
    agentAssigned: [
      { agentCode: code }, // agentCode fetched from localStorage
    ],
    religion: {
      religion: "",
      sect: "",
      caste: "",
      subCaste: "",
    },
    residenceDetails: {
      address: "",
      temporaryAddress: "",
      cell: "",
      houseType: "",
      houseSize: "",
      nationality: "",
      motherTongue: "",
    },
    familyDetails: {
      father: "",
      fatherOcc: "",
      mother: "",
      motherOcc: "",
      brothers: [],
      sisters: [],
    },
    requirements: {
      age: "",
      height: "",
      maritalStatus: "",
      city: "",
      occupation: "",
      nationality: "",
      caste: "",
      sect: "",
      religion: "",
      qualification: "",
      otherReq: "",
    },
  });

  const [imagePreviewFront, setImagePreviewFront] = useState(null);
  const [imagePreviewBack, setImagePreviewBack] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleDobChange = (event) => {
    const dob = event.target.value; // Assume DOB is in YYYY-MM-DD format
    const age = calculateAge(dob);

    setFormData((prevState) => ({
      ...prevState,
      personalInfo: {
        ...prevState.personalInfo,
        dob,
        age, // Set the calculated age
      },
    }));
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleCNICFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewFront(reader.result); // Preview for the front image
        handleInputChange("personalInfo", "cnicFront", reader.result); // Store base64 in form data
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCNICBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewBack(reader.result); // Preview for the back image
        handleInputChange("personalInfo", "cnicBack", reader.result); // Store base64 in form data
      };
      reader.readAsDataURL(file);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFamilyCountChange = (field, count) => {
    setFormData((prev) => ({
      ...prev,
      familyDetails: {
        ...prev.familyDetails,
        [field]: Array.from({ length: Number(count) || 0 }, () => ({
          name: "",
          status: "",
        })),
      },
    }));
  };

  const handleFamilyMemberChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.familyDetails[field]];
      updatedMembers[index][key] = value;
      return {
        ...prev,
        familyDetails: {
          ...prev.familyDetails,
          [field]: updatedMembers,
        },
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            // Ensure all files are processed before updating state
            setFormData((prevFormData) => ({
              ...prevFormData,
              personalInfo: {
                ...prevFormData.personalInfo,
                image: [...prevFormData.personalInfo.image, ...newImages],
              },
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const [agentLimit, setAgentLimit] = useState("");
  const [agentType, setAgentType] = useState("");
  const [proposalLimit, setProposalLimit] = useState("");

  const fetchAgentData = async () => {
    try {
      const response = await fetch(`${authURL}/get-agent?agentCode=${code}`, {
        method: "GET",
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) throw new Error("Error fetching agent data");
      const data = await response.json();
      setAgentLimit(data.registeredProposals);
      setAgentType(data.agentType);
      setProposalLimit(data.proposalLimit);
      console.log("Agent Data:", data);
    } catch (error) {
      alert("Error submitting proposal: " + error.message);
    }
  };
  useEffect(() => {
    fetchAgentData();
  }, []);

  const handleSubmit = async (e) => {
    if (agentType === "basic" && agentLimit.length >= proposalLimit) {
      return alert(
        "You already have 3 proposals assigned. You can't submit more proposals."
      );
    }

    if (agentType === "standard" && agentLimit.length >= proposalLimit) {
      return alert(
        "Your Proposal Limit Exceeds. You can't submit more proposals."
      );
    }

    if (formData.personalInfo.image.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    e.preventDefault();
    setUploading(true);
    try {
      const response = await fetch(`${authURL}/post-proposal-panel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Submission failed");
      alert("Proposal submitted successfully!");
    } catch (error) {
      alert("Error submitting proposal: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      personalInfo: {
        ...prevFormData.personalInfo,
        image: prevFormData.personalInfo.image.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="container max-w-[85rem] mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Form Section */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 w-full">
                    Personal Information {formData.agentAssigned.agentCode}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.name}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "email",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.dob}
                      onChange={handleDobChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.maritalStatus}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "maritalStatus",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Status
                      </option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced1kids">
                        Divorced With 1 Kids
                      </option>
                      <option value="divorced3kids">
                        Divorced With +2 Kids
                      </option>
                      <option value="widowed1kids">Widowed With 1 Kids</option>
                      <option value="widowed3kids">Widowed With +2 Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.gender}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.personalInfo.height}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "height",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Educational & Professional Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Educational & Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.educationalDetails.qualification}
                      onChange={(e) =>
                        handleInputChange(
                          "educationalDetails",
                          "qualification",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Qualification
                      </option>
                      <option value="Secondary Education">
                        Secondary Education
                      </option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profession <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.professionalDetails.profession}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalDetails",
                          "profession",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Profession
                      </option>
                      <option value="Employee">Job Holder / Employee</option>
                      <option value="Buisness Person">Buisness Person</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recent / Highest Education
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.educationalDetails.highestDegree}
                      onChange={(e) =>
                        handleInputChange(
                          "educationalDetails",
                          "highestDegree",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institute / College / University
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.educationalDetails.institute}
                      onChange={(e) =>
                        handleInputChange(
                          "educationalDetails",
                          "institute",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.professionalDetails.designation}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalDetails",
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.professionalDetails.company}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalDetails",
                          "company",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.professionalDetails.dept}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalDetails",
                          "dept",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Income <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.professionalDetails.monthlyIncome}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalDetails",
                          "monthlyIncome",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Religion Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Religion Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.religion.religion}
                      onChange={(e) =>
                        handleInputChange(
                          "religion",
                          "religion",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Religion
                      </option>
                      <option value="Islam">Islam</option>
                      <option value="Christian">Christian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sect <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.religion.sect}
                      onChange={(e) =>
                        handleInputChange("religion", "sect", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caste <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.religion.caste}
                      onChange={(e) =>
                        handleInputChange("religion", "caste", e.target.value)
                      }
                    >
                      <option value="" disabled selected>
                        Select Caste
                      </option>
                      <option value="Sayyad">Sayyad</option>
                      <option value="Arain">Arain</option>
                      <option value="Jatt">Jatt</option>
                      <option value="Rajput">Rajput</option>
                      <option value="Awan">Awan</option>
                      <option value="Gujjar">Gujjar</option>
                      <option value="Dogar">Dogar</option>
                      <option value="Khokhar">Khokhar</option>
                      <option value="Butt">Butt</option>
                      <option value="Pathan">Pathan</option>
                      <option value="Malik">Malik</option>
                      <option value="Shaikh">Shaikh</option>
                      <option value="Ansari">Ansari</option>
                      <option value="Mughal">Mughal</option>
                      <option value="Rehmani">Rehmani</option>
                      <option value="Baigh">Baigh</option>
                      <option value="Qureshi">Qureshi</option>
                      <option value="Ghaffari">Ghaffari</option>
                      <option value="Bhatti">Bhatti</option>
                      <option value="Bhatti">Nai</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Caste
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.religion.subCaste}
                      onChange={(e) =>
                        handleInputChange(
                          "religion",
                          "subCaste",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother Tongue / Native Language
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.residenceDetails.motherTongue}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "motherTongue",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Language
                      </option>
                      <option value="Urdu">Urdu</option>
                      <option value="English">English</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Arabic ">Arabic </option>
                      <option value="Pashto">Pashto</option>
                      <option value="Saraiki">Saraiki</option>
                      <option value="Sindhi">Sindhi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Residence Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Residence Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permanent Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="3"
                      value={formData.residenceDetails.address}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "address",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="3"
                      value={formData.residenceDetails.temporaryAddress}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "temporaryAddress",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.residenceDetails.houseType}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "houseType",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Status
                      </option>
                      <option value="rented">Rented</option>
                      <option value="owned">Owned</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Marla/Kanal"
                      value={formData.residenceDetails.houseSize}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "houseSize",
                          e.target.value
                        )
                      }
                    ></input>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cell <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.residenceDetails.cell}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "cell",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.residenceDetails.nationality}
                      onChange={(e) =>
                        handleInputChange(
                          "residenceDetails",
                          "nationality",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Family Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.father}
                      onChange={(e) =>
                        handleInputChange(
                          "familyDetails",
                          "father",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Occupation Details
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.fatherOcc}
                      onChange={(e) =>
                        handleInputChange(
                          "familyDetails",
                          "fatherOcc",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Occupations
                      </option>
                      <option value="Employee">Job Holder / Employee</option>
                      <option value="Buisness Person">Buisness Person</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.mother}
                      onChange={(e) =>
                        handleInputChange(
                          "familyDetails",
                          "mother",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Occupation Details{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.motherOcc}
                      onChange={(e) =>
                        handleInputChange(
                          "familyDetails",
                          "motherOcc",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Occupations
                      </option>
                      <option value="Employee">Job Holder / Employee</option>
                      <option value="Buisness Person">Buisness Person</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="House Wife">House Wife</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Brothers
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.brothers.length}
                      onChange={(e) =>
                        handleFamilyCountChange("brothers", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Sisters
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.familyDetails.sisters.length}
                      onChange={(e) =>
                        handleFamilyCountChange("sisters", e.target.value)
                      }
                    />
                  </div>
                </div>

                {formData.familyDetails.brothers.map((brother, index) => (
                  <div
                    key={`brother-${index}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brother {index + 1} Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={brother.name}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "brothers",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brother {index + 1} Marital Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={brother.status}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "brothers",
                            index,
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brother {index + 1} Company
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={brother.company}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "brothers",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brother {index + 1} Designation
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={brother.designation}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "brothers",
                            index,
                            "designation",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

                {/* Render Sisters' Details */}
                {formData.familyDetails.sisters.map((sister, index) => (
                  <div
                    key={`sister-${index}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sister {index + 1} Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={sister.name}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "sisters",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sister {index + 1} Marital Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={sister.status}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "sisters",
                            index,
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sister {index + 1} Company
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={sister.company}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "sisters",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sister {index + 1} Designation
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={sister.designation}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            "sisters",
                            index,
                            "designation",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Partner Requirements */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Partner Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Marital Status
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.maritalStatus}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "maritalStatus",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Status
                      </option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced1kids">
                        Divorced With 1 Kids
                      </option>
                      <option value="divorced3kids">
                        Divorced With +2 Kids
                      </option>
                      <option value="widowed1kids">Widowed With 1 Kids</option>
                      <option value="widowed3kids">Widowed With +2 Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Caste <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.caste}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "caste",
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled selected>
                        Select Caste
                      </option>
                      <option value="Sayyad">Sayyad</option>
                      <option value="Arain">Arain</option>
                      <option value="Jatt">Jatt</option>
                      <option value="Rajput">Rajput</option>
                      <option value="Awan">Awan</option>
                      <option value="Gujjar">Gujjar</option>
                      <option value="Dogar">Dogar</option>
                      <option value="Khokhar">Khokhar</option>
                      <option value="Butt">Butt</option>
                      <option value="Pathan">Pathan</option>
                      <option value="Malik">Malik</option>
                      <option value="Shaikh">Shaikh</option>
                      <option value="Ansari">Ansari</option>
                      <option value="Mughal">Mughal</option>
                      <option value="Rehmani">Rehmani</option>
                      <option value="Baigh">Baigh</option>
                      <option value="Qureshi">Qureshi</option>
                      <option value="Ghaffari">Ghaffari</option>
                      <option value="Bhatti">Bhatti</option>
                      <option value="Bhatti">Nai</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Sect <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.sect}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "sect",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.city}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "city",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Country / Nationality
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.nationality}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "nationality",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Qualification
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.qualification}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "qualification",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Occupation / Profession{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.occupation}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "occupation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.age}
                      onChange={(e) =>
                        handleInputChange("requirements", "age", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Height
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.height}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "height",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Religion <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.requirements.religion}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "religion",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Requirements
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="3"
                      value={formData.requirements.otherReq}
                      onChange={(e) =>
                        handleInputChange(
                          "requirements",
                          "otherReq",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-950 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                  disabled={uploading}
                >
                  {uploading ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
          {/* Images Section */}
          <div className="md:w-1/3">
            <div className="space-y-2 flex flex-col items-center justify-center w-full">
              <div className="bg-white p-6 rounded-lg w-full shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Upload Photos
                </h2>
                <div className="space-y-4">
                  {formData.personalInfo.image.length > 0 ? (
                    <Slider
                      dots={true}
                      infinite={false}
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                    >
                      {formData.personalInfo.image.map((imageSrc, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageSrc}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg w-full shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Upload CNIC Front
                </h2>
                <div className="space-y-4">
                  {imagePreviewFront ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imagePreviewFront}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagePreviewFront(null);
                          handleInputChange("personalInfo", "cnicFront", "");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="front-dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="front-dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCNICFrontChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg w-full shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Upload CNIC Back
                </h2>
                <div className="space-y-4">
                  {imagePreviewBack ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imagePreviewBack}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagePreviewBack(null);
                          handleInputChange("personalInfo", "cnicBack", "");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="back-dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="back-dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCNICBackChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
