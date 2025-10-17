import { Column, Table, Model, DataType } from "sequelize-typescript";

@Table({ tableName: 'usuarios' })
class Usuario extends Model {
    @Column({ 
        type: DataType.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    })
    declare rut_usuario: number;

    @Column({ 
        type: DataType.STRING(50), 
        allowNull: false, 
        unique: true 
    })
    declare nombre_usuario: string;

    @Column({ 
        type: DataType.STRING(100), 
        allowNull: false 
    })
    declare contraseña: string;

    @Column({ 
        type: DataType.ENUM('administrador', 'vendedor'), 
        allowNull: false 
    })
    declare rol: 'Administrador' | 'Vendedor';
}

export default Usuario;
