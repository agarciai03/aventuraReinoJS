// Archivo: modules/jugador.js
export class Jugador {
    constructor(nombre, avatar = "img/personaje.png", vidaMax = 100) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.vida = vidaMax;
        this.vidaMax = vidaMax;
        this.inventario = [];
        this.puntos = 0;
    }
    añadirAlInventario(objeto) {
        this.inventario.push(objeto.clonar());
    }
    sumarPuntos(cantidad) {
        this.puntos += cantidad;
    }
    obtenerAtaqueTotal() {
        return this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'arma' ? obj.bonus.ataque : 0), 0);
    }
    obtenerDefensaTotal() {
        return this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'armadura' ? obj.bonus.defensa : 0), 0);
    }
    obtenerVidaTotal() {
        let vidaExtra = this.inventario.reduce((acc, obj) => acc + (obj.tipo === 'consumible' ? obj.bonus.curacion : 0), 0);
        return Math.min(this.vida + vidaExtra, this.vidaMax);
    }
}
