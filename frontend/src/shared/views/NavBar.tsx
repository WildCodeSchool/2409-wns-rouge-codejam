import SignInDialog from '@/features/auth/components/SignInDialog'
import SignUpDialog from '@/features/auth/components/SignUpDialog'

const NavBar = () => {
  return (
    <header className="flex flex-row items-center justify-between border-b pb-4">
      <h1 className="text-xl font-bold">CodeJam</h1>
      <div className="flex flex-row gap-4">
        <SignInDialog />
        <SignUpDialog />
      </div>
    </header>
  )
}

export default NavBar
