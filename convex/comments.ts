import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// 새로운 댓글을 추가하는 뮤테이션
export const addComment = mutation({
  args: {
    interviewId: v.id('interviews'),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.insert('comments', {
      interviewId: args.interviewId,
      content: args.content,
      rating: args.rating,
      interviewerId: identity.subject,
    })
  },
})

// 특정 면접에 대한 모든 댓글들을 가져오는 쿼리
export const getComments = query({
  args: { interviewId: v.id('interviews') },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_interview_id', (q) =>
        q.eq('interviewId', args.interviewId)
      )
      .collect()

    return comments
  },
})
