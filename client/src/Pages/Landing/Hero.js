import React from 'react';
import bgLarge from '../../assets/NUB-MetrimonyBG.png';
import bgMobile from '../../assets/bg-mobile-view.png';
import Snoweffect from '../../components/SnowEffect/SnowEffect';

function Hero() {
  return (
    <div className="relative">
      {/* Snoweffect Component for Snowfall */}
      <Snoweffect />

      {/* Desktop and Tablet View */}
      <div className="hidden md:block h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgLarge})` }}>
        <div className='max-w-[85rem] mx-auto px-4 flex flex-col items-start justify-center h-screen'>
          <h1 className='text-4xl md:text-6xl text-rose-950 font-light italicFont'>Pakistan's</h1>
          <h1 className='text-6xl md:text-8xl font-bold text-rose-950 uppercase'>Matrimony</h1>
          <h1 className='text-2xl md:text-4xl font-light text-rose-950 uppercase tracking-wider'>Find your life partner</h1>
          <h1 className='text-base md:text-xl font-light text-rose-950 max-w-2xl my-4 italic'>
            "When a person gets married he has completed half of his deen, so let him fear Allah with
            regard to the other half"<br />
            <span className='not-italic'>- (Shu'ab al-Eemaan 5486)</span>
          </h1>

          <button className='py-2 px-4 rounded-full bg-rose-950 text-white hover:bg-rose-900 transition-colors duration-300'>
            Create your Profile Now
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div 
        className="block md:hidden h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgMobile})` }}
      >
        <div className='absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-6 rounded-t-3xl shadow-2xl'>
          <div className='text-center'>
            <h1 className='text-2xl text-rose-950 font-light'>Pakistan's</h1>
            <h1 className='text-4xl font-bold text-rose-950 uppercase mb-2'>Matrimony</h1>
            <h1 className='text-xl font-light text-rose-950 uppercase tracking-wider mb-4'>Find your life partner</h1>
            
            <p className='text-sm text-rose-950 italic mb-4'>
              "When a person gets married he has completed half of his deen, so let him fear Allah with
              regard to the other half"<br />
              <span className='not-italic'>- (Shu'ab al-Eemaan 5486)</span>
            </p>

            <button className='w-full py-3 rounded-full bg-rose-950 text-white hover:bg-rose-900 transition-colors duration-300'>
              Create your Profile Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;