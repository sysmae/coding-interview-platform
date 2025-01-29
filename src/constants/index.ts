import { Clock, Code2, Calendar, Users } from 'lucide-react'

export const INTERVIEW_CATEGORY = [
  { id: 'upcoming', title: '다가오는 인터뷰', variant: 'outline' },
  { id: 'completed', title: '완료됨', variant: 'secondary' },
  { id: 'succeeded', title: '성공', variant: 'default' },
  { id: 'failed', title: '실패', variant: 'destructive' },
] as const

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
]

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: '새 인터뷰',
    description: '새로운 인터뷰 시작',
    color: 'primary',
    gradient: 'from-primary/10 via-primary/5 to-transparent',
  },
  {
    icon: Users,
    title: '인터뷰 참가',
    description: '초대 링크를 통해 입장',
    color: 'purple-500',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
  },
  {
    icon: Calendar,
    title: '일정',
    description: '다가오는 인터뷰 계획',
    color: 'blue-500',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
  {
    icon: Clock,
    title: '녹화',
    description: '과거 인터뷰 접근',
    color: 'orange-500',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
  },
]

export const CODING_QUESTIONS: CodeQuestion[] = [
  {
    id: 'two-sum',
    title: '두 수의 합',
    description:
      '정수 배열 `nums`와 정수 `target`이 주어졌을 때, 배열에서 두 수의 합이 `target`이 되는 두 수의 인덱스를 반환하세요.\n\n각 입력에는 정확히 하나의 솔루션이 있다고 가정할 수 있으며, 동일한 요소를 두 번 사용할 수 없습니다.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9이므로, [0, 1]을 반환합니다.',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // 여기에 솔루션을 작성하세요
  
}`,
      python: `def two_sum(nums, target):
    # 여기에 솔루션을 작성하세요
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 여기에 솔루션을 작성하세요
        
    }
}`,
    },
    constraints: [
      '2 ≤ nums.length ≤ 104',
      '-109 ≤ nums[i] ≤ 109',
      '-109 ≤ target ≤ 109',
      '유효한 답은 하나만 존재합니다.',
    ],
  },
  {
    id: 'reverse-string',
    title: '문자열 뒤집기',
    description:
      '문자 배열 `s`가 주어졌을 때, 문자열을 뒤집는 함수를 작성하세요.\n\nO(1) 추가 메모리로 입력 배열을 제자리에서 수정하여야 합니다.',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    starterCode: {
      javascript: `function reverseString(s) {
  // 여기에 솔루션을 작성하세요
  
}`,
      python: `def reverse_string(s):
    # 여기에 솔루션을 작성하세요
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // 여기에 솔루션을 작성하세요
        
    }
}`,
    },
  },
  {
    id: 'palindrome-number',
    title: '회문 숫자',
    description:
      '정수 `x`가 주어졌을 때, `x`가 회문이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환하세요.\n\n정수는 앞뒤로 읽어도 동일한 경우 회문입니다.',
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation:
          '121은 왼쪽에서 오른쪽으로 읽어도, 오른쪽에서 왼쪽으로 읽어도 121입니다.',
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation:
          '왼쪽에서 오른쪽으로 읽으면 -121입니다. 오른쪽에서 왼쪽으로 읽으면 121-이 됩니다. 따라서 회문이 아닙니다.',
      },
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
  // 여기에 솔루션을 작성하세요
  
}`,
      python: `def is_palindrome(x):
    # 여기에 솔루션을 작성하세요
    pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // 여기에 솔루션을 작성하세요
        
    }
}`,
    },
  },
]

export const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '/javascript.png' },
  { id: 'python', name: 'Python', icon: '/python.png' },
  { id: 'java', name: 'Java', icon: '/java.png' },
] as const

export interface CodeQuestion {
  id: string
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  starterCode: {
    javascript: string
    python: string
    java: string
  }
  constraints?: string[]
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number]
