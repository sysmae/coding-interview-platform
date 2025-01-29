import { useEffect, useState } from 'react'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>()
  const [isCallLoading, setIsCallLoading] = useState(true)

  const client = useStreamVideoClient()

  useEffect(() => {
    if (!client) return // client가 없으면 아무것도 하지 않음

    const getCall = async () => {
      try {
        // id로 call을 가져옴
        const { calls } = await client.queryCalls({ filter_conditions: { id } })
        // call이 존재하면 첫 번째 call을 설정
        if (calls.length > 0) {
          setCall(calls[0])
        }
      } catch (error) {
        // 에러가 발생하면 console.error로 에러를 출력하고 call을 undefined로 설정
        console.error(error)
        setCall(undefined)
      } finally {
        // 로딩 상태를 false로 설정
        setIsCallLoading(false)
      }
    }
    getCall()
  }, [client, id])
  return { call, isCallLoading }
}

export default useGetCallById
