import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from '@stream-io/video-react-sdk'
import { CameraIcon, MicIcon, SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Switch } from './ui/switch'

const MeetingSetup = ({ onSetupComplete }: { onSetupComplete: () => void }) => {
  const [isCameraDisabled, setIsCameraDisabled] = useState(false)
  const [isMicDisabled, setIsMicDisabled] = useState(false)

  const call = useCall() // 이미 /meeting/[id]/page.tsx에서 StreamCall로 감싸져 있기 때문에 call을 가져올 수 있음

  if (!call) return null

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable()
    else call.camera.enable()
  }, [isCameraDisabled, call.camera])

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable()
    else call.microphone.enable()
  }, [isMicDisabled, call.microphone])

  const handleJoin = async () => {
    await call.join()
    onSetupComplete() // setup이 완료되면 onSetupComplete를 호출하여 부모 컴포넌트에 알림
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 비디오 프리뷰 컨테이너 */}
          <Card className="md:col-span-1 p-6 flex flex-col">
            <div>
              <h1 className="text-xl font-semibold mb-1">카메라 미리보기</h1>
              <p className="text-sm text-muted-foreground">
                화면에 잘 나오고 있는지 확인하세요!
              </p>
            </div>

            {/* 비디오 미리보기 */}
            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full" />
              </div>
            </div>
          </Card>

          {/* 카드 컨트롤 */}

          <Card className="md:col-span-1 p-6">
            <div className="h-full flex flex-col">
              {/* 회의 세부사항 */}
              <div>
                <h2 className="text-xl font-semibold mb-1">회의 세부사항</h2>
                <p className="text-sm text-muted-foreground break-all">
                  {call.id}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="spacey-6 mt-8">
                  {/* 카메라 컨트롤 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CameraIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">카메라</p>
                        <p className="text-sm text-muted-foreground">
                          {isCameraDisabled ? '꺼짐' : '켜짐'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isCameraDisabled}
                      onCheckedChange={(checked) =>
                        setIsCameraDisabled(!checked)
                      }
                    />
                  </div>

                  {/* 마이크 컨트롤 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MicIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">마이크</p>
                        <p className="text-sm text-muted-foreground">
                          {isMicDisabled ? '꺼짐' : '켜짐'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isMicDisabled}
                      onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                    />
                  </div>

                  {/* 장치 설정 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">설정</p>
                        <p className="text-sm text-muted-foreground">
                          장치 구성
                        </p>
                      </div>
                    </div>
                    <DeviceSettings />
                  </div>
                </div>

                {/* 참가 버튼 */}
                <div className="space-y-3 mt-8">
                  <Button className="w-full" size="lg" onClick={handleJoin}>
                    회의 참가
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    걱정하지 마세요, 우리 팀은 매우 친절합니다! 성공을
                    기원합니다. 🎉
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MeetingSetup
