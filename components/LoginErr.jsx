'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

function LoginErr({darkMode, error, removeLoginErr , loginErr}) {
    const router = useRouter()
  return (
    <div className={`bg-black/20 fixed top-0 left-0 w-screen py-6 px-6 h-screen flex justify-center`}>
        <div className={`${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-50 text-slate-900'} ${loginErr ? 'translate-y-[0]' : '-translate-y-[500px]'} duration-150 ease-in-out origin-top w-80 h-fit p-4 md:p-6 rounded-lg flex flex-col items-center gap-4`}>
          <p className="text-lg font-bold">Error</p>
          <p className="text-sm">{error}</p>
          <div className='flex w-full justify-between items-center'>
            <button
                onClick={removeLoginErr}
                className="bg-red-500 hover:bg-red-600 text-zinc-50 md:py-2 py-1 px-4 rounded outline-0 cursor-pointer"
            >
                Close
            </button>
          <button
              onClick={() => {
                removeLoginErr();
                router.push('/login');
              }}
              className='bg-indigo-500 hover:bg-indigo-600 text-zinc-50 md:py-2 py-1 px-4 rounded outline-0 cursor-pointer'
            >
            Login
          </button>
          </div>
        </div>
    </div>
  )
}

export default LoginErr
