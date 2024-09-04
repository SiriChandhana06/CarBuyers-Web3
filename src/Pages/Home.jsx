import React from 'react'
import Navbar from '../Components/Navbar'
import CarForm from '../Components/CarForm'
import CarCard from './CarCard'

const Home = () => {
  return (
    <div className='overflow-x-hidden'>
      <div>
        <Navbar/>
      </div>
      <div
      className="bg-cover bg-center hidden md:block"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/e1Wd-EdsJY_waQAq8l-u0ilG9f9lZC97d-cBhwja8vc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jbGFzc2ljLWNh/ci13aXRoLXN1bnNl/dC1iYWNrZ3JvdW5k/LXJldHJvLXN0eWxl/LXRvbmVkLWltYWdl/XzgzMzEwNC0yOTM3/NC5qcGc_c2l6ZT02/MjYmZXh0PWpwZw')" }}
    >
      <div className='flex justify-between mx-20 py-10'>
      <div>
            <CarCard/>
        </div>
        <div className=''>
            <CarForm/>
        </div>
      </div>
      </div>
      <div
      className="bg-cover bg-center md:hidden block"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/e1Wd-EdsJY_waQAq8l-u0ilG9f9lZC97d-cBhwja8vc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jbGFzc2ljLWNh/ci13aXRoLXN1bnNl/dC1iYWNrZ3JvdW5k/LXJldHJvLXN0eWxl/LXRvbmVkLWltYWdl/XzgzMzEwNC0yOTM3/NC5qcGc_c2l6ZT02/MjYmZXh0PWpwZw')" }}
    >
      <div className='mx-5 py-10'>
      <div className=''>
            <CarForm/>
        </div>
      <div className='py-20 w-[400px]'>
            <CarCard/>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home
