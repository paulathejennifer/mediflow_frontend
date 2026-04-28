import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import { useAuthStore } from '../store/auth-store'

export function useUser(userId?: string) {
  const { user } = useAuthStore()
  const targetUserId = userId || user?.id

  const {
    data: userData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user', targetUserId],
    queryFn: () => userService.getUserById(targetUserId!),
    enabled: !!targetUserId
  })

  return {
    user: userData,
    isLoading,
    error,
    refetch
  }
}

export function useUsers() {
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  })

  return {
    users,
    isLoading,
    error,
    refetch
  }
}
