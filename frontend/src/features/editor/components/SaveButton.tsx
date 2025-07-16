import { Button } from '@/shared/components/ui/button'
import { LoaderCircle, Save } from 'lucide-react'

type SaveButtonProps = {
  onClick: () => void
  loading: boolean
}

const SaveButton = ({ onClick, loading }: SaveButtonProps) => {
  return (
    <Button
      disabled={loading ? true : false}
      variant="outline"
      className="w-min"
      onClick={onClick}
    >
      {!loading ? <Save /> : <LoaderCircle className="animate-spin" />}
    </Button>
  )
}

export default SaveButton
