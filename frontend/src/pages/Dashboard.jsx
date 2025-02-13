import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'

const Dashboard = () => {
  return (
    <div className='w-screen h-screen max-sm:h-auto overflow-x-hidden '>
        <NavBar/>
        <SideBar/>
        

    </div>
  )
}

export default Dashboard