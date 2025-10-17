import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: 'categorias' })
class Categoria extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare id_categoria: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare nombre_categoria: string;
}

export default Categoria;
