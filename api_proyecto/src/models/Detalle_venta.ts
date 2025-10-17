import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Venta from "./Venta";
import Producto from "./Producto";

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
}

export default DetalleVenta;
