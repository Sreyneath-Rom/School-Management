import type { Request, Response } from "express";
import { classesService } from "./classes.service";
import { sendCreated, sendSuccess } from "@/utils/apiResponse";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/pagination";
import type {
  CreateClassBody,
  ListClassesQuery,
  UpdateClassBody,
} from "./classes.validation";

export const classesController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListClassesQuery;

    const { items, total, page, limit } = await classesService.list(query);

    sendSuccess(res, items, 200, buildPaginationMeta(total, { page, limit }));
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await classesService.getById(req.params.id));
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateClassBody | undefined;
    if (!body) throw ApiError.badRequest("Request body is required");

    sendCreated(res, await classesService.create(body));
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateClassBody | undefined;
    if (!body) throw ApiError.badRequest("Request body is required");

    sendSuccess(res, await classesService.update(req.params.id, body));
  },

  async remove(req: Request, res: Response) {
    await classesService.remove(req.params.id);
    // 204 responses must not include a body. Bypassing sendNoContent's
    // alternative json({}) form is intentional — res.status(204).end() is
    // the correct primitive.
    res.status(204).end();
  },
};
