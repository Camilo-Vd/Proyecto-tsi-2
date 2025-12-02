import { Column, Table, Model, DataType } from "sequelize-typescript";
import { formatearRUT } from "../utils/rutUtils";

@Table({ tableName: 'usuarios' })
class Usuario extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
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
        type: DataType.ENUM('Administrador', 'Vendedor'),
        allowNull: false
    })
    declare rol_usuario: 'Administrador' | 'Vendedor';

    /**
     * Getter para obtener el RUT formateado con dígito verificador
     * @returns RUT formateado (ej: "12.345.678-9")
     */
    get rutFormateado(): string {
        return formatearRUT(this.rut_usuario);
    }

    /**
     * Método para obtener representación JSON incluyendo RUT formateado
     */
    toJSON() {
        const values = super.toJSON();
        values.rut_usuario = this.rutFormateado; // Reemplaza el RUT sin formato
        return {
            ...values,
        };
    }
}

export default Usuario;