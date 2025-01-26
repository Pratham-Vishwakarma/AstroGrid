"use client";
import React from 'react'
import { GalleryVertical, LayoutTemplate, Settings2, RefreshCcw, CircleHelp, Columns4 } from 'lucide-react';

function SideBar({ setCalender, setDay }) {
  return (
    <div className='flex items-end'>
        <div className="w-11 lg:w-12 h-[85vh] border-r-[1px] flex items-center border-gray-600 bg-gradient-to-b hover:bg-gradient-to-br from-transparent to-zinc-950 hover:to-80% absolute z-10 overflow-hidden bg-opacity-25 hover:bg-gray-900 hover:bg-opacity-95 hover:w-44 transition-all duration-200 ease-in-out hover:delay-1000">
            <div className="absolute top-0 left-[5%] h-[1px] bg-gray-600 w-[90%] transition-all duration-300 ease-in-out"></div>    
            <div className='flex flex-col justify-center h-[95%] gap-[12%] ml-[1vw] lg:ml-[0.8vw] xl:ml-[0.6vw] sm:ml-[1.5vw]'>
                <div className='flex flex-row items-center gap-4 cursor-pointer' onClick={setDay}>
                    <GalleryVertical className="w-6 h-6 text-gray-500 hover:text-gray-400" />
                    <p className='whitespace-nowrap text-gray-400'>Day</p>
                </div>
                <div className='flex flex-row items-center gap-4 cursor-pointer'>
                    <Columns4 className='w-6 h-6 text-gray-500 hover:text-gray-400' />
                    <p className='whitespace-nowrap text-gray-400 hover:text-gray-400'>Week</p>
                </div>
                <div className='flex flex-row items-center gap-4 cursor-pointer' onClick={setCalender}>
                    <LayoutTemplate className='w-6 h-6 text-gray-500 hover:text-gray-400' />
                    <p className='whitespace-nowrap text-gray-400'>Month</p>
                </div>
                <div className='flex flex-row items-center gap-4 cursor-pointer' onClick={() => window.location.reload()}>
                    <RefreshCcw className='w-6 h-6 text-gray-500 hover:text-gray-400' />
                    <p className='whitespace-nowrap text-gray-400'>Refresh</p>
                </div>
                <div className='flex flex-row items-center gap-4 cursor-pointer'>
                    <Settings2 className='w-6 h-6 text-gray-500 hover:text-gray-400' />
                    <p className='whitespace-nowrap text-gray-400'>Settings</p>
                </div>
                <div className='flex flex-row items-center gap-4 cursor-pointer'>
                    <CircleHelp className='w-6 h-6 text-gray-500 hover:text-gray-400' />
                    <p className='whitespace-nowrap text-gray-400'>Help & Support</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideBar