import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import Steps from './Steps';
import Stats from './Stats';
import AboutUs from './AboutUs';
import WhyChooseUs from './WhyChooseUs';
import FilterProposals from './FilterProposals';
import Testimonial from './Testimonial';

gsap.registerPlugin(ScrollTrigger);

function HomeContainer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = containerRef.current.querySelectorAll('.animate-fade');
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%', // Start animation when the element is in the viewport
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <div className="w-full space-y-4 bg-pink-50" ref={containerRef}>
      <Hero></Hero>
      <div className="animate-fade">
        <Steps></Steps>
      </div>
      <div className="animate-fade">
        <Stats></Stats>
      </div>
      <div className="animate-fade">
        <AboutUs></AboutUs>
      </div>
      <div className="animate-fade">
        <FilterProposals></FilterProposals>
      </div>
      <div className="animate-fade">
        <WhyChooseUs></WhyChooseUs>
      </div>
      <div className="animate-fade">
        <Testimonial></Testimonial>
      </div>
      <div id="botpress-webchat"></div>
    </div>
  );
}

export default HomeContainer;
