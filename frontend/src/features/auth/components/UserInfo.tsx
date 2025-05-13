import { useMutation } from '@apollo/client'
import { toast } from 'sonner'
import { LOGOUT } from '@/shared/api/logout'
import { WHO_AM_I } from '@/shared/api/whoAmI'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { WhoAmIQuery } from '@/shared/gql/graphql'

type UserInfoProps = {
  user: NonNullable<WhoAmIQuery['whoAmI']>
}

export default function UserInfo({ user }: UserInfoProps) {
  const [logout] = useMutation(LOGOUT)

  const handleLogout = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const { data, errors } = await logout({
        refetchQueries: [{ query: WHO_AM_I }],
      })

      if (errors !== undefined || !data?.logout) {
        if (errors) console.error('Failed to sign out:', errors)
        throw new Error('Failed to sign out!')
      }

      toast.success('Successful logout', {
        description: '👋 Hope to see you soon!',
      })
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <p>{user.username ?? 'codejamer'}</p>
      <Popover>
        <Avatar>
          <PopoverTrigger className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {user.username?.slice(0, 2).toUpperCase() ?? 'CJ'}
            </AvatarFallback>
            <PopoverContent className="grid w-fit">
              <Button onClick={handleLogout}>Sign Out</Button>
            </PopoverContent>
          </PopoverTrigger>
        </Avatar>
      </Popover>
    </div>
  )
}
