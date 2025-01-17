import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/data';

const ProposalDetails = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const { authURL } = useAuth();
    const [proposal, setProposal] = useState(null);
    const [agentCode, setAgentCode] = useState('');
    const [currentProfileImage, setCurrentProfileImage] = useState(0);
    const [currentIdImage, setCurrentIdImage] = useState(0);

    useEffect(() => {
        fetchProposalDetails();
    }, []);

    const fetchProposalDetails = async () => {
        try {
            const response = await fetch(`${authURL}/get-proposal`, {
                headers: {
                    'x-api-key': 'Imran@ME',
                },
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            const selectedProposal = data.proposals.find(p => p.code === code);
            setProposal(selectedProposal);
        } catch (error) {
            console.error('Failed to fetch proposal details:', error);
            toast.error('Failed to fetch proposal details');
        }
    };

    const handleStatusChange = async (code, event) => {
        const newStatus = event.target.value;
        try {
            const response = await fetch(`${authURL}/update-proposal?code=${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'Imran@ME',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
        }
    };

    const updateProposal = async (code) => {
        if (!proposal || !agentCode) {
            toast.error('Proposal or Agent Code is missing');
            return;
        }

        try {
            await Promise.all([
                fetch(`${authURL}/update-proposal?code=${code}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'Imran@ME',
                    },
                    body: JSON.stringify({
                        agentAssigned: { username: agentCode },
                    }),
                }),
                fetch(`${authURL}/update-agents?username=${agentCode}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'Imran@ME',
                    },
                    body: JSON.stringify({
                        registeredProposals: { code: proposal.code },
                    }),
                })
            ]);
            
            toast.success('Proposal and agent details updated successfully');
            navigate('/dashboard/proposals');
        } catch (error) {
            console.error('Failed to update:', error);
            toast.error('Failed to update proposal and agent details');
        }
    };

    const ImageGallery = ({ images, currentIndex, setCurrentIndex, aspectRatio = "square" }) => {
        if (!images || images.length === 0) return (
            <div className="text-gray-500 text-center py-8">No images available</div>
        );

        return (
            <div className="space-y-4">
                <div className={`relative ${aspectRatio === "square" ? "aspect-square" : "aspect-video"}`}>
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
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

    if (!proposal) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-950"></div>
        </div>
    );

    // Safely access arrays
    const profileImages = proposal.personalInfo?.image || [];
    const idImages = [
        proposal.personalInfo?.cnicFront,
        proposal.personalInfo?.cnicBack
    ].filter(Boolean);

    const DataRow = ({ label, value }) => (
        <div className="py-2">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="ml-2 text-gray-600">{value || 'N/A'}</span>
        </div>
    );

    const SectionCard = ({ title, children }) => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-rose-950 border-b pb-2">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-rose-950">Proposal Details</h2>
                        <div className="flex gap-4">
                            <select
                                value={proposal.status || 'active'}
                                onChange={(e) => handleStatusChange(proposal.code, e)}
                                className="px-4 py-2 border rounded-md shadow-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="inProgress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <button
                                onClick={() => navigate('/dashboard/proposals')}
                                className="px-6 py-2 bg-rose-950 text-white rounded-md hover:bg-rose-900 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Agent:</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={agentCode}
                                onChange={(e) => setAgentCode(e.target.value)}
                                placeholder="Enter Agent Code - ABC123..."
                                className="flex-1 px-4 py-2 border rounded-md shadow-sm"
                            />
                            <button
                                onClick={() => updateProposal(proposal.code)}
                                className="px-6 py-2 bg-rose-950 text-white rounded-md hover:bg-rose-900 transition-colors"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Profile Images */}
                    <SectionCard title="Profile Images">
                        <ImageGallery
                            images={profileImages}
                            currentIndex={currentProfileImage}
                            setCurrentIndex={setCurrentProfileImage}
                            aspectRatio="square"
                        />
                    </SectionCard>

                    {/* ID Card Images */}
                    <SectionCard title="ID Cards">
                        <ImageGallery
                            images={idImages}
                            currentIndex={currentIdImage}
                            setCurrentIndex={setCurrentIdImage}
                            aspectRatio="video"
                        />
                    </SectionCard>
                </div>

                {/* Rest of the component remains the same... */}
                {/* Personal Information */}
                <SectionCard title="Personal Information">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DataRow label="Name" value={proposal.personalInfo?.name} />
                        <DataRow label="Age" value={proposal.personalInfo?.age} />
                        <DataRow label="Height" value={proposal.personalInfo?.height} />
                        <DataRow label="Gender" value={proposal.personalInfo?.gender} />
                        <DataRow label="Marital Status" value={proposal.personalInfo?.maritalStatus} />
                        <DataRow label="Date of Birth" value={proposal.personalInfo?.dob} />
                    </div>
                </SectionCard>

                {/* Educational & Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionCard title="Educational Details">
                        <DataRow label="Qualification" value={proposal.educationalDetails?.qualification} />
                    </SectionCard>

                    <SectionCard title="Professional Details">
                        <div className="grid gap-4">
                            <DataRow label="Profession" value={proposal.professionalDetails?.profession} />
                            <DataRow label="Designation" value={proposal.professionalDetails?.designation} />
                            <DataRow label="Company" value={proposal.professionalDetails?.company} />
                            <DataRow label="Department" value={proposal.professionalDetails?.dept} />
                            <DataRow label="Monthly Income" value={proposal.professionalDetails?.monthlyIncome} />
                        </div>
                    </SectionCard>
                </div>

                {/* Religion Details */}
                <SectionCard title="Religion Details">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DataRow label="Religion" value={proposal.religion?.religion} />
                        <DataRow label="Sect" value={proposal.religion?.sect} />
                        <DataRow label="Caste" value={proposal.religion?.caste} />
                        <DataRow label="Sub Caste" value={proposal.religion?.subCaste} />
                        <DataRow label="Mother Tongue" value={proposal.residenceDetails?.motherTongue} />
                    </div>
                </SectionCard>

                {/* Residence Details */}
                <SectionCard title="Residence Details">
                    <div className="grid grid-cols-1 gap-4">
                        <DataRow label="Permanent Address" value={proposal.residenceDetails?.address} />
                        <DataRow label="Temporary Address" value={proposal.residenceDetails?.temporaryAddress} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DataRow label="House Status" value={proposal.residenceDetails?.houseType} />
                            <DataRow label="House Size" value={proposal.residenceDetails?.houseSize} />
                            <DataRow label="Contact" value={proposal.residenceDetails?.cell} />
                            <DataRow label="Nationality" value={proposal.residenceDetails?.nationality} />
                        </div>
                    </div>
                </SectionCard>

                {/* Family Details */}
                <SectionCard title="Family Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <DataRow label="Father's Name" value={proposal.familyDetails?.father} />
                            <DataRow label="Father's Occupation" value={proposal.familyDetails?.fatherOcc} />
                            <DataRow label="Mother's Name" value={proposal.familyDetails?.mother} />
                            <DataRow label="Mother's Occupation" value={proposal.familyDetails?.motherOcc} />
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

                {/* Partner Requirements */}
                <SectionCard title="Partner Requirements">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DataRow label="Marital Status" value={proposal.requirements?.maritalStatus} />
                        <DataRow label="Age" value={proposal.requirements?.age} />
                        <DataRow label="Height" value={proposal.requirements?.height} />
                        <DataRow label="Religion" value={proposal.requirements?.religion} />
                        <DataRow label="Sect" value={proposal.requirements?.sect} />
                        <DataRow label="Caste" value={proposal.requirements?.caste} />
                        <DataRow label="City" value={proposal.requirements?.city} />
                        <DataRow label="Nationality" value={proposal.requirements?.nationality} />
                        <DataRow label="Qualification" value={proposal.requirements?.qualification} />
                        <DataRow label="Occupation" value={proposal.requirements?.occupation} />
                    </div>
                    {proposal.requirements?.otherReq && (
                        <div className="mt-4">
                            <span className="font-semibold">Other Requirements:</span>
                            <p className="mt-2 text-gray-600">{proposal.requirements?.otherReq}</p>
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
};

export default ProposalDetails;