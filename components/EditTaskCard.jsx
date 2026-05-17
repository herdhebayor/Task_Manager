import React, {useState} from 'react'
import { editTask } from '@/utils/taskManger'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useGlobalContext } from '@/context/GlobalContext';



function EditTaskCard({ item, removeEditTaskModal, refresh }) {
   const [title, setTitle] = useState(item.title)
   const [note,setNote] = useState(item.note)
   const [priority, setPriority] = useState(item.priority)
   const [error, setError] = useState('')

   const { darkMode } = useGlobalContext()

   const handleSubmit = () => {
  
    if(title === ' '){
        setError('title cannot be empty')
        return;
    }
    const value = {
        id:item.id,
        title,
        note,
        priority,
        isComplete: item.isComplete
    }
    editTask(item.id, value)
    setError('')
    setNote('')
    setTitle('')
    setPriority('')
    removeEditTaskModal()
    if (typeof refresh === 'function') refresh()
    else refresh
   }

    
  return (
    <div className={`${darkMode ? 'bg-slate-700 text-zinc-50' : 'bg-zinc-200 text-slate-900'} md:w-100 w-full h-fit p-4 mt-6 relative rounded-lg`}>
        <button onClick={()=> removeEditTaskModal()} className='absolute top-4 right-4 outline-0 cursor-pointer'><IoMdCloseCircleOutline size={30} /></button>
      <h2 className={`${darkMode ? 'text-zinc-50' : 'text-slate-900'} md:text-xl text-lg font-bold text-center`}>Edit Task</h2>
      <form onSubmit={(e)=>{e.preventDefault(), handleSubmit()}}>
        <div className='my-2 flex flex-col'>
            <label htmlFor='title' className='text-sm font-bold mb-1'>
                Task title :
            </label>
            <input value={title} maxLength={10} onChange={(e)=> setTitle(e.target.value)} type='text' className={`${darkMode ? 'bg-slate-800 ring-slate-200' : 'bg-zinc-200 ring-zinc-300'} px-4 py-2 rounded-md ring  focus:ring-indigo-500 outline-0`} placeholder='Enter your task tiltle'/>
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
            <label htmlFor='note' className='text-sm font-bold mb-1'>
                Note :
            </label>
            <textarea value={note} maxLength={20} onChange={(e)=> setNote(e.target.value)} rows={3} placeholder='Add short note' className={`${darkMode ? 'bg-slate-800 ring-slate-200' : 'bg-zinc-200  ring-slate-300'} px-4 py-1 resize-none rounded-lg ring  appearance-none`}/>
            <p className='text-xs italic'>Hint: Add short note not more than 300 words</p>
        </div>
        <p className='text-red-500 text-xs md:text-sm'>{error}</p>

        <button type='submit' className='w-full px-4 py-2 text-center mt-6 cursor-pointer outline-0 hover:bg-indigo-500 bg-indigo-600 text-zinc-50 rounded-lg'>
            Update Task
        </button>
      </form>
    </div>
  )
}

export default EditTaskCard
