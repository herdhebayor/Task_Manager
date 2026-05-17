import React, {useState} from 'react'
import { addTask } from '@/utils/taskManger'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from '@/context/GlobalContext';


function AddTaskCard({ removeAddTaskModal, refresh }) {
    const [note, setNote] = useState('')
    const [priority, setPriority] = useState('Low')
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')

    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : uuidv4();

    const { darkMode } = useGlobalContext()


    const handleSubmit = ()=>{
        if(title === ''){
            setError('Please add tittle')
            return
        }
        const values = {
            id,
            title,
            priority,
            note,
            isCompleted:false,
            createdAt: new Date().toISOString(),
        }

        addTask(values)
        setError('')
        setNote('')
        setTitle('')
        setPriority('')
        removeAddTaskModal()
        if (typeof refresh === 'function') refresh()
                else refresh
            
    }
  return (
    <div className={`${darkMode ? 'bg-slate-700 text-zinc-50' : 'bg-zinc-200 text-slate-900'} md:w-100 w-full h-fit p-4 mt-6 relative rounded-lg`}>
        <button onClick={()=> removeAddTaskModal()} className='absolute top-4 right-4 outline-0 cursor-pointer'><IoMdCloseCircleOutline size={30}/></button>
      <h2 className={`${darkMode ? 'text-zinc-50' : 'text-slate-900'} md:text-xl text-lg font-bold text-center`}>Add Task</h2>
      <form onSubmit={(e)=>{e.preventDefault(), handleSubmit()}}>
        <div className='my-2 flex flex-col'>
            <label htmlFor='title' className='text-sm font-bold mb-1'>
                Task title :
            </label>
            <input maxLength={50} onChange={(e)=> setTitle(e.target.value)} type='text' className={`${darkMode ? 'bg-slate-800 text-zinc-50 ring-slate-200' : 'bg-zinc-200 text-slate-900 ring-zinc-300'} px-4 py-2 rounded-md ring  focus:ring-indigo-500 outline-0`} placeholder='Enter your task tiltle'/>
        </div>
        <div className='my-2 flex flex-col '>
            <label htmlFor='priority' className='text-sm font-bold mb-1'>
                Priority :
            </label>
            <div className='flex gap-4 items-center'>
                <input type='text' onClick={(e)=> setPriority(e.target.value)} readOnly value='Low' className={`${priority === 'Low' ? 'ring-indigo-600' : 'ring-slate-200' } px-2 field-sizing-content py-1 outline-0 ring rounded-lg cursor-pointer`}/>
                <input type='text' onClick={(e)=> setPriority(e.target.value)} readOnly value='Medium' className={`${priority === 'Medium' ? 'ring-amber-500' : 'ring-slate-200'} px-2 field-sizing-content py-1 outline-0 ring  rounded-lg cursor-pointer`}/>
                <input type='text' onClick={(e)=> setPriority(e.target.value)} readOnly value='High' className={`${priority === 'High' ? 'ring-red-500' : 'ring-slate-200' } px-2 field-sizing-content py-1 outline-0 ring rounded-lg cursor-pointer`}/>
            </div>
        </div>
        <div className='flex flex-col my-2'>
            <label htmlFor='note' className='text-sm font-bold mb-1'>Note :</label>
            <textarea onInput={(e)=> setNote(e.target.value)} rows={3} maxLength={100} placeholder='Add short note' className={`${darkMode ? 'bg-slate-800 text-zinc-50 ring-slate-200' : 'bg-zinc-200 text-slate-900 ring-zinc-300'} resize-none px-4 py-1 rounded-lg ring  appearance-none`}/>
            <p className='text-xs italic'>Hint: Add short note not more than 200 words</p>
        </div>
        <p className='text-red-500 text-xs md:text-sm'>{error}</p>

        <button type='submit' className='w-full px-4 py-2 text-center mt-6 cursor-pointer outline-0 hover:bg-indigo-500 bg-indigo-600  rounded-lg'>
            Add New Task
        </button>
      </form>
    </div>
  )
}

export default AddTaskCard
