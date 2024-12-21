import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth'
import { File, FileAxis3d, User } from 'lucide-react'

export default function Dashboard() {
  const { setUiLoader } = useAuth()
  useEffect(() => {
    setUiLoader(true)
    setTimeout(() => {
      setUiLoader(false)
    }, 3000);
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-4 my-10">
        <div className=" w-full p-4 card rounded-md bg-white shadow-sm min-h-10 bg-gradient-to-r from-violet-950 to-violet-700">
          <div className="flex justify-between">
            <div><User size={40} color='white' />  <span className="text-white">Users</span></div>
            <div><span className='text-9xl text-white font-bold'>5</span></div>
          </div>
        </div>
        <div className=" w-full p-4 card rounded-md bg-white shadow-sm min-h-10 bg-gradient-to-r from-violet-950 to-violet-700">
          <div className="flex justify-between">
            <div><FileAxis3d size={40} color='white' /> <span className="text-white">Templates</span></div>
            <div><span className='text-9xl text-white font-bold'>12</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
