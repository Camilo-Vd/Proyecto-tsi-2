import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Categoria from "./Categoria";
import Inventario from "./Inventario";

@Table({ tableName: 'productos', timestamps: false })
class Producto extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id_producto'
    })
    declare id_producto: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'nombre_producto'
    })
    declare nombre_producto: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'precio_unitario'
    })
    declare precio_unitario: number;

    @ForeignKey(() => Categoria)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_categoria'
    })
    declare id_categoria: number;

    @BelongsTo(() => Categoria)
    declare categoria: Categoria;

    @HasMany(() => Inventario)
    declare inventarios: Inventario[];
}

export default Producto;
