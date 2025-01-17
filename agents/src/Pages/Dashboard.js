import React from 'react'

function Dashboard() {
  return (
    <div className='border-2 border-slate-200 p-12 bg-white'>
      <h1 className='text-6xl font-bold text-rose-900'>Dashboard</h1>

      <div className='flex items-center justify-center space-x-4 mt-8'>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Standard Proposals</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>11+</h1>
            <i class="fa-duotone fa-light fa-rings-wedding text-rose-900 text-[4rem]"></i>
          </div>
        </div>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Hidden Request</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>9+</h1>
            <i class="fa-duotone fa-regular fa-eye-slash text-rose-900 text-[4rem]"></i>
          </div>
        </div>

        <div className='bg-rose-500 h-full w-full rounded p-8'>
          <h1 className='text-xl font-bold text-rose-900'>Total Proposals</h1>
          <div className='mt-4 flex items-center justify-between w-full'>
            <h1 className='text-6xl font-black text-rose-900'>980</h1>
            <i class="fa-duotone fa-thin fa-people text-rose-900 text-[4rem]"></i>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
