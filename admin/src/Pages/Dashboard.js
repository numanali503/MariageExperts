import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/data";

function Dashboard() {
  const { authURL } = useAuth();
  const [agents, setAgents] = useState([]);
  const [basicAgents, setBasicAgents] = useState([]);
  const [premiumAgents, setPremiumAgents] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [completedProposals, setCompletedProposals] = useState([]);
  const [inActive, setInActive] = useState([]);


  const fetchAgents = async () => {
    try {
      const response = await fetch(`${authURL}/get-all-agents`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const basicAgents = data.filter(agent => agent.agentType === "basic");
      const premiumAgents = data.filter(agent => agent.agentType === "standard");
      setAgents(data.length);
      setBasicAgents(basicAgents.length);
      setPremiumAgents(premiumAgents.length);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await fetch(`${authURL}/get-proposals`, {
        headers: {
          "x-api-key": "Imran@ME",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const apiData = await response.json();
      const data = apiData.proposals;
      const basicAgents = data.filter(agent => agent.status === "active");
      const premiumAgents = data.filter(agent => agent.status === "completed");
      setProposals(data.length);
      setCompletedProposals(basicAgents.length);
      setInActive(premiumAgents.length);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchProposals();
  }, []);

  return (
    <div className='border-2 border-rose-200 p-12 bg-white'>
      <h1 className='text-6xl font-bold text-rose-900'>Dashboard</h1>

      <div className='flex items-center justify-center space-x-4 mt-8'>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Proposals</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{proposals}+</h1>
            <i class="fa-duotone fa-light fa-rings-wedding text-rose-900 text-[4rem]"></i>
          </div>
        </div>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Completed Proposals</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{completedProposals}+</h1>
            <i class="fa-duotone fa-regular fa-eye text-rose-900 text-[4rem]"></i>
          </div>
        </div>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Pending Proposals</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{inActive}+</h1>
            <i class="fa-duotone fa-thin fa-people text-rose-900 text-[4rem]"></i>
          </div>
        </div>

      </div>

      <div className='flex items-center justify-center space-x-4 mt-4'>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Agents</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{agents}+</h1>
            <i class="fa-duotone fa-light fa-users text-rose-900 text-[4rem]"></i>
          </div>
        </div>


        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Basic Agents</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{basicAgents}+</h1>
            <i class="fa-duotone fa-light fa-users text-rose-900 text-[4rem]"></i>
          </div>
        </div>


        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Premium Agents</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>{premiumAgents}+</h1>
            <i class="fa-duotone fa-light fa-users text-rose-900 text-[4rem]"></i>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
