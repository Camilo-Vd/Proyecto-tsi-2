import { Column, Table, Model, DataType } from "sequelize-typescript";
import { formatearRUT } from "../utils/rutUtils";

@Table({ tableName: 'clientes' })
class Cliente extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    declare rut_cliente: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare nombre_cliente: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare contacto_cliente: string;

    @Column({
        type: DataType.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
        allowNull: false
    })
    declare estado_cliente: 'activo' | 'inactivo';

    /**
     * Getter para obtener el RUT formateado con dígito verificador
     * @returns RUT formateado (ej: "12.345.678-9")
     */
    get rutFormateado(): string {
        return formatearRUT(this.rut_cliente);
    }

    /**
     * Método para obtener representación JSON incluyendo RUT formateado
     */
    toJSON() {
        const values = super.toJSON();
        values.rut_cliente = this.rutFormateado; // Reemplaza el RUT sin formato
        return {
            ...values,
        };
    }
}

export default Cliente;