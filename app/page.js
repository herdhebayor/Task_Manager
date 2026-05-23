'use client'
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaListCheck } from "react-icons/fa6";
import { HiCheckCircle } from "react-icons/hi2";
import { AiFillClockCircle } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import LoginErr from "@/components/LoginErr";

import AddTaskCard from "@/components/AddTaskCard";
import EditTaskCard from "@/components/EditTaskCard";
import { getTasks, deleteTask, deleteAllTask, setTaskState, saveTask } from "@/utils/taskManger";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Home() {
  const [nav, setNav] = useState("All");
  const [showAddTaskCard, setShowAddTaskCard] = useState(false);
  const [showEditTaskCard, setShowEditTaskCard] = useState(false);
  const [editTaskItem, setEditTaskItem] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const [loginError, setLoginError] = useState(false)

  const prio = {'High': 1, 'Medium': 2, 'Low': 3}

  const { darkMode } = useGlobalContext()

  const {data:session} = useSession()

  useEffect(() => {
    // sync tasks from localStorage on refresh
    setTasks((_) => getTasks());
  }, [refreshKey]);


  const removeAddTaskModal = ()=>{
    setShowAddTaskCard(false)
  }

  const removeEditTaskModal = ()=>{
    setShowEditTaskCard(false)
    setEditTaskItem(null)
  }

  const openEditTaskModal = (task) => {
    if (showAddTaskCard) removeAddTaskModal();
    setEditTaskItem(task);
    setShowEditTaskCard(true);
  }
  

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedTaskId((cur) => (cur === id ? null : id));
  };

  const removeLoginErr = () => {setLoginError(false)}
  const handleSaveTask = (id) => {
    // check if user is logged in
    const user = session?.user || session?.user?.id
    if(!user){
      setLoginError(true)
      return;
    }
    saveTask(id)
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className={`${darkMode ? 'bg-slate-900 text-zinc-50' : 'bg-zinc-50 text-slate-900'} flex flex-col  flex-1 font-sans px-4 md:px-12`}>
      {/* Card */}
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row">

        {/* Card one */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-950 text-zinc-300 ' : 'bg-zinc-100 border-zinc-200'} w-full shadow-md border    px-6 py-4 md:py-6 rounded-lg  flex justify-between items-center}`}>
          <div>
            <h3>Total tasks</h3>
            <h2 className="text-2xl font-extrabold">{tasks.length}</h2>
          </div>
          <div className="bg-indigo-800 p-2 py-4 rounded-4xl">
            <FaListCheck size={20} className="text-zinc-50" />
          </div>
        </div>

        {/* Card two */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-950 text-zinc-300 ' : 'bg-zinc-100 border-zinc-200'} w-full shadow-md border   px-6 py-4 md:py-6 rounded-lg  flex justify-between items-center}`}>
          <div>
            <h3>Completed</h3>
            <h2 className="text-2xl font-extrabold">
              {tasks.filter((t) => t.isCompleted).length}
            </h2>
          </div>
          <div className="bg-green-800 p-2 py-4 rounded-4xl">
            <HiCheckCircle size={20} className="text-green-200" />
          </div>
        </div>

        {/* card three */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-950 text-zinc-300 ' : 'bg-zinc-100 border-zinc-200'} w-full shadow-md border   px-6 py-4 md:py-6 rounded-lg  flex justify-between items-center`}>
          <div>
            <h3>Pending</h3>
            <h2 className="text-2xl font-extrabold">
              {tasks.filter((t) => !t.isCompleted).length}
            </h2>
          </div>
          <div className="bg-amber-800 p-2 py-4 rounded-4xl">
            <AiFillClockCircle size={20} className="text-amber-200" />
          </div>
        </div>
      </div>

      {/* Add task card */}
      {showAddTaskCard && (
        <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center">
          <AddTaskCard removeAddTaskModal={removeAddTaskModal} refresh={() => setRefreshKey((k) => k + 1)} />
        </div>
      )}

      {/* Edit task card */}
      {showEditTaskCard && editTaskItem && (
        <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center">
          <EditTaskCard
            item={editTaskItem}
            removeEditTaskModal={removeEditTaskModal}
            refresh={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      )}

      {/* Login error */}
      {loginError && (
        <LoginErr
          darkMode={darkMode}
          error="You must be logged in to save tasks."
          removeLoginErr={removeLoginErr}
          loginErr={loginError}
        />
      )}

      {/* Add task button*/}
      <button
        className="fixed shadow-2xl shadow-indigo-500 bottom-8 outline-0 cursor-pointer right-5 md:right-12 hover:bg-indigo-400 z-10 w-12 h-12 rounded-full text-zinc-50 bg-indigo-500 flex items-center justify-center"
        onClick={() => {
          showEditTaskCard && removeEditTaskModal()
          setShowAddTaskCard(!showAddTaskCard)}}
      >
        <FaPlus size={30} />
      </button>

      <div className="w-full mt-4 relative">
        {/* Task Navigator */}
        <div className="flex justify-between items-center my-4">
          <h3 className={`${darkMode ? 'text-zinc-50' : 'text-slate-900'} text-md md:text-xl font-bold`}>Your Tasks</h3>
          <div className="flex gap-2 items-center">
            <input
              onClick={(e) => setNav(e.target.value)}
              type="text"
              readOnly
              value={"All"}
              className={`${nav === "All" ? "bg-indigo-500 text-zinc-50" : (darkMode ? "bg-slate-700" : "bg-zinc-200")} px-3 md:px-4 text-sm md:text-md  py-1 field-sizing-content rounded-full outline-0 cursor-pointer`}
            />
            <input
              onClick={(e) => setNav(e.target.value)}
              type="text"
              readOnly
              value={"Active"}
              className={`${nav === "Active" ? "bg-indigo-500 text-zinc-50" : (darkMode ? "bg-slate-700" : "bg-zinc-200")} px-3 md:px-4 text-sm md:text-md  py-1 field-sizing-content rounded-full outline-0 cursor-pointer`}
            />
            <input
              onClick={(e) => setNav(e.target.value)}
              type="text"
              readOnly
              value={"Completed"}
              className={`${nav === "Completed" ? "bg-indigo-500 text-zinc-50" : (darkMode ? "bg-slate-700" : "bg-zinc-200")} px-3 md:px-4 text-sm md:text-md  py-1 field-sizing-content rounded-full outline-0 cursor-pointer`}
            />
          </div>
        </div>

        {confirmDeleteOpen && (
        <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-100 text-slate-900'} w-full max-w-md p-6 rounded-lg shadow-lg border ${darkMode ? 'border-slate-950' : 'border-zinc-300'}`}>
            <h2 className="text-lg font-bold">Delete task?</h2>
            <p className={`${darkMode ? 'text-zinc-200' : 'text-slate-700'} text-sm mt-2`}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setConfirmDeleteTaskId(null);
                }}
                className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-200'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTask(confirmDeleteTaskId);
                  setConfirmDeleteOpen(false);
                  setConfirmDeleteTaskId(null);
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

      {/* Confirm delete All */}
      {confirmDeleteAll && (
        <div className="fixed w-screen h-screen p-4 z-100 md:p-12 top-0 left-0 bg-black/30 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-slate-800 text-zinc-50' : 'bg-zinc-100 text-slate-900'} w-full max-w-md p-6 rounded-lg shadow-lg border ${darkMode ? 'border-slate-950' : 'border-zinc-300'}`}>
            <h2 className="text-lg font-bold">Delete All task?</h2>
            <p className={`${darkMode ? 'text-zinc-200' : 'text-slate-700'} text-sm mt-2`}>
              All your tasks will be deleted , are you sure to continue.
            </p>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteAll(false);
                }}
                className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-200'} outline-0 cursor-pointer rounded-lg px-4 py-2 text-sm`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAllTask();
                  setConfirmDeleteAll(false);
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

      {tasks.length > 0 ? (
          <div className='flex flex-col items-center gap-4'>
            <button
              onClick={() => {
                setConfirmDeleteAll(true);
              }}
              className='outline-0 text-red-500 hover:text-red-400 ml-auto w-fit cursor-pointer'
            >Clear all task</button>
          {
            tasks.sort((a, b) => prio[a.priority] - prio[b.priority]).filter((t) =>
              nav === "All" ? true : nav === "Active" ? !t.isCompleted : t.isCompleted
            )
            .map((task) => (
              <div
                key={task.id ?? task.title}
                className={`${darkMode ? 'bg-slate-800 text-zinc-50  border-slate-950' : 'bg-zinc-200 text-slate-900 border-zinc-400'} shadow-md border gap-2 md:gap-4 flex items-center justify-evenly w-full p-4 rounded-lg`}
              >
                
                <div className="flex w-[85%] gap-4 items-center">
                  <button
                    onClick={() => {
                      setTaskState(task.id);
                      setRefreshKey((k) => k + 1);
                    }}
                    className={`${darkMode ? 'text-zinc-50  border-slate-200' : 'text-slate-900 border-slate-900'} w-5 h-5 border md:h-7 md:w-7 cursor-pointer rounded-full  flex items-center justify-center`}
                  >
                    {task.isCompleted ? (
                      <HiCheckCircle size={30} />
                    ) : null}
                  </button>
                  <div className="text-md flex-1  min-w-0">
                    <div
                      type="button"
                      onClick={() => toggleExpanded(task.id)}
                      className="block outline-0 text-left w-full cursor-pointer overflow-hidden"
                      aria-expanded={expandedTaskId === (task.id)}
                    >
                      <p
                        className={`flex flex-wrap font-bold w-full ${expandedTaskId === (task.id) ? '' : 'line-clamp-1'}`}
                      >
                        {task.title}
                      </p>
                      <p
                        className={`text-xs w-[90%] ${expandedTaskId === (task.id) ? '' : 'line-clamp-1'}`}
                      >
                        {task.note || ''}
                      </p>
                      <div className="flex justify-between items-center">
                      <p
                        className={`${task.priority === 'Low' ? 'text-indigo-600 bg-indigo-400' : task.priority === 'Medium' ? 'text-amber-600 bg-amber-300' : 'text-red-600 bg-red-400'} text-xs mt-1 w-fit px-2 rounded-xs`}
                      >
                        {task.priority}
                      </p>
                      {
                        task.isCompleted && (
                          <button
                            onClick={()=> handleSaveTask(task.id)}
                           className={`${darkMode ? 'bg-slate-600 hover:bg-slate-700 text-zinc-50' : 'bg-slate-300 hover:bg-slate-400 text-slate-800'} rounded-lg px-2 cursor-pointer text-sm outline-0`}>Save</button>
                        )
                      }
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex flex-col w-fit  md:flex-row gap-2 md:gap-4 items-center">
                  <button
                    onClick={() => openEditTaskModal(task)}
                    className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-300'} outline-0 cursor-pointer rounded-lg p-1 md:p-2`}
                  >
                    <MdEdit size={25}  />
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDeleteTaskId(task.id);
                      setConfirmDeleteOpen(true);
                    }}
                    className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-300'} outline-0 cursor-pointer rounded-lg p-1 md:p-2`}
                  >
                    <MdDelete size={25} />
                  </button>
                </div>
              </div>
            ))}
            </div>
        ) : (
          <div className='flex-1 items-center justify-center flex flex-col mt-10'>
            <FaListCheck size={60} className="text-gray-600"/>
            <p className='text-gray-600 text-center mt-4'>You current have no task click on the + icon to add task</p>
          </div>
        )}
      </div>
    </div>
  );
}

