/**
 * Clase para el jugador principal.
 */
export class Jugador {
    /**
     * @param {string} nombre - Nombre del jugador
     * @param {string} avatar - (opcional) Ruta imagen avatar
     * @param {number} vidaMax - Vida máxima inicial
     */
    constructor(nombre, avatar = "img/personaje.png", vidaMax = 100) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.vida = vidaMax;
        this.vidaMax = vidaMax;
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
     * Calcula el ataque total por armas del inventario.
     * @returns {number}
     */
    obtenerAtaqueTotal() {
        return this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'arma' ? obj.bonus.ataque : 0), 0);
    }
    /**
     * Calcula la defensa total por armaduras del inventario.
     * @returns {number}
     */
    obtenerDefensaTotal() {
        return this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'armadura' ? obj.bonus.defensa : 0), 0);
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
