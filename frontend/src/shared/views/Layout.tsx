import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const Layout = () => {
  return (
    <main className="m-auto p-4">
      <NavBar />
      <Outlet />
    </main>
  )
}

export default Layout
