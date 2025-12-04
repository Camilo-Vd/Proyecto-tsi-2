import { Column, Table, Model, DataType } from "sequelize-typescript";
import { formatearRUT } from "../utils/rutUtils";

@Table({ tableName: 'proveedores' })
class Proveedor extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
    })
    declare rut_proveedor: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare nombre_proveedor: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare contacto_proveedor: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false
    })
    declare direccion_proveedor: string;

    @Column({
        type: DataType.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
        allowNull: false
    })
    declare estado_proveedor: 'activo' | 'inactivo';

    /**
     * Getter para obtener el RUT formateado con dígito verificador
     * @returns RUT formateado (ej: "12.345.678-9")
     */
    get rutFormateado(): string {
        return formatearRUT(this.rut_proveedor);
    }

    /**
     * Método para obtener representación JSON incluyendo RUT formateado
     */
    toJSON() {
        const values = super.toJSON();
        values.rut_proveedor = this.rutFormateado; // Reemplaza el RUT sin formato
        return {
            ...values,
        };
    }
}

export default Proveedor;
