'use client'

import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react';
import { useGlobalContext } from '@/context/GlobalContext';
import { getTasks, getTaskHistory, restoreTaskFromHistory, deleteTaskFromHistory, clearTaskHistory } from '@/utils/taskManger';


import { MdDelete } from 'react-icons/md';
import { TbRestore } from "react-icons/tb";
import { FaListCheck } from "react-icons/fa6";
import Loading from '@/components/Loading';
import Link from 'next/link';

function ProfilePage() {
    const {data: session, status} = useSession()
    const { darkMode } = useGlobalContext()
    const tasks = getTasks() 

    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [tasksData, setTasksData] = useState(tasks)
    const [task, setTask] = useState(getTasks())
    const localTask = task.length
    const savedTask = tasksData.length
    const localCompleted = task.filter(t => t.isCompleted === true).length
    const localPending = task.filter(t => t.isCompleted === false).length
    const totalTask = localTask + savedTask
    const totalCompleted = localCompleted + tasksData.filter(t => t.status === 'completed').length

    const [deleteItemId, setDeleteItemId] = useState(null);
    const [clearHistoryConfirm, setClearHistoryConfirm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    console.log('tasksData', tasksData)
    useEffect(()=>{
        setTasksData(getTaskHistory())
    }, [refreshKey])
    
      if(status === 'loading'){
        return <Loading />
      }

      if(!session?.user){
        return (
          <div className={`${darkMode ? 'bg-slate-900 text-zinc-50' : 'bg-zinc-50 text-slate-900'} min-h-screen flex items-center justify-center`}>
            <div className='flex flex-col items-center gap-4'>
              <h1 className='text-2xl md:text-3xl font-bold'>Unauthorized</h1>
              <FaListCheck size={60} className={`${darkMode ? 'text-slate-600' : 'text-gray-600'}`}/>
              <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} text-center`}>You must be logged in to view your profile and saved task.</p>
              <div className='flex gap-4'>
                <Link href={'/login'} className={`${darkMode ? 'border-zinc-100 hover:bg-slate-700 hover:border-slate-700' : 'border-slate-900 hover:bg-zinc-300 hover:border-zinc-300'} origin-bottom duration-300 ease-in-out border px-4 py-2  rounded-lg outline-0 cursor-pointer`}>
                Login
              </Link>
              <Link href={'/'} className={`bg-indigo-500 hover:bg-indigo-600  duration-300 ease-in-out px-4 py-2  rounded-lg outline-0 cursor-pointer`}>
                Go Home
              </Link>
              </div>
            </div>
          </div>
        )
      }
      
            
  return (
    <div className={`${darkMode ? 'bg-slate-900 text-Zinc-50' : ' bg-zinc-50 text-slate-900'}  min-h-screen px-4 md:px-12 `}>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-zinc-100'} rounded-xl flex flex-col shadow-md md:px-12 md:py-8 px-4 py-4`}>
            <div className='py-2 flex md:gap-12 md:flex-row flex-col md:items-center'> 
                {/* user details */}
                <div className="flex items-center gap-6" >
                    <img src='/image/user' alt='profile picture' className={`${darkMode ? 'bg-slate-700' : 'bg-zinc-200'} md:w-30 md:h-30 w-24 h-24 rounded-full mb-4`}/>
                    <div className='text-left'>
                        <h2 className='text-lg md:text-2xl font-bold'>{session?.user?.username || 'John Doe'}</h2>
                        <p className='text-sm text-gray-500'>{session?.user?.email || 'example@gmail.com'}</p>
                        <p className='text-sm text-gray-500'>{session?.user?.phone || '123-456-7890'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-6 md:ml-10 ml-0'>
                    <div className='text-xs md:text-sm text-center'>
                        <p className='bg-indigo-400/50 text-indigo-50 px-3 shadow-sm rounded-md tracking-4 italic'>Following</p>
                        <p>100</p>
                    </div>
                    <div className='text-xs md:text-sm text-center'>
                        <p className='bg-red-400/50 px-3 rounded-md italic shadow-sm text-red-50'>Follower</p>
                        <p>100</p>
                    </div>
                </div>
            </div>


            <div className='flex items-center gap-8 flex-wrap text-xs italic md:text-sm'>
                    <p className={`${darkMode ? 'bg-slate-700' : 'bg-zinc-200'} min-w-fit px-4 md:px-6 py-1 rounded-md  shadow-md flex flex-col-reverse items-center`}>
                         Total task <span className='font-bold'>{totalTask || 0}</span></p>
                    <p className={`${darkMode ? 'bg-slate-700' : 'bg-zinc-200'} min-w-fit px-4 md:px-6 py-1 rounded-md  shadow-md flex flex-col-reverse items-center`}>
                        Task completed <span className='font-bold'>{totalCompleted || 0}</span></p>
                    <p className={`${darkMode ? 'bg-slate-700' : 'bg-zinc-200'} min-w-fit px-4 md:px-6 py-1 rounded-md  shadow-md flex flex-col-reverse items-center`}>
                        Task pending <span className='font-bold'>{localPending || 0}</span></p>
            </div>
        </div>

        {/* delete task from history */}
              {deleteConfirm && (
                <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center">
                  <div className={`${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-100 text-slate-900'} w-full h-fit max-w-md p-6 rounded-lg shadow-lg border ${darkMode ? 'border-slate-950' : 'border-zinc-300'}`}>
                    <h2 className="text-lg font-bold">Delete All task?</h2>
                    <p className={`${darkMode ? 'text-zinc-200' : 'text-slate-700'} text-sm mt-2`}>
                      All your tasks will be deleted , are you sure to continue.
                    </p>
                    <div className="flex gap-3 mt-6 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirm(false);
                        }}
                        className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-200'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteTaskFromHistory(deleteItemId);
                          setDeleteConfirm(false);
                          setDeleteItemId(null)
                          setRefreshKey((k) => k + 1);
                        }}
                        className={`${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-500'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm text-zinc-50`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm delete All history */}
                    {clearHistoryConfirm && (
                      <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center ">
                        <div className={`${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-100 text-slate-900'} w-full h-fit max-w-md p-6 rounded-lg shadow-lg border ${darkMode ? 'border-slate-950' : 'border-zinc-300'}`}>
                          <h2 className="text-lg font-bold">Delete All task?</h2>
                          <p className={`${darkMode ? 'text-zinc-200' : 'text-slate-700'} text-sm mt-2`}>
                            All your tasks will be deleted , are you sure to continue.
                          </p>
                          <div className="flex gap-3 mt-6 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setClearHistoryConfirm(false);
                              }}
                              className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-200'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm`}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                clearTaskHistory();
                                setClearHistoryConfirm(false);
                                setRefreshKey((k) => k + 1);
                              }}
                              className={`${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-500'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm text-zinc-50`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}



    {/* Tasks */}
    <div>
        {/* Task History */}
        <div className={`mt-8 ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-200/40'} shadow-md rounded-lg p-4`}>
          <h3 className={`${darkMode ? 'text-zinc-50' : 'text-slate-900'} text-lg font-bold`}>Saved Tasks</h3>
          <p className={`${darkMode ? 'text-zinc-300' : 'text-slate-700'} text-xs`}>Newest to oldest</p>

          {tasksData.length > 0 ? (

            <div className='flex flex-col gap-3 mt-4'>
              <button onClick={()=> { setClearHistoryConfirm(true)}} className='outline-0 text-red-500 hover:text-red-400 ml-auto w-fit cursor-pointer'>Clear history</button>
              {tasksData.map((entry) => (
                <div key={`${entry.recordedAt}-${entry.id}-${entry.status}`} className={`${darkMode ? 'bg-slate-700/40' : 'bg-zinc-100'} border ${darkMode ? 'border-slate-950' : 'border-zinc-300'} rounded-md p-3`}>
                  <div className='flex items-center justify-between gap-3'>
                    <p className={`${darkMode ? 'text-zinc-50' : 'text-slate-900'} font-bold line-clamp-1`}>
                      {entry.title || entry.id}
                    </p>
                    <span className={`text-[10px] px-2 py-1 rounded-lg ${entry.status === 'completed' ? 'bg-green-500/20 text-green-200' : entry.status === 'deleted' ? 'bg-red-500/20 text-red-200' : 'bg-indigo-500/20 text-indigo-200'}`}>
                      {entry.status}
                    </span>
                  </div>
                  {entry.note ? (
                    <p className={`${darkMode ? 'text-zinc-300' : 'text-slate-700'} text-xs mt-1 line-clamp-2`}>
                      {entry.note}
                    </p>
                  ) : null}
                  <p
                    className={`${entry.priority === 'Low' ? 'text-indigo-600 bg-indigo-400' : entry.priority === 'Medium' ? 'text-amber-600 bg-amber-300' : 'text-red-600 bg-red-400'} text-xs mt-1 w-fit px-2 rounded-xs`}
                      >
                        {entry.priority}
                      </p>
                  <div className='flex items-center justify-between'>
                    <p className={`${darkMode ? 'text-zinc-400' : 'text-slate-500'} text-[10px] mt-2`}>
                      {entry.recordedAt ? new Date(entry.recordedAt).toLocaleString() : ''}
                    </p>
                    <div className='flex items-center gap-2'>
                      <button onClick={()=> {setDeleteItemId(entry.id); setDeleteConfirm(true)}}
                        className={`${darkMode ? 'text-zinc-50' : 'text-slate-400'} cursor-pointer`}><MdDelete size={20} /></button>
                      <button
                       onClick={()=> {restoreTaskFromHistory(entry.id); setRefreshKey(prev => prev + 1)}}
                       className={`${darkMode ? 'text-zinc-50' : 'text-slate-400'} cursor-pointer`}><TbRestore size={20} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${darkMode ? 'text-zinc-300' : 'text-slate-700'} w-screen h-50 flex justify-center items-center text-sm mt-4`}>
              <p>You have not saved any task yet.</p>
            </div>
          )}
        </div>
    </div>

    </div>
  )
}

export default ProfilePage
