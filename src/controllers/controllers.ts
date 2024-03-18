import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { Request } from "express";
import { Services } from "../services/services";
import Alumno from "../models/alumno.model";
import AdmZip from "adm-zip";
import fs from "fs";
import Foto from "../models/fotos.model";

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

  public getPhotos = async (req: Request) => {
    try {
      if (!req?.params?.idGrade) {
        throw { message: "Missing parameters" };
      }
      const images = await this.service.getPhotosByGrade(req?.params?.idGrade);
      images.forEach((photos: any) => {
        const imagen = photos.dataValues;
        const TYPED_ARRAY: any = new Uint8Array(imagen.imagen);
        const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
        const base64String = btoa(STRING_CHAR);
        const dataURL = "data:image/jpeg;base64," + base64String;
        imagen.imagen = dataURL;
      });
      return images;
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

  public uploadPhotos = (req: Request) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req?.body?.base64 || !req?.body?.gradeId) {
          throw { message: "Missing parameters" };
        }
        const base64Data = req.body.base64;
        const gradeId = req.body.gradeId;
        const zipData = Buffer.from(
          base64Data.replace(/^data:application\/zip;base64,/, ""),
          "base64"
        );
        fs.writeFileSync("temp.zip", zipData);
        const zip = new AdmZip("temp.zip");
        zip.extractAllTo("images", true);
        const imageFiles = fs.readdirSync("images");
        const images = imageFiles.filter((file) => file.endsWith(".jpg"));
        const validation = await this.validatePhotos(images, gradeId);
        if (validation.status) {
          await this.saveImages(images, gradeId);
          fs.rmSync("images", { recursive: true });
          resolve({ status: true });
        } else {
          fs.rmSync("images", { recursive: true });
          resolve({ status: validation.status, message: validation.error });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  private validatePhotos = (images: string[], gradeId: string) => {
    return new Promise<{ status: boolean; error?: string }>(async (resolve) => {
      const response = { status: false, error: "" };
      const students = await this.service.getStudentsByGrade(gradeId);

      const documentsList = students.map((x: any) => x.toJSON().cedula);
      const photoImagesList = images.map((y: any) => y.replace(/\.[^.]+$/, ""));
      console.log("students", documentsList);
      console.log("images", photoImagesList);
      if (documentsList.length === photoImagesList.length) {
        const diferences = [];
        for (let i = 0; i < documentsList.length; i++) {
          const elemento = documentsList[i];

          // Verifica si el elemento actual no está presente en el segundo array
          if (!photoImagesList.includes(elemento)) {
            diferences.push(elemento);
          }
        }

        if (diferences.length > 0) {
          response.error =
            "Por favor valide la informacion de los siguientes documentos: " +
            diferences.join(" - ");
        } else {
          response.status = true;
        }
      } else {
        response.error =
          "Por favor valide que la cantidad de fotografias y de alumnos es la misma";
      }
      resolve(response);
    });
  };

  private saveImages = (images: string[], gradeId: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.service.deletePhotosByGrade(gradeId);
        const arrayPromises = [];
        for (const file of images) {
          const data = fs.readFileSync(`images/${file}`);
          const photoData: Partial<Foto> = {
            imagen: data,
            curso_id: Number(gradeId),
            nombre: file.replace(/\.[^.]+$/, ""),
          };
          console.log("photoData", photoData);
          arrayPromises.push(this.service.createPhoto(photoData));
        }
        await Promise.all(arrayPromises);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
