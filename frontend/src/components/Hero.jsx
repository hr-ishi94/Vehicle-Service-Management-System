import React, { useState } from 'react'
import { hero_img } from '../utils/constants'
import AddVehicleModal from './AddVehicleModal';

const Hero = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
  return (
    <main className='bg-zinc-700 h-full flex max-md:flex-col max-md:justify-around max-md:py-20 items-center justify-between px-20 ' id='home'>
        
        <div className='md:w-2/3'>
            <img src={hero_img} alt="hero" className='rounded-full' />
        </div>
        <div className='max-md:text-center'>
            <h1 className='text-3xl font-bold text-white'>
                Experience the best Vehicle Services in Bangalore
            </h1>
            <button className='bg-zinc-900 text-amber-400 px-2 py-2 text-lg rounded-lg my-2 cursor-pointer' onClick={toggleModal}>

            Add Vehicle
            </button>

            <AddVehicleModal isOpen={isOpen} toggleModal={toggleModal}/>
        </div>
    </main>
  )
}

export default Hero