'use client'

import LoaderUI from '@/components/LoaderUI'
import { useUserRole } from '@/hooks/useUserRole'
import { useRouter } from 'next/navigation'
import InterviewScheduleUi from './InterviewScheduleUi'
const SchedulePage = () => {
  const router = useRouter()
  const { isInterviewer, isLoading } = useUserRole()

  if (isLoading) return <LoaderUI />
  if (!isInterviewer) router.push('/')

  return <InterviewScheduleUi />
}

export default SchedulePage
