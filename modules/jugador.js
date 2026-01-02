/**
 * Clase para el jugador principal.
 */
export class Jugador {
    /**
     * @param {string} nombre - Nombre del jugador
     * @param {string} avatar - Ruta imagen avatar
     * @param {number} vidaMax - Vida máxima inicial
     * @param {number} ataqueBase - Ataque base del formulario
     * @param {number} defensaBase - Defensa base del formulario
     */
    constructor(nombre, avatar = "img/personaje.png", vidaMax, ataqueBase, defensaBase) {
        this.nombre = nombre;
        this.avatar = avatar;

        this.vida = vidaMax;
        this.vidaMax = vidaMax;

        this.ataqueBase = ataqueBase;
        this.defensaBase = defensaBase;
        this.oro = 500; 

        this.inventario = [];
        this.puntos = 0;
    }

    /**
     * Añade un objeto (producto) al inventario.
     * @param {Producto} objeto - Producto a añadir
     */
    añadirAlInventario(objeto) {
        this.inventario.push(objeto.clonar());
    }

    /**
     * Suma puntos al jugador.
     * @param {number} cantidad
     */
    sumarPuntos(cantidad) {
        this.puntos += cantidad;
    }

    /**
     * Calcula el ataque total: Base + Armas.
     * @returns {number}
     */
    obtenerAtaqueTotal() {
        let bonoInventario = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'arma' ? obj.bonus.ataque : 0), 0);
        return this.ataqueBase + bonoInventario;
    }

    /**
     * Calcula la defensa total: Base + Armaduras.
     * @returns {number}
     */
    obtenerDefensaTotal() {
        let bonoInventario = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'armadura' ? obj.bonus.defensa : 0), 0);
        return this.defensaBase + bonoInventario;
    }

    /**
     * Calcula la vida total sumando efectos de consumibles.
     * @returns {number}
     */
    obtenerVidaTotal() {
        let vidaExtra = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'consumible' ? obj.bonus.curacion : 0), 0);
        return Math.min(this.vida + vidaExtra, this.vidaMax);
    }
}