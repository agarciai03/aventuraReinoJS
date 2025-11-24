// Archivo: modules/batallas.js
export function combate(jugador, enemigo) {
    let vidaJugador = jugador.vida;
    let vidaEnemigo = enemigo.vida;
    let defensa = jugador.obtenerDefensaTotal();
    let ataqueJugador = jugador.obtenerAtaqueTotal();
    let registro = [];

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        vidaEnemigo -= ataqueJugador;
        registro.push(`El jugador ataca y hace ${ataqueJugador} de daño`);
        if (vidaEnemigo <= 0) break;
        let dañoEnemigo = enemigo.ataque - defensa;
        if (dañoEnemigo < 1) dañoEnemigo = 1;
        vidaJugador -= dañoEnemigo;
        registro.push(`${enemigo.nombre} ataca y hace ${dañoEnemigo} de daño`);
    }
    let ganador = vidaJugador > 0 ? "jugador" : "enemigo";
    let puntos = 0;
    if (ganador === "jugador") {
        puntos = 100 + enemigo.ataque;
        if (enemigo.multiplicador) puntos = Math.round(puntos * enemigo.multiplicador);
    }
    return { ganador, puntos: ganador === "jugador" ? puntos : 0, registro };
}
