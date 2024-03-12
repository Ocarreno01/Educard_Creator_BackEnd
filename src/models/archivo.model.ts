import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import Alumno from "./alumno.model";

@Table({ modelName: "archivos" })
export default class Archivo extends Model {
  @Column
  nombreArchivo!: string;

  @Column
  tipoArchivo!: string;

  @ForeignKey(() => Alumno)
  @Column
  alumnoId!: number;
}
