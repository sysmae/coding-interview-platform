'use client' // 클라이언트에서 실행

import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import toast from 'react-hot-toast'
import LoaderUI from '@/components/LoaderUI'
import { getCandidateInfo, groupInterviews } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { INTERVIEW_CATEGORY } from '@/constants'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import CommentDialog from '@/components/CommentDialog'

type Interview = Doc<'interviews'>

function DashboardPage() {
  const users = useQuery(api.users.getUsers) // 모든 사용자 데이터를 가져오는 쿼리
  const interviews = useQuery(api.interviews.getAllInterviews) // 모든 인터뷰 데이터를 가져오는 쿼리
  const updateStatus = useMutation(api.interviews.updateInterviewStatus) // 인터뷰 상태를 업데이트하는 뮤테이션

  const handleStatusUpdate = async (
    interviewId: Id<'interviews'>,
    status: string
  ) => {
    try {
      await updateStatus({ id: interviewId, status }) // 인터뷰 상태 업데이트
      toast.success(`Interview marked as ${status}`) // 성공 메시지 표시
    } catch (error) {
      toast.error('Failed to update status') // 실패 메시지 표시
    }
  }

  if (!interviews || !users) return <LoaderUI /> // 인터뷰나 사용자 데이터가 없으면 로딩 UI 표시

  const groupedInterviews = groupInterviews(interviews) // 인터뷰 데이터를 그룹화

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button>새 면접 예약</Button> {/* 새 면접 예약 버튼 */}
        </Link>
      </div>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* 카테고리 제목 */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant={category.variant}>
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterviews[category.id].map(
                    (interview: Interview) => {
                      const candidateInfo = getCandidateInfo(
                        users,
                        interview.candidateId
                      ) // 후보자 정보 가져오기
                      const startTime = new Date(interview.startTime) // 인터뷰 시작 시간

                      return (
                        <Card className="hover:shadow-md transition-all">
                          {/* 후보자 정보 */}
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback>
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {candidateInfo.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {interview.title}
                                </p>
                              </div>
                            </div>
                          </CardHeader>

                          {/* 날짜 및 시간 */}
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {format(startTime, 'yyyy년 M월 d일')}
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {format(startTime, 'a h시 mm분')}
                              </div>
                            </div>
                          </CardContent>

                          {/* 합격 및 불합격 버튼 */}
                          <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                            {interview.status === 'completed' && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  className="flex-1"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      interview._id,
                                      'succeeded'
                                    )
                                  }
                                >
                                  <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                  합격
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() =>
                                    handleStatusUpdate(interview._id, 'failed')
                                  }
                                >
                                  <XCircleIcon className="h-4 w-4 mr-2" />
                                  불합격
                                </Button>
                              </div>
                            )}
                            <CommentDialog interviewId={interview._id} />{' '}
                            {/* 코멘트 다이얼로그 */}
                          </CardFooter>
                        </Card>
                      )
                    }
                  )}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  )
}
export default DashboardPage
