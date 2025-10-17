import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Compra from "./Compra";
import Producto from "./Producto";

@Table({ tableName: 'detalle_compra', timestamps: false })
class DetalleCompra extends Model {
    @ForeignKey(() => Compra)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_compra'
    })
    declare id_compra: number;

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
        field: 'cantidad_adquirida'
    })
    declare cantidad_adquirida: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'precio_unitario'
    })
    declare precio_unitario: number;

    @BelongsTo(() => Compra)
    declare compra: Compra;

    @BelongsTo(() => Producto)
    declare producto: Producto;
}

export default DetalleCompra;
