/**
 * Clase para el jugador principal.
 */
export class Jugador {
    /**
     * @param {string} nombre - Nombre del jugador
     * @param {string} avatar - Ruta imagen avatar
     * @param {number} vida - Vida inicial establecida en el formulario
     * @param {number} ataque - Ataque base establecido en el formulario
     * @param {number} defensa - Defensa base establecida en el formulario
     */
    constructor(nombre, avatar = "img/personaje.png", vida, ataque, defensa) {
        this.nombre = nombre;
        this.avatar = avatar;

        // Stats base del formulario
        this.vidaMax = vida;
        this.vida = vida;
        this.ataqueBase = ataque;
        this.defensaBase = defensa;

        // Nuevo requisito: Dinero inicial
        this.dinero = 500;

        this.inventario = [];
        this.puntos = 0;
    }

    añadirAlInventario(objeto) {
        this.inventario.push(objeto.clonar());
    }

    sumarPuntos(cantidad) {
        this.puntos += cantidad;
    }

    // AHORA el ataque es: lo que pusiste en el formulario + las armas
    obtenerAtaqueTotal() {
        let ataqueObjetos = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'arma' ? obj.bonus.ataque : 0), 0);
        return this.ataqueBase + ataqueObjetos;
    }

    // AHORA la defensa es: lo que pusiste en el formulario + las armaduras
    obtenerDefensaTotal() {
        let defensaObjetos = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'armadura' ? obj.bonus.defensa : 0), 0);
        return this.defensaBase + defensaObjetos;
    }

    obtenerVidaTotal() {
        let vidaExtra = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'consumible' ? obj.bonus.curacion : 0), 0);
        return Math.min(this.vida + vidaExtra, this.vidaMax);
    }
}