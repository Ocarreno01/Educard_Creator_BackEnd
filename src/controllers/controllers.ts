import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { Request } from "express";
import { Services } from "../services/services";

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
}
