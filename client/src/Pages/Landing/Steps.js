import React from 'react'

function Features() {
  return (
    <div className='w-full'>
      <section class="relative overflow-hidden dark:bg-gray-900">
        <div class="mt-2 md:mt-0 py-12 pb-6 sm:py-16 lg:pb-24 overflow-hidden">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
            <h2 className='text-4xl font-light text-rose-950 text-center capitalize'>how <span className='font-bold italicFont'> marriage experts</span> work</h2>
            <h2 className='text-md max-w-2xl mx-auto mt-2 font-light text-rose-950 text-justify md:text-center capitalize'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet asperiores similique, voluptates debitis, id autem nostrum doloremque accusantium sed expedita</h2>
            <div class="relative mt-12 lg:mt-20">
              <div class="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                <svg class="w-full" xmlns="http://www.w3.org/2000/svg" width="875" height="48" viewBox="0 0 875 48"
                  fill="none">
                  <path
                    d="M2 29C20.2154 33.6961 38.9915 35.1324 57.6111 37.5555C80.2065 40.496 102.791 43.3231 125.556 44.5555C163.184 46.5927 201.26 45 238.944 45C312.75 45 385.368 30.7371 458.278 20.6666C495.231 15.5627 532.399 11.6429 569.278 6.11109C589.515 3.07551 609.767 2.09927 630.222 1.99998C655.606 1.87676 681.208 1.11809 706.556 2.44442C739.552 4.17096 772.539 6.75565 805.222 11.5C828 14.8064 850.34 20.2233 873 24"
                    stroke="#D4D4D8" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 12" />
                </svg>
              </div>
              <div
                class="relative grid grid-cols-1 text-center gap-y-8 sm:gap-y-10 md:gap-y-12 md:grid-cols-3 gap-x-12">

                <div className='flex flex-col items-center justify-center'>
                  <div
                    class="flex items-center justify-center">
                    <span class="text-xl font-semibold text-rose-950"><i class="fa-solid fa-user-plus text-[50px]"></i></span>
                  </div>
                  <h3
                    class="mt-4 sm:mt-6 text-2xl font-semibold text-rose-950  md:mt-10">
                    Create your Profile
                  </h3>
                  <p class="mt-2 text-gray-600 max-w-xs text-center">
                    Register with your email or using sign up with goolgle
                  </p>
                </div>

                <div className='flex flex-col items-center justify-center'>
                  <div
                    class="flex items-center justify-center">
                    <span class="text-xl font-semibold text-rose-950"><i class="fa-solid fa-heart-circle-bolt text-[50px]"></i></span>
                  </div>
                  <h3
                    class="mt-4 sm:mt-6 text-2xl font-semibold text-rose-950  md:mt-10">
                    Find your Match
                  </h3>
                  <p class="mt-2 text-gray-600 max-w-xs text-center">
                    Register with your email or using sign up with goolgle
                  </p>
                </div>

                <div className='flex flex-col items-center justify-center'>
                  <div
                    class="flex items-center justify-center">
                    <span class="text-xl font-semibold text-rose-950"><i class="fa-solid fa-people text-[50px]"></i></span>
                  </div>
                  <h3
                    class="mt-4 sm:mt-6 text-2xl font-semibold text-rose-950  md:mt-10">
                    Get Married
                  </h3>
                  <p class="mt-2 text-gray-600 max-w-xs text-center">
                    Register with your email or using sign up with goolgle
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features