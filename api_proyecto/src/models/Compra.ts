import { Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Proveedor from "./Proveedor";
import Detalle_compra from "./Detalle_compra";

@Table({ tableName: 'compras' })
class Compra extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare id_compra: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare fecha_compra: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare total_compra: number;

    @ForeignKey(() => Proveedor)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare rut_proveedor: number;

    @Column({
        type: DataType.ENUM('registrada', 'anulada'),
        defaultValue: 'registrada',
        allowNull: false
    })
    declare estado_compra: 'registrada' | 'anulada';

    @BelongsTo(() => Proveedor)
    declare proveedor: Proveedor;

    @HasMany(() => Detalle_compra)
    declare detalles: Detalle_compra[];
}export default Compra;
