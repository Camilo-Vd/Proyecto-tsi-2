import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Venta from "./Venta";
import Producto from "./Producto";
import Talla from "./Talla";

@Table({ tableName: 'detalle_venta', timestamps: false })
class DetalleVenta extends Model {
    @ForeignKey(() => Venta)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_venta'
    })
    declare id_venta: number;

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
        field: 'cantidad_vendida'
    })
    declare cantidad_vendida: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'precio_unitario_venta'
    })
    declare precio_unitario_venta: number;

    @BelongsTo(() => Venta)
    declare venta: Venta;

    @BelongsTo(() => Producto)
    declare producto: Producto;

    @BelongsTo(() => Talla)
    declare talla: Talla;
}

export default DetalleVenta;
