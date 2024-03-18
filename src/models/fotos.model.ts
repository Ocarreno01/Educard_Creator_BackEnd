import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Curso from "./curso.model";

@Table({ tableName: "fotos" })
export default class Foto extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.BLOB, allowNull: false })
  imagen!: Buffer;

  @Column({ type: DataType.STRING(100), allowNull: false })
  nombre!: string;

  @ForeignKey(() => Curso)
  @Column({ type: DataType.INTEGER, allowNull: false })
  curso_id!: number;
}
