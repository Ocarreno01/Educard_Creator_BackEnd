import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import Curso from "./curso.model"; // Importa el modelo de curso si es necesario

@Table({ modelName: "alumnos" })
export default class Alumno extends Model {
  @Column
  nombre!: string;

  @Column
  cedula!: string;

  @ForeignKey(() => Curso)
  @Column
  curso_id!: number;
}
