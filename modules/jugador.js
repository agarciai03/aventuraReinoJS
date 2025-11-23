// Clase Jugador de la aventura

/**
 * Clase que representa al jugador del juego.
 * Guarda nombre, vida, inventario y puntos.
 */
export class Jugador {
    /**
     * Crea un jugador nuevo.
     * @param {string} nombre - Nombre del jugador
     * @param {number} vida - Vida inicial
     */
    constructor(nombre, vida = 100) {
        this.nombre = nombre;        
        this.vida = vida;             
        this.vidaMax = vida;          
        this.inventario = [];         
        this.puntos = 0;              
    }

    /**
     * Añade un objeto al inventario del jugador.
     * @param {object} item Producto comprado.
     */
    añadirItem(item) {
        this.inventario.push(item);
    }

    /**
     * Suma puntos al jugador.
     * @param {number} cantidad Puntos a añadir.
     */
    ganarPuntos(cantidad) {
        this.puntos += cantidad;
    }

    /**
     * Calcula el ataque total (con bonus)
     * @returns {number} Ataque total.
     */
    get ataqueTotal() {
        let total = 0;
        for (let objeto of this.inventario) {
            if (objeto.bonus && objeto.bonus.ataque)
                total += objeto.bonus.ataque;
        }
        return total;
    }

    /**
     * Calcula la defensa total (con bonus)
     * @returns {number} Defensa total.
     */
    get defensaTotal() {
        let total = 0;
        for (let objeto of this.inventario) {
            if (objeto.bonus && objeto.bonus.defensa)
                total += objeto.bonus.defensa;
        }
        return total;
    }

    /**
     * Suma vida (total) si hay objetos de tipo consumible con bonus curacion.
     */
    usarConsumibles() {
        for (let item of this.inventario) {
            if (item.tipo === 'consumible' && item.bonus.curacion) {
                this.vida += item.bonus.curacion;
            }
        }
        // Si la vida supera el máximo, la ajustamos.
        if (this.vida > this.vidaMax) this.vida = this.vidaMax;
    }

    /**
     * Reinicia el jugador para una partida nueva.
     */
    reiniciar(nombre, vida = 100) {
        this.nombre = nombre;
        this.vida = vida;
        this.vidaMax = vida;
        this.inventario = [];
        this.puntos = 0;
    }
}