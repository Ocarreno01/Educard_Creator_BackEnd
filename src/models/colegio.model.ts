import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "colegios" })
export default class Colegio extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  nombre!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  direccion!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  ciudad!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  estado!: string;
}
