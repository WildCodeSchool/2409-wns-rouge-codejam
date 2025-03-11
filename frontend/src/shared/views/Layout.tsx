import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <main className="m-auto mt-20 mb-44 max-w-screen-xl px-8">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
