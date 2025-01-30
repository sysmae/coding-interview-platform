import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// 모든 면접들을 가져오는 쿼리
export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity() // 사용자가 인증되었는지 확인
    if (!identity) throw new Error('Unauthorized') // 인증되지 않았다면 에러 발생

    const interviews = await ctx.db.query('interviews').collect()

    return interviews
  },
})

// 내가 지원한 면접들을 가져오는 쿼리
export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity() // 사용자가 인증되었는지 확인
    if (!identity) return [] // 인증되지 않았다면 빈 배열 반환

    const interviews = await ctx.db
      .query('interviews')
      .withIndex('by_candidate_id', (q) =>
        q.eq('candidateId', identity.subject)
      )
      .collect()

    return interviews!
  },
})

// 특정 면접을 가져오는 쿼리
export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('interviews')
      .withIndex('by_stream_call_id', (q) =>
        q.eq('streamCallId', args.streamCallId)
      )
      .first()
  },
})

// 새로운 면접을 추가하는 뮤테이션
export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.insert('interviews', {
      ...args,
    })
  },
})

// 면접 상태를 업데이트하는 뮤테이션
export const updateInterviewStatus = mutation({
  args: {
    id: v.id('interviews'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === 'completed' ? { endTime: Date.now() } : {}),
    })
  },
})
