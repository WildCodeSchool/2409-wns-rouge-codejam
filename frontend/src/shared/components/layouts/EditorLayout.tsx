import { Outlet } from 'react-router-dom'

export default function EditorLayout() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4">
      <div className="flex min-h-10 items-center justify-center bg-slate-400">
        🚧 wip: Header...
      </div>
      <Outlet />
    </div>
  )
}
