'use client'

import LoaderUI from '@/components/LoaderUI'
import RecordingCard from '@/components/RecordingCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import useGetCalls from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls() // useGetCalls 훅 사용하여 calls와 isLoading 상태 가져오기
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 useEffect 훅
    const fetchRecordings = async () => {
      if (!calls) return // calls가 없으면 함수 종료

      try {
        // 각 통화에 대한 녹음 가져오기
        const callData = await Promise.all(
          calls.map((call) => call.queryRecordings())
        )
        const allRecordings = callData.flatMap((call) => call.recordings) // 모든 녹음을 하나의 배열로 병합

        setRecordings(allRecordings) // recordings 상태 업데이트
      } catch (error) {
        console.log('녹음 가져오는 중 문제 발생: ', error) // 오류 발생 시 콘솔에 로그 출력
      }
    }

    fetchRecordings() // fetchRecordings 함수 호출
  }, [calls]) // calls가 변경될 때마다 useEffect 훅 실행

  if (isLoading) return <LoaderUI /> // 로딩 중이면 LoaderUI 컴포넌트 반환

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* 헤더 섹션 */}
      <h1 className="text-3xl font-bold">녹화</h1>
      <p className="text-muted-foreground my-1">
        {recordings.length} 개의 녹화
        {/* {recordings.length === 1 ? 'recording' : 'recordings'} 개 */}
      </p>
      {/* RECORDINGS GRID */}
      <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
        {recordings.length > 0 ? ( // 녹화가 있으면
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordings.map(
              (
                r // 각 녹음에 대해 RecordingCard 컴포넌트 생성
              ) => (
                <RecordingCard key={r.end_time} recording={r} />
              )
            )}
          </div>
        ) : (
          // 녹화가 없으면
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <p className="text-xl font-medium text-muted-foreground">
              녹화가 없습니다
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
export default RecordingsPage // RecordingsPage 컴포넌트 내보내기
