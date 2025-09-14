import { ICompany } from "../models/company.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "./base.service";

export class CompanyService extends BaseService<ICompany> {
  constructor(public repo: BaseRepository<ICompany>) {
    super(repo);
  }
}
