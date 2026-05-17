import React from 'react'

function ButtonLoading() {
  return (
    <div className="flex items-center justify-center bg-transparent">
                  {/* Loading animation*/}
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-zinc-50 border-t-transparent"></div>
                </div>
  )
}

export default ButtonLoading
