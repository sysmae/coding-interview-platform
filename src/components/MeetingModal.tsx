import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import useMeetingActions from '@/hooks/useMeetingActions'

interface MeetingModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  isJoinMeeting: boolean
}

function MeetingModal({
  isOpen,
  onClose,
  title,
  isJoinMeeting,
}: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState('')
  const { createInstantMeeting, joinMeeting } = useMeetingActions()

  const handleStart = () => {
    if (isJoinMeeting) {
      // 전체 URL인 경우 회의 ID 추출
      const meetingId = meetingUrl.split('/').pop()
      if (meetingId) joinMeeting(meetingId)
    } else {
      createInstantMeeting()
    }

    setMeetingUrl('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4" id="dialog-description">
          {isJoinMeeting && (
            <Input
              placeholder="여기에 회의 링크를 붙여넣으세요..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleStart}
              disabled={isJoinMeeting && !meetingUrl.trim()}
            >
              {isJoinMeeting ? '회의 참가' : '회의 시작'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default MeetingModal
