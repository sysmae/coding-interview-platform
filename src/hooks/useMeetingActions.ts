import { useRouter } from 'next/navigation'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import toast from 'react-hot-toast'

const useMeetingActions = () => {
  const router = useRouter()
  const client = useStreamVideoClient()

  // 인스턴스 미팅 생성
  const createInstantMeeting = async () => {
    if (!client) return // client가 없다면 실행하지 않음

    try {
      const id = crypto.randomUUID() // 랜덤한 ID 생성
      const call = client.call('default', id) // default 채널에 ID로 콜 생성

      await call.getOrCreate({
        // 콜 생성
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: 'instant meeting',
          },
        },
      })

      router.push(`/meeting/${call.id}`) //meeting/[id]로 이동
      toast.success('미팅이 생성되었습니다.')
    } catch (error) {
      console.error('Error creating instant meeting:', error)
      toast.error('미팅 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 미팅 참가
  const joinMeeting = (callId: string) => {
    if (!client) return toast.error('미팅에 참가할 수 없습니다.')
    router.push(`/meeting/${callId}`)
  }

  return { createInstantMeeting, joinMeeting }
}

export default useMeetingActions
