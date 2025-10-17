import { Column, Table, Model, DataType } from "sequelize-typescript";

@Table({ tableName: 'proveedores' })
class Proveedor extends Model {
    @Column({ 
        type: DataType.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    })
    declare rut_proveedor: number;

    @Column({ 
        type: DataType.STRING(100), 
        allowNull: false 
    })
    declare nombre: string;

    @Column({ 
        type: DataType.STRING(100), 
        allowNull: false 
    })
    declare contacto: string;

    @Column({ 
        type: DataType.STRING(150), 
        allowNull: false 
    })
    declare direccion: string;
}

export default Proveedor;
