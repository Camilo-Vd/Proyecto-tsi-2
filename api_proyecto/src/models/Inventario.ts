import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Producto from "./Producto";
import Talla from "./Talla";

@Table({ tableName: 'inventario', timestamps: false })
class Inventario extends Model {
    @ForeignKey(() => Producto)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_producto'
    })
    declare id_producto: number;

    @ForeignKey(() => Talla)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_talla'
    })
    declare id_talla: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'precio_unitario'
    })
    declare precio_unitario: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'stock_actual'
    })
    declare stock_actual: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 5,
        field: 'stock_critico'
    })
    declare stock_critico: number;

    @BelongsTo(() => Producto, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    declare producto: Producto;

    @BelongsTo(() => Talla, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    declare talla: Talla;
}

export default Inventario;
