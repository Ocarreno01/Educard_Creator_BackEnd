import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import AlumnoModel from "./alumno.model";

@Table({ modelName: "pdfs" })
export default class Pdf extends Model {
  @Column
  nombre_archivo!: string;

  @ForeignKey(() => AlumnoModel)
  @Column
  alumno_id!: number;
}
