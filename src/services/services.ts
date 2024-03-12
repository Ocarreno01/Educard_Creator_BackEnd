import { injectable } from "inversify";
import Colegio from "../models/colegio.model";
import Curso from "../models/curso.model";

@injectable()
export class Services {
  public async createSchool(schoolData: Partial<Colegio>): Promise<Colegio> {
    return await Colegio.create(schoolData);
  }

  public async gelAllSchools(): Promise<Colegio[]> {
    return await Colegio.findAll();
  }

  public async createGrade(gradeData: Partial<Curso>): Promise<Curso> {
    return await Curso.create(gradeData);
  }

  public async gelAllGrades(): Promise<Curso[]> {
    return await Curso.findAll();
  }

  public async getGradesBySchool(idSchool: string): Promise<Curso[]> {
    return await Curso.findAll({
      where: {
        colegio_id: idSchool,
      },
    });
  }
}
