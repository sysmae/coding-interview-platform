import useMeetingActions from '@/hooks/useMeetingActions'
import { Doc } from '../../convex/_generated/dataModel'
import { getMeetingStatus } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { CalendarIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type Interview = Doc<'interviews'>

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions() // 미팅 참가 액션 훅 사용

  const status = getMeetingStatus(interview) // 미팅 상태 가져오기
  const formattedDate = format(
    new Date(interview.startTime),
    'yyyy년 M월 d일 · a h시 mm분' // 한국식 날짜 및 시간 형식
  )

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === 'live'
                ? 'default' // 라이브면 기본
                : status === 'upcoming' // 예정이면 세컨더리
                ? 'secondary'
                : 'outline' // 완료면 아웃라인
            }
          >
            {status === 'live'
              ? '실시간'
              : status === 'upcoming'
              ? '예정됨'
              : '완료됨'}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* 라이브 상태면 참가할 수 있게 */}
        {status === 'live' && (
          <Button
            className="w-full"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            미팅 참가
          </Button>
        )}

        {/* 예정 상태면 시작 대기 중 */}
        {status === 'upcoming' && (
          <Button variant="outline" className="w-full" disabled>
            시작 대기 중
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
export default MeetingCard
