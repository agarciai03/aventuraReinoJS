// Archivo: modules/enemigos.js
export class Enemigo {
    constructor(nombre, avatar, ataque, vida) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.ataque = ataque;
        this.vida = vida;
    }
}
export class Jefe extends Enemigo {
    constructor(nombre, avatar, ataque, vida, multiplicador = 1.2) {
        super(nombre, avatar, ataque, vida);
        this.multiplicador = multiplicador;
    }
    calcularPuntosDerrota() {
        return Math.round((100 + this.ataque) * this.multiplicador);
    }
}
