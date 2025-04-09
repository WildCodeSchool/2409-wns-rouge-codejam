import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { Toaster } from '../components/ui/sonner'

const Layout = () => {
  return (
    <div className="p-4 h-dvh grid grid-rows-[auto_1fr] gap-1">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Toaster richColors />
    </div>
  )
}

export default Layout
