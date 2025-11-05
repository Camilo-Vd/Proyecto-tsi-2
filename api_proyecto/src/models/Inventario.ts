import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
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
        field: 'stock_actual'
    })
    declare stock_actual: number;
    Producto: any;
}

export default Inventario;
