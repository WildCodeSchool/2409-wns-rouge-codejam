import { Outlet } from 'react-router-dom'

import { NavBar } from '@/shared/components'

export default function MainLayout() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] gap-4 px-2 py-4">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
