type ErrorStateProps = {
  message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="grid h-full place-items-center">
      <p>{message}</p>
    </div>
  )
}
