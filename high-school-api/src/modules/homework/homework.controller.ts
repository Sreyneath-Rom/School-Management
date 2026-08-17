import type { Request, Response } from 'express'
import { homeworkService } from './homework.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const homeworkController = {
  async list(req: Request, res: Response) {
    const { subjectId } = req.query as { subjectId?: string }
    sendSuccess(res, await homeworkService.list({ subjectId }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await homeworkService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await homeworkService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await homeworkService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await homeworkService.remove(req.params.id)
    res.status(204).end()
  },

  async submit(req: Request, res: Response) {
    sendCreated(res, await homeworkService.submit(req.params.id, req.body.studentId, req.body.fileUrl))
  },

  async grade(req: Request, res: Response) {
    sendSuccess(res, await homeworkService.grade(req.params.submissionId, req.body.score, req.body.feedback))
  },
}