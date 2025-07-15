import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'
import { Toaster } from '../ui/sonner'

export default function MainLayout() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] gap-4 border border-solid border-red-500 p-4">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Toaster richColors />
    </div>
  )
}
