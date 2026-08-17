import type { Request, Response } from 'express'
import { quizzesService } from './quizzes.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const quizzesController = {
  async list(req: Request, res: Response) {
    const { subjectId } = req.query as { subjectId?: string }
    sendSuccess(res, await quizzesService.list({ subjectId }))
  },

  async getById(req: Request, res: Response) {
    // NOTE: for students taking the quiz, strip `correctAnswer` from each
    // question here based on req.user.roleName before shipping this to
    // production — quizzesService.getById returns the full record, answers included.
    sendSuccess(res, await quizzesService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await quizzesService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await quizzesService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await quizzesService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },

  async submit(req: Request, res: Response) {
    sendCreated(res, await quizzesService.submit(req.params.id, req.body.studentId, req.body.answers))
  },
}