import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: 'tallas' })
class Talla extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare id_talla: number;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    declare nombre_talla: string;

}

export default Talla;
