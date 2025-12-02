import { Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Cliente from "./Cliente";
import Usuario from "./Usuario";
import DetalleVenta from "./Detalle_venta";

@Table({ tableName: 'ventas' })
class Venta extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare id_venta: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare fecha_hora_venta: Date;

    @Column({
        type: DataType.INTEGER, 
        allowNull: false
    })
    declare total_venta: number;

    @ForeignKey(() => Cliente)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare rut_cliente: number;

    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare rut_usuario: number;

    // Relaciones
    @BelongsTo(() => Cliente)
    declare cliente: Cliente;

    @BelongsTo(() => Usuario)
    declare usuario: Usuario;

    @HasMany(() => DetalleVenta)
    declare detalles: DetalleVenta[];
}export default Venta;
