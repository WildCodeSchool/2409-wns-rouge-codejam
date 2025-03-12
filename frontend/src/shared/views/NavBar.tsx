import SignIn from '../../features/auth/views/SignIn'
import SignUp from '../../features/auth/views/SignUp'

const NavBar = () => {
  return (
    <header className="flex flex-row items-center justify-between border-b pb-4">
      <h1 className="text-xl font-bold">CodeJam</h1>
      <div className="flex flex-row gap-4">
        <SignIn />
        <SignUp />
      </div>
    </header>
  )
}

export default NavBar
