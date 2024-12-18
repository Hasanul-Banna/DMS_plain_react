import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth'

export default function Dashboard() {
  const { setUiLoader } = useAuth()
  useEffect(() => {
    setUiLoader(true)
    setTimeout(() => {
      setUiLoader(false)
    }, 3000);
  }, [])
  return (
    <div>Dashboard</div>
  )
}
