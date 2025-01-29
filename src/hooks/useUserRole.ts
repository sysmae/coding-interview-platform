import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const useUserRole = () => {
  const { user } = useUser()

  const userData = useQuery(api.users.getUserByClerkId, {
    cherkId: user?.id || '',
  })

  const isLoading = userData === undefined // undefined 은 로딩, null 은 data 가 없음

  return {
    isLoading,
    isInterviewer: userData?.role === 'interviewer',
    isCandidate: userData?.role === 'candidate',
  }
}
