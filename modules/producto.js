// Archivo: modules/producto.js
export class Producto {
    constructor(nombre, precio, rareza, tipo, bonus, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
        this.imagen = imagen;
    }
    aplicarDescuento(porcentaje) {
        const nuevo = this.precio - (this.precio * porcentaje / 100);
        return new Producto(this.nombre, Math.round(nuevo), this.rareza, this.tipo, this.bonus, this.imagen);
    }
    mostrarBonus() {
        if (this.tipo === 'arma') return "Ataque +" + this.bonus.ataque;
        if (this.tipo === 'armadura') return "Defensa +" + this.bonus.defensa;
        if (this.tipo === 'consumible') return "Curación +" + this.bonus.curacion;
        return "";
    }
    clonar() {
        return new Producto(this.nombre, this.precio, this.rareza, this.tipo, { ...this.bonus }, this.imagen);
    }
}
