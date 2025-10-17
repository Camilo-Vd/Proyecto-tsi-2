import { Column, Table, Model, DataType, ForeignKey } from "sequelize-typescript";
import Proveedor from "./Proveedor";  // este modelo debería estar definido

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
        type: DataType.STRING(12), 
        allowNull: false 
    })
    declare rut_proveedor: string;
}

export default Compra;
