import React from 'react'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/HeroImage1.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
            
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-40'>The Future of Ticketing Is Here.</p>
            <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Want Your Ticket, Get Your VI-CKET!</h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>Cheer your team from the stands — book your matchday ticket in a tap.</p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 mt-8">
    
                 <button onClick={()=>{navigate('/matches'); scrollTo(0,0)}} className="w-40 py-3 active:scale-95 transition text-sm text-white rounded-full bg-indigo-500 cursor-pointer"><p className="mb-0.5">Upcoming Matches</p></button>

    
            </div>
        </div>
    )
}

export default Hero