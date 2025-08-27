import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Support both recommended Vite prefix and an accidentally used NEXT_PUBLIC_ prefix
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

function Root() {
  if (!clerkKey) {
    return (
      <div style={{fontFamily:'system-ui, sans-serif',padding:'2rem'}}>
        <h1 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'0.75rem'}}>Configuration error</h1>
        <p style={{marginBottom:'0.5rem'}}>
          Missing Clerk publishable key. Add <code>VITE_CLERK_PUBLISHABLE_KEY=your_key</code> to <code>.env</code> (restart dev server).
        </p>
        <p>If you previously set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>, rename it to <code>VITE_CLERK_PUBLISHABLE_KEY</code>.</p>
      </div>
    )
  }
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <App />
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
