import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

const useGetCalls = () => {
  const { user } = useUser()
  const client = useStreamVideoClient()
  const [calls, setCalls] = useState<Call[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return

      setIsLoading(true)

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        })

        setCalls(calls)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCalls()
  }, [client, user?.id])

  const now = new Date()

  // calls를 필터링하여 종료된 미팅, 예정된 미팅, 진행 중인 미팅을 구분

  // 종료된 미팅
  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt // startsAt이 있고 startsAt이 현재 시간보다 이전이거나 endedAt이 있는 경우
  })

  // 예정된 미팅
  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now // startsAt이 있고 startsAt이 현재 시간보다 이후인 경우
  })

  // 진행 중인 미팅
  const liveCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return startsAt && new Date(startsAt) < now && !endedAt // startsAt이 있고 startsAt이 현재 시간보다 이전이고 endedAt이 없는 경우
  })

  return { calls, endedCalls, upcomingCalls, liveCalls, isLoading }
}

export default useGetCalls
