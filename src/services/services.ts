import { injectable } from "inversify";
import Colegio from "../models/colegio.model";
import Curso from "../models/curso.model";
import Alumno from "../models/alumno.model";

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

  public async createStudent(studentData: Partial<Alumno>): Promise<Alumno> {
    return await Alumno.create(studentData);
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

  public async getStudentsByGrade(idGrade: string): Promise<Alumno[]> {
    return await Alumno.findAll({
      where: {
        curso_id: idGrade,
      },
    });
  }

  public async deleteStudentsByGrade(gredeId: string): Promise<number> {
    return await Alumno.destroy({
      where: {
        curso_id: gredeId,
      },
    });
  }
}
