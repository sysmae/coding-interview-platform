'use client'
import ActionCard from '@/components/ActionCard'
import { QUICK_ACTIONS } from '@/constants'
import { useUserRole } from '@/hooks/useUserRole'
import { useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import MeetingModal from '@/components/MeetingModal'
import LoaderUI from '@/components/LoaderUI'

export default function Home() {
  const router = useRouter()
  const { isInterviewer, isCandidate, isLoading } = useUserRole()
  const interview = useQuery(api.interviews.getMyInterviews)

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'start' | 'join'>()

  const handleQuickAction = (title: string) => {
    switch (title) {
      case QUICK_ACTIONS[0].title: // '새 인터뷰'
        setModalType('start')
        setShowModal(true)
        break
      case QUICK_ACTIONS[1].title: // '인터뷰 참가'
        setModalType('join')
        setShowModal(true)
        break
      case QUICK_ACTIONS[2].title: // '일정'
        router.push('/schedule')
        break
      case QUICK_ACTIONS[3].title: // '녹화'
        router.push('/recordings')
        break
      default:
        break
    }
  }
  if (isLoading) {
    return <LoaderUI />
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* 웰컴 섹션 */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          어서오세요!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? '인터뷰를 관리하고 후보자를 효과적으로 검토하세요'
            : '다가오는 인터뷰와 준비 사항에 접근하세요'}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === 'join' ? '인터뷰 참가' : '새 인터뷰 시작'}
            isJoinMeeting={modalType === 'join'}
          />
        </>
      ) : (
        <>
          <div>참가자 페이지</div>
        </>
      )}
    </div>
  )
}
