// app/loading.tsx

import { useGlobalContext } from "@/context/GlobalContext"
export default function Loading() {
  const { darkMode } = useGlobalContext()
  return (
    <div className={`${darkMode ? 'bg-slate-900' : 'bg-zinc-50'} flex h-screen items-center justify-center `}>
      {/* Tailwind Spinner */}
      <div className={`${darkMode ? 'border-slate-400' : 'border-indigo-500'} h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-transparent`}></div>
    </div>
  )
}
