import { Column, Table, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Proveedor from "./Proveedor";

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

    @BelongsTo(() => Proveedor)
    declare proveedor: Proveedor;
}export default Compra;
