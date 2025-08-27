import { useState, useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [pinned, setPinned] = useState(false)
  const toggle = useCallback(()=> {
    setCollapsed(c=>!c)
    setPinned(p=> !p) // when manually toggled, flip pin state
  }, [])
  const setCollapseOnly = useCallback(val => setCollapsed(val), [])
  const setPinnedExplicit = useCallback(val => setPinned(val), [])

  return (
    <div className="flex min-h-screen bg-gray-50">
  <Sidebar collapsed={collapsed} onToggle={toggle} pinned={pinned} setCollapsed={setCollapseOnly} setPinned={setPinnedExplicit} />
      <div className="flex-1 flex flex-col min-h-screen transition-[margin] duration-200 ease-out">
        <Header onToggleSidebar={toggle} collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto bg-gray-50 pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
