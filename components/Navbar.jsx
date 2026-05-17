'use client'

import React, { useState, useEffect } from 'react'
import { IoSunny } from "react-icons/io5";
import { FaUser, FaMoon } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { applyThemeToDocument } from '@/utils/theme';
import { useGlobalContext } from '@/context/GlobalContext';
import {signOut} from 'next-auth/react'
import ButtonLoading from './ButtonLoading';

function Navbar() {
    const [showMenu, setShowMenu]= useState(false)
    const { darkMode, setDarkMode } = useGlobalContext()

    useEffect(() => {
        const handleClickOutside = (event) => {
          // only close menu when clicking outside the dropdown container
          if (!event.target.closest('.user-menu')) {
            setShowMenu(false);
          }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const pathName = usePathname()
  const hideOnPath = ['/login', '/signup','/register']

    const {data: session, status} = useSession()

    if(hideOnPath.includes(pathName)){
        return null
    }
  return (
    <div className={`${darkMode ? 'bg-slate-900 text-zinc-50' : 'bg-zinc-50 text-slate-950'}  w-full flex shadow-md shadow-slate-900  justify-between items-center p-4 md:p-8 md:px-12`}>
        <div>
            <Link href={'/'} className='text-lg md:text-3xl font-bold text-indigo-500'>
                TaskMaster
            </Link>
            <p className={`${darkMode ? 'text-zinc-300' : 'text-slate-900'} text-xs md:text-sm`}>Your productivity companion</p>
        </div>
        <div className='flex gap-4'>
            <button
                type="button"
                onClick={() => {
                    const isDark = document.documentElement.classList.contains('dark');
        const nextMode = isDark ? 'light' : 'dark';

                    setDarkMode(nextMode === 'dark');


                    window.localStorage.setItem('theme', nextMode);
                    applyThemeToDocument(nextMode);
                }}
                className={`${darkMode ? "bg-slate-700" : "bg-zinc-500"} duration-150 ease-in-out w-8 h-10 rounded-2xl flex justify-center items-center cursor-pointer`}
            >
                { darkMode ? (
                    <IoSunny size={20} className='text-slate-200' />
                ) : (
                    <FaMoon size={20} className='text-zinc-50' />
                )}
            </button>
            {
                status === 'loading' ? (
                    <div className="flex items-center justify-center bg-transparent">
                  {/* Loading animation*/}
                  <div className={`${darkMode ? 'border-zinc-50' : 'border-slate-900'} h-4 w-4 animate-spin rounded-full border-2 border-solid border-t-transparent`}></div>
                </div>
                )
            :(
            
                session ? (
                <div className='relative user-menu'>
                <button onClick={()=> setShowMenu(k => !k)} className='bg-indigo-500 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'>
                    <FaUser size={25} className='text-slate-200'/>
                </button>
                {
                        <div className={`${showMenu ? 'scale-x-100 block' : 'scale-x-0'} duration-150 ease-in-out z-100 origin-right absolute top-full items-start flex flex-col rounded-sm 
                        text-sm right-0 shadow-lg md:-right-3  py-1 ${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-50 text-slate-900'} w-40 md:w-48`}>
                            <Link href={'/'} onClick={()=> setShowMenu(false)} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 w-full cursor-pointer text-left p-2 px-4 md:p-3`}>
                                Home
                            </Link>
                            <Link href={`/profile/user/${session?.user?.id}`} onClick={()=> setShowMenu(false)} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 w-full cursor-pointer  text-left p-2 px-4 md:p-3`}>Profile</Link>
                            <Link href={`/profile/user/${session?.user?.id}/settings`} onClick={()=> setShowMenu(false)} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 w-full cursor-pointer text-left p-2 px-4 md:p-3`}>
                                settings
                            </Link>
                             <Link href={`/profile/user/${session?.user?.id}/notifications`} onClick={()=> setShowMenu(false)} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 w-full cursor-pointer text-left p-2 px-4 md:p-3`}>
                                Notifications
                            </Link>
                            {session ? (
                                <button onClick={()=> {setShowMenu(false); signOut()}} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 p-2 px-4 w-full cursor-pointer  text-left md:p-3`}>
                                    Logout
                                    </button>
                                ) : (
                                    <Link href={'/login'} onClick={()=> setShowMenu(false)} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} outline-0 p-2 px-4 w-full cursor-pointer  text-left md:p-3`}>
                                        Login
                                    </Link>
                                )
                            }
                        </div>
                    
                }
            </div>) :(<Link href={'/login'} className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-zinc-50' : 'bg-zinc-300 hover:bg-zinc-400 text-slate-900'} px-4 py-1 h-fit rounded-lg text-sm outline-0 cursor-pointer`}>Login or Signup</Link>)
            )}
        </div>
      
    </div>
  )
}

export default Navbar
