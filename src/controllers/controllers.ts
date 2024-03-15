import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { Request } from "express";
import { Services } from "../services/services";
import Alumno from "../models/alumno.model";

@injectable()
export class Controllers {
  private readonly service: Services;

  constructor(@inject(TYPES.Services) _services: Services) {
    this.service = _services;
  }

  public createSchools = async (req: Request) => {
    try {
      console.log("body", req.body);
      const { name, city, address, status } = req.body;
      if (!name || !city || !address || !status) {
        throw { message: "Missing parameters" };
      }
      const schoolData = {
        nombre: name,
        ciudad: city,
        direccion: address,
        estado: status,
      };
      this.service.createSchool(schoolData);
      return { status: true };
    } catch (error) {
      throw error;
    }
  };

  public createGrade = async (req: Request) => {
    try {
      console.log("body", req.body);
      const { name, schoolId } = req.body;
      if (!name || !schoolId) {
        throw { message: "Missing parameters" };
      }
      const schoolData = {
        nombre: name,
        colegio_id: schoolId,
      };
      this.service.createGrade(schoolData);
      return { status: true };
    } catch (error) {
      throw error;
    }
  };

  public gelAllSchools = () => {
    try {
      return this.service.gelAllSchools();
    } catch (error) {
      throw error;
    }
  };

  public getGrades = (req: Request) => {
    try {
      if (!req?.params?.idScholl) {
        throw { message: "Missing parameters" };
      }

      if (req?.params?.idScholl === "all") {
        return this.service.gelAllGrades();
      }
      return this.service.getGradesBySchool(req?.params?.idScholl);
    } catch (error) {
      throw error;
    }
  };

  public getStudents = (req: Request) => {
    try {
      if (!req?.params?.idGrade) {
        throw { message: "Missing parameters" };
      }

      return this.service.getStudentsByGrade(req?.params?.idGrade);
    } catch (error) {
      throw error;
    }
  };

  public manageStudents = (req: Request) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req?.body) {
          throw { message: "Missing parameters" };
        }

        const studentsData: Array<string[]> = req?.body?.excelData;
        const gradeId = req?.body?.selectedGrade;
        await this.service.deleteStudentsByGrade(gradeId);
        const arrayPromises: Promise<Alumno>[] = [];
        for (const iterator of studentsData) {
          const student: Partial<Alumno> = {
            nombre: iterator[0],
            cedula: iterator[1],
            curso_id: gradeId,
          };
          arrayPromises.push(this.service.createStudent(student));
        }
        await Promise.all(arrayPromises);
        resolve({ status: true });
      } catch (error) {
        reject(error);
      }
    });
  };
}
