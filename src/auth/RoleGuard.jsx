import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useRole } from './useRole'

export default function RoleGuard({ children, roles }) {
  const { isLoaded, isSignedIn } = useUser()
  const { role } = useRole()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/about" replace />
  if (roles && roles.length && !roles.includes(role)) return <Navigate to="/about" replace />
  return children
}
