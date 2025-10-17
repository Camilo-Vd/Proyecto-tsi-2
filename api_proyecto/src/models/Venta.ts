import { Column, Table, Model, DataType, ForeignKey } from "sequelize-typescript";
import Cliente from "./Cliente";  // asegúrate de tener definido este modelo (falta por crear)
import Usuario from "./Usuario";  // ya lo tienes creado (este se tienen que modificar de acuerdo a la bd)

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
    declare fecha_hora: Date;

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare total_venta: number;

    @ForeignKey(() => Cliente)
    @Column({ 
        type: DataType.STRING(12), 
        allowNull: false 
    })
    declare rut_cliente: string;

    @ForeignKey(() => Usuario)
    @Column({ 
        type: DataType.STRING(12), 
        allowNull: false 
    })
    declare rut_usuario: string;
}

export default Venta;
