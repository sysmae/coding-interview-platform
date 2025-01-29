'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { SparklesIcon } from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'

const DashboardBtn = () => {
  const { isCandidate, isLoading } = useUserRole()

  if (isCandidate || isLoading) {
    return null
  }
  return (
    <Link href={'/dashboard'}>
      <Button className="gap-2 font-medium" size={'sm'}>
        <SparklesIcon className="size-4" />
        대시보드
      </Button>
    </Link>
  )
}

export default DashboardBtn
