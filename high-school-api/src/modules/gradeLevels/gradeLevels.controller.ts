import type { Request, Response } from "express";
import { gradeLevelsService } from "./gradeLevels.service";
import { sendCreated, sendSuccess } from "@/utils/apiResponse";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/pagination";
import type {
  CreateGradeLevelBody,
  ListGradeLevelsQuery,
  UpdateGradeLevelBody,
} from "./gradeLevels.validation";

export const gradeLevelsController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListGradeLevelsQuery;

    const { items, total, page, limit } = await gradeLevelsService.list(query);

    sendSuccess(res, items, 200, buildPaginationMeta(total, { page, limit }));
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await gradeLevelsService.getById(req.params.id));
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateGradeLevelBody | undefined;
    if (!body) throw ApiError.badRequest("Request body is required");

    sendCreated(res, await gradeLevelsService.create(body));
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateGradeLevelBody | undefined;
    if (!body) throw ApiError.badRequest("Request body is required");

    sendSuccess(res, await gradeLevelsService.update(req.params.id, body));
  },

  async remove(req: Request, res: Response) {
    await gradeLevelsService.remove(req.params.id);
    res.status(204).end();
  },
};
