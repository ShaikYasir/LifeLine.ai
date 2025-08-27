import { Link, useLocation } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useRole } from '../../auth/useRole'
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  BarChart2, 
  FileText, 
  Award,
  Settings,
  Handshake,
  Info,
  ShieldCheck,
  PieChart
} from 'lucide-react'
import logo from '../../assets/logo.png'
import smallLogo from '../../assets/logo_s.png'
import fullLogo from '../../assets/logo.png'
// Toggle chevrons removed (hover-based expand/collapse)

const menuItems = [
  { icon: Info, label: 'About', path: '/about', roles: ['Public','User','Admin'] },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['Admin'] },
  { icon: ShieldCheck, label: 'Prevention', path: '/prevention', roles: ['User','Admin'] },
  { icon: PieChart, label: 'Stats', path: '/stats', roles: ['User'] },
  { icon: Users, label: 'Donors', path: '/donors', roles: ['User','Admin'] },
  { icon: Handshake, label: 'Bridges', path: '/bridges', roles: ['User','Admin'] },
  { icon: AlertTriangle, label: 'Emergencies', path: '/emergencies', roles: ['Public','User','Admin'] },
  { icon: Award, label: 'Rewards', path: '/rewards', roles: ['User','Admin'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['Admin'] }
]

export function Sidebar({ collapsed, onToggle, pinned, setCollapsed, setPinned }) {
  const location = useLocation()
  const { isSignedIn } = useUser()
  const { role } = useRole()
  const currentRole = isSignedIn ? role : 'Public'
  const filtered = menuItems.filter(m => m.roles.includes(currentRole))
  const width = collapsed ? 'w-16' : 'w-64'
  const handlePinToggle = () => {
    if (pinned) {
      setPinned?.(false)
      setCollapsed?.(true)
    } else {
      setPinned?.(true)
      setCollapsed?.(false)
    }
  }

  return (
    <div
      className={`${width} bg-white border-r border-primary-100 flex flex-col transition-[width] duration-200 ease-out`}
      onMouseEnter={() => !pinned && collapsed && setCollapsed?.(false)}
      onMouseLeave={() => !pinned && !collapsed && setCollapsed?.(true)}
      onDoubleClick={handlePinToggle}
      title={pinned ? (collapsed ? 'Pinned (double‑click to expand)' : 'Pinned (double‑click to collapse)') : (collapsed ? 'Hover to peek • double‑click to pin' : 'Double‑click to unpin')}
    >
      <div
        className="h-24 px-2 border-b border-primary-100 flex items-center justify-center select-none"
      >
        {collapsed ? (
          <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center ring-1 ring-primary-100 overflow-hidden">
            <img src={smallLogo} alt="Logo compact" className="h-8 w-auto object-contain" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="relative h-20 w-48 rounded-xl ring-1 ring-rose-200 overflow-hidden flex items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 px-2">
              <img src={fullLogo} alt="LifeLine.ai" className="h-12 w-auto object-contain drop-shadow-sm" />
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
  {filtered.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-rose-100 text-rose-700 shadow-sm'
                  : 'text-rose-500 hover:bg-rose-50 hover:text-rose-700'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-rose-100 text-[10px] text-rose-400 text-center select-none">
        {!collapsed ? 'v1.0.0' : 'v1'}
      </div>
    </div>
  )
}
