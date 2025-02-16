import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Table from '../components/Table';

const Home = () => {
 

  return (
    <div className='w-screen h-screen overflow-auto'>
      <NavBar />
      <Hero />
      <div className='bg-zinc-900 max-md:w-auto '>
        <Table/>
      </div>
    </div>
  );
}

export default Home;