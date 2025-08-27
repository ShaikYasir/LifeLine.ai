import { Bell, User, AlertTriangle } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export function Header() {
  return (
  <header className="relative h-20 border-b border-rose-100 bg-rose-50/70 backdrop-blur flex items-center px-4 sm:px-6">
      <SignedOut>
        <div className="flex items-center gap-8">
          <div className="flex items-center select-none">
            <img src={logo} alt="LifeLine.ai" className="h-14 sm:h-16 w-auto opacity-95 drop-shadow" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="text-rose-600 hover:text-rose-700">About</Link>
            <Link to="/prevention" className="text-rose-600 hover:text-rose-700">Prevention</Link>
          </nav>
        </div>
      </SignedOut>
  <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-white text-rose-600 text-sm font-medium hover:bg-rose-100 ring-1 ring-rose-200 shadow-sm">Sign In</button>
          </SignInButton>
          <Link to="/register-donor" className="px-3 sm:px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 shadow-sm flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Register Donor</span>
            <span className="sm:hidden">Register</span>
          </Link>
          <Link to="/emergencies" className="px-3 sm:px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200 shadow-sm flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Emergency</span>
            <span className="sm:hidden">Help</span>
          </Link>
        </SignedOut>
        <SignedIn>
          <button className="relative p-2 rounded-lg transition-colors bg-rose-100/60 hover:bg-rose-100 active:bg-rose-200 text-rose-600 shadow-sm" title="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <UserButton appearance={{ elements: { userButtonAvatarBox: 'ring-2 ring-rose-300' } }} />
        </SignedIn>
      </div>
    </header>
  )
}
