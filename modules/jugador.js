/**
 * Clase para el jugador principal.
 */
export class Jugador {
    /**
     * Crea un nuevo jugador con estadísticas base.
     * @param {string} nombre - Nombre del jugador
     * @param {string} avatar - Ruta imagen avatar
     * @param {number} vida - Vida inicial establecida en el formulario
     * @param {number} ataque - Ataque base establecido en el formulario
     * @param {number} defensa - Defensa base establecida en el formulario
     */
    constructor(nombre, avatar = "img/personaje.png", vida, ataque, defensa) {
        this.nombre = nombre;
        this.avatar = avatar;

        // Stats base 
        this.vidaMax = vida;
        this.vida = vida;
        this.ataqueBase = ataque;
        this.defensaBase = defensa;

        // Dinero inicial
        this.dinero = 500;

        this.inventario = [];
        this.puntos = 0;
    }

    /**
     * Añade un objeto (producto) al inventario.
     * @param {Object} objeto - Instancia de Producto a añadir.
     */
    añadirAlInventario(objeto) {
        this.inventario.push(objeto.clonar());
    }

    /**
     * Suma puntos a la puntuación del jugador.
     * @param {number} cantidad - Cantidad de puntos a sumar.
     */
    sumarPuntos(cantidad) {
        this.puntos += cantidad;
    }

    /**
     * Calcula el ataque total sumando la base y los objetos del inventario.
     * @returns {number} Ataque total calculado.
     */
    obtenerAtaqueTotal() {
        let ataqueObjetos = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'arma' ? obj.bonus.ataque : 0), 0);
        return this.ataqueBase + ataqueObjetos;
    }

    /**
     * Calcula la defensa total sumando la base y las armaduras.
     * @returns {number} Defensa total calculada.
     */
    obtenerDefensaTotal() {
        let defensaObjetos = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'armadura' ? obj.bonus.defensa : 0), 0);
        return this.defensaBase + defensaObjetos;
    }

    /**
     * Calcula la vida actual teniendo en cuenta posibles bonificadores, sin superar la máxima.
     * @returns {number} Vida total actual.
     */
    obtenerVidaTotal() {
        let vidaExtra = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'consumible' ? obj.bonus.curacion : 0), 0);
        return Math.min(this.vida + vidaExtra, this.vidaMax);
    }
}