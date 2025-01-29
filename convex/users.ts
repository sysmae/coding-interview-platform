import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 이미 존재하는 사용자인지 확인
    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .first()

    // 이미 존재하는 사용자라면 종료
    if (existingUser) return

    // 존재하지 않는 사용자라면 추가
    await ctx.db.insert('users', {
      ...args,
      role: 'candidate', // 기본 역할은 candidate
    })
  },
})

// 여러 사용자를 가져오는 쿼리
export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('User is not authenticated')

    const users = await ctx.db.query('users').collect()
    return users
  },
})

// 특정 사용자를 가져오는 쿼리
export const getUserByClerkId = query({
  args: {
    cherkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.cherkId))
      .first()
    return user
  },
})
