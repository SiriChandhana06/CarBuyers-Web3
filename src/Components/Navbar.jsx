import React from 'react'
import Connect from './Connect'

const Navbar = () => {
  return (
    <div className='bg-gray-500 flex justify-between'>
      <div>
        <h1 className='text-xl md:text-3xl font-semibold text-white p-4'>Car Buyers</h1>
      </div>
      <div className='py-2 px-4'>
        <Connect/>
      </div>
    </div>
  )
}

export default Navbar
