import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Categoria from "./Categoria";
import Inventario from "./Inventario";
import Proveedor from "./Proveedor";

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

    @ForeignKey(() => Categoria)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_categoria'
    })
    declare id_categoria: number;

    @ForeignKey(() => Proveedor)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'rut_proveedor'
    })
    declare rut_proveedor: number;

    @BelongsTo(() => Categoria)
    declare categoria: Categoria;

    @BelongsTo(() => Proveedor)
    declare proveedor: Proveedor;

    @HasMany(() => Inventario)
    declare inventarios: Inventario[];
}

export default Producto;
