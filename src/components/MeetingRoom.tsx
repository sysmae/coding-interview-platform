import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { LayoutListIcon, LoaderIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import EndCallButton from './EndCallButton'
import CodeEditor from './CodeEditor'

function MeetingRoom() {
  const router = useRouter()
  const [layout, setLayout] = useState<'grid' | 'speaker'>('speaker') // 기본 레이아웃을 스피커로 설정
  const [showParticipants, setShowParticipants] = useState(false) // 참가자 목록을 보여줄지 여부
  const { useCallCallingState } = useCallStateHooks()

  // 현재 참가자 상태를 가져옴
  const callingState = useCallCallingState()

  // 참가자가 아직 참가하지 않은 경우 로딩 표시
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      {/* 네비게이션 바의 테두리 1px을 빼줌 */}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          {/* 비디오 레이아웃 */}
          <div className="absolute inset-0">
            {/* 레이아웃이 grid이면 PaginatedGridLayout 아니면 SpeakerLayout */}
            {layout === 'grid' ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* 참가자 목록 오버레이 */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
                />
              </div>
            )}
          </div>

          {/* 비디오 컨트롤 */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push('/')} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout('grid')}>
                        그리드 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout('speaker')}>
                        스피커 보기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
export default MeetingRoom
