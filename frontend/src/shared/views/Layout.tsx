import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { Toaster } from '../components/ui/sonner'

const Layout = () => {
  return (
    <main className="m-auto p-4">
      <NavBar />
      <Outlet />
      <Toaster richColors />
    </main>
  )
}

export default Layout
