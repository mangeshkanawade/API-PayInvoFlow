import type { Request, Response } from "express";
import type { BaseService } from "../services/base.service.js";

export class BaseController<T> {
  private service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  create = async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    res.json(result);
  };

  getAll = async (req: Request, res: Response) => {
    const result = await this.service.getAll();
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id!);
    if (!result) return res.status(404).json({ message: "Not Found" });
    res.json(result);
  };

  update = async (req: Request, res: Response) => {
    const result = await this.service.update(req.params.id!, req.body);
    res.json(result);
  };

  delete = async (req: Request, res: Response) => {
    const result = await this.service.delete(req.params.id!);
    res.json(result);
  };
}
