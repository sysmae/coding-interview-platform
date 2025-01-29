import { LoaderIcon } from 'lucide-react'

function LoaderUI() {
  // h-16 + 네비게이션 바의 테두리 1 => 65px
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
      <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
export default LoaderUI
