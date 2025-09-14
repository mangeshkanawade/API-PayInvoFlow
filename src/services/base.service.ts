import type { BaseRepository } from "../repositories/base.repository";

export class BaseService<T> {
  private repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async create(data: Partial<T>) {
    return this.repository.create(data);
  }

  async getAll(filter = {}) {
    return this.repository.findAll(filter);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<T>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
