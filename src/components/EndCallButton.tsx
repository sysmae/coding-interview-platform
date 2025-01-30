import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '../../convex/_generated/api'
import { Button } from './ui/button'
import toast from 'react-hot-toast'

function EndCallButton() {
  const call = useCall() // meeting/[id]에서 감싸져 있으므로 call을 가져올 수 있다.
  const router = useRouter()
  const { useLocalParticipant } = useCallStateHooks() // useCallStateHooks 이 함수가 다재다능
  const localParticipant = useLocalParticipant() // 로컬 참가자를 가져옴

  // 인터뷰 상태를 업데이트하는 뮤테이션
  const updateInterviewStatus = useMutation(
    api.interviews.updateInterviewStatus
  )

  // call이나 interview를 가져옴
  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || '',
  })

  // call이나 interview가 없다면 null 반환
  if (!call || !interview) return null

  // 로컬 참가자가 미팅의 소유자인지 확인
  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id

  // 소유자가 아니라면 null 반환
  if (!isMeetingOwner) return null

  // 미팅 종료 함수
  const endCall = async () => {
    try {
      // 모든 참가자를 종료
      await call.endCall()

      // 인터뷰 상태를 completed로 변경
      await updateInterviewStatus({
        id: interview._id,
        status: 'completed',
      })

      // 홈으로 이동
      router.push('/')
      toast.success('모든 참가자를 위한 회의가 종료되었습니다.')
    } catch (error) {
      console.log(error)
      toast.error('회의 종료에 실패했습니다.')
    }
  }

  return (
    <Button variant={'destructive'} onClick={endCall}>
      회의 종료
    </Button>
  )
}
export default EndCallButton
