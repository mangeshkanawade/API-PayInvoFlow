import type { Request, Response } from "express";
import type { BaseService } from "../services/base.service.js";

export class BaseController<T> {
  private service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await this.service.create(req.body);
    res.json(result);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const result = await this.service.getAll();
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await this.service.getById(req.params.id!);
    if (!result) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    res.json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const result = await this.service.update(req.params.id!, req.body);
    res.json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await this.service.delete(req.params.id!);
    res.json(result);
  }
}
