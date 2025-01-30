import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UserInfo from '@/components/UserInfo'
import { Loader2Icon, XIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { TIME_SLOTS } from '@/constants'
import MeetingCard from '@/components/MeetingCard'

function InterviewScheduleUI() {
  const client = useStreamVideoClient()
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const interviews = useQuery(api.interviews.getAllInterviews) ?? []
  const users = useQuery(api.users.getUsers) ?? []
  const createInterview = useMutation(api.interviews.createInterview)

  const candidates = users?.filter((u) => u.role === 'candidate')
  const interviewers = users?.filter((u) => u.role === 'interviewer')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '09:00',
    candidateId: '',
    interviewerIds: user?.id ? [user.id] : [],
  })

  const scheduleMeeting = async () => {
    // 클라이언트나 유저가 없다면 아무것도 하지 않음
    if (!client || !user) return
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error('후보자와 최소 한 명의 면접관을 선택하세요')
      return
    }

    // 회의 생성 중
    setIsCreating(true)

    // 폼 데이터에서 title, description, date, time, candidateId, interviewerIds를 가져옴
    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData
      const [hours, minutes] = time.split(':')
      const meetingDate = new Date(date)
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0)

      // 랜덤한 ID 생성
      const id = crypto.randomUUID()
      const call = client.call('default', id)

      // 콜 생성
      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      })

      // 면접 생성
      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: 'upcoming',
        streamCallId: id,
        candidateId,
        interviewerIds,
      })

      // 다이얼로그 닫기
      setOpen(false)
      toast.success('회의가 성공적으로 예약되었습니다!')

      // 폼 데이터 초기화
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        time: '09:00',
        candidateId: '',
        interviewerIds: user?.id ? [user.id] : [],
      })
    } catch (error) {
      console.error(error)
      toast.error('회의 예약에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsCreating(false)
    }
  }

  // 면접관 추가
  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }))
    }
  }

  // 면접관 제거
  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }))
  }

  // 선택된 면접관과 사용 가능한 면접관을 구분
  const selectedInterviewers = interviewers.filter(
    (i) => formData.interviewerIds.includes(i.clerkId) // 선택된 면접관
  )

  // 사용 가능한 면접관
  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId) // 선택되지 않은 면접관
  )

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* 헤더 정보 */}
        <div>
          <h1 className="text-3xl font-bold">면접</h1>
          <p className="text-muted-foreground mt-1">
            면접을 예약하고 관리하세요
          </p>
        </div>

        {/* 다이얼로그 */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">면접 예약</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>면접 예약</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* 면접 제목 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <Input
                  placeholder="면접 제목"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* 면접 설명 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">설명</label>
                <Textarea
                  placeholder="면접 설명"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* 후보자 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">후보자</label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(candidateId) =>
                    setFormData({ ...formData, candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="후보자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 면접관 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">면접관</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewers.map((interviewer) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <button
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewers.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="면접관 추가" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((interviewer) => (
                        <SelectItem
                          key={interviewer.clerkId}
                          value={interviewer.clerkId}
                        >
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* 날짜 및 시간 */}
              <div className="flex gap-4">
                {/* 캘린더 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">날짜</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* 시간 */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">시간</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  취소
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      예약 중...
                    </>
                  ) : (
                    '면접 예약'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 로딩 상태 및 미팅 카드 */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="spacey-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          예약된 면접이 없습니다
        </div>
      )}
    </div>
  )
}
export default InterviewScheduleUI
