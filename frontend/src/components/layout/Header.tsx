import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className='bg-white border-b border-gray-200 h-20 flex items-center px-8 shadow-sm'>
      <div className='flex items-center gap-4'>
        {/* AER logo from the AER site (uses favicon image) */}
        <img
          src='https://apps.public.aer.ca/rmt/favicon.ico'
          alt='AER logo'
          className='h-10 w-10 rounded-sm object-cover'
        />
        <div className='h-8 w-px bg-gray-300 mx-2'></div>
        <h1 className='text-xl font-semibold text-gray-800 tracking-tight'>
          To-Do Application
        </h1>
      </div>
    </header>
  )
}
