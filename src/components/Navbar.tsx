import Link from 'next/link'
import { ModeToggle } from './ModeToggle'
import { CodeIcon } from 'lucide-react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import DashboardBtn from './DashboardBtn'

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* 왼쪽 사이드, 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Coding Interview
          </span>
        </Link>

        {/* 오른쪽 사이드, 액션 */}
        <SignedIn>
          <div className="flex items-center space-x-4  ml-auto">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar
