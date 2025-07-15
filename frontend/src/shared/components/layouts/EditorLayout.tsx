import { Outlet } from 'react-router-dom'

export default function EditorLayout() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4">
      <div className="flex min-h-10 items-center justify-end bg-pink-300">
        Header
      </div>
      <Outlet />
    </div>
  )
}
