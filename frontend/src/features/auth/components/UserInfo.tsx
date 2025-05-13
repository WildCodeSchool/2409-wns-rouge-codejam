import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { WhoAmIQuery } from '@/shared/gql/graphql'

type UserInfoProps = {
  user: NonNullable<WhoAmIQuery['whoAmI']>
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          {user.username?.slice(0, 2).toUpperCase() ?? 'CJ'}
        </AvatarFallback>
      </Avatar>
      <p>{user.username ?? 'codejamer'}</p>
    </div>
  )
}
