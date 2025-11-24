/**
 * Clase que representa un enemigo normal.
 */
export class Enemigo {
    /**
     * @param {string} nombre - Nombre del enemigo
     * @param {string} avatar - Imagen del enemigo
     * @param {number} ataque - Nivel de ataque
     * @param {number} vida - Vida del enemigo
     */
    constructor(nombre, avatar, ataque, vida) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.ataque = ataque;
        this.vida = vida;
    }
}

/**
 * Subclase para Jefes, hereda de enemigo.
 */
export class Jefe extends Enemigo {
    /**
     * @param {string} nombre
     * @param {string} avatar
     * @param {number} ataque
     * @param {number} vida
     * @param {number} multiplicador - Multiplicador de puntos/daño
     */
    constructor(nombre, avatar, ataque, vida, multiplicador = 1.2) {
        super(nombre, avatar, ataque, vida);
        this.multiplicador = multiplicador;
    }

    /**
     * Calcula los puntos al derrotar al jefe.
     * @returns {number}
     */
    calcularPuntosDerrota() {
        return Math.round((100 + this.ataque) * this.multiplicador);
    }
}
