import { Link } from 'react-router-dom'

type SubscribeProps = {
  onRedirect?: () => void
}

export default function Subscribe({ onRedirect }: SubscribeProps) {
  return (
    <div>
      <div className="text-center text-4xl">🥺</div>
      <div className="flex flex-col items-center justify-center gap-4 text-center text-sm">
        <p>
          To continue using the service without interruption, consider
          subscribing to one of our paid plans
        </p>
        <p>Otherwise, you can wait 24 hours for your quota to reset...</p>
        <Link
          // !🚧TODO: navigate to `/plans` page...
          to={'/plans'}
          onClick={(e) => {
            e.preventDefault()
            alert('🚧 Navigate to `plans` page...')
            onRedirect?.()
          }}
          className="text-link focus-visible:ring-link mx-auto flex h-9 w-fit items-center justify-center rounded-md p-1 underline-offset-4 hover:underline has-[>svg]:px-3"
        >
          👉 View our plans
        </Link>
      </div>
    </div>
  )
}
