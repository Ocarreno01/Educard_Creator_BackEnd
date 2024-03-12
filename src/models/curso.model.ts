import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import Colegio from "./colegio.model";

@Table({ modelName: "cursos" })
export default class Curso extends Model {
  @Column
  nombre!: string;

  @ForeignKey(() => Colegio)
  @Column
  colegio_id!: number;
}
