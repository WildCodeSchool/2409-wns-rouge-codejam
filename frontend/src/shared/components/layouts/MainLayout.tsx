import { Outlet } from 'react-router-dom'

import NavBar from '@/shared/components/NavBar'

export default function MainLayout() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] gap-4 p-4">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
