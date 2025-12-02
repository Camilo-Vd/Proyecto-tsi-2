import { Column, Table, Model, DataType, HasMany } from "sequelize-typescript";
import { formatearRUT } from "../utils/rutUtils";
import Producto from "./Producto";

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

    @HasMany(() => Producto)
    declare productos: Producto[];

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
