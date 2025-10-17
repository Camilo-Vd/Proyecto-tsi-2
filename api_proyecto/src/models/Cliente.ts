import { Column, Table, Model, DataType } from "sequelize-typescript";

@Table({ tableName: 'clientes' })
class Cliente extends Model {
    @Column({ 
        type: DataType.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    })
    declare rut_cliente: number;

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
}

export default Cliente;
