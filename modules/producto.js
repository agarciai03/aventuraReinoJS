/**
 * Clase Producto para crear objetos del mercado.
 */
export class Producto {
    /**
     * @param {string} nombre
     * @param {number} precio
     * @param {string} rareza
     * @param {string} tipo
     * @param {Object} bonus
     * @param {string} imagen
     */
    constructor(nombre, precio, rareza, tipo, bonus, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
        this.imagen = imagen;
    }
    /**
     * Aplica un descuento y devuelve una copia modificada.
     * @param {number} porcentaje - Descuento a aplicar
     * @returns {Producto} Nuevo producto con descuento
     */
    aplicarDescuento(porcentaje) {
        const nuevo = this.precio - (this.precio * porcentaje / 100);
        return new Producto(this.nombre, Math.round(nuevo), this.rareza, this.tipo, this.bonus, this.imagen);
    }
    /**
     * Devuelve un texto con el bonus principal.
     * @returns {string}
     */
    mostrarBonus() {
        if (this.tipo === 'arma') return "Ataque +" + this.bonus.ataque;
        if (this.tipo === 'armadura') return "Defensa +" + this.bonus.defensa;
        if (this.tipo === 'consumible') return "Curación +" + this.bonus.curacion;
        return "";
    }
    /**
     * Clona el producto para el inventario.
     * @returns {Producto}
     */
    clonar() {
        return new Producto(this.nombre, this.precio, this.rareza, this.tipo, { ...this.bonus }, this.imagen);
    }
}
