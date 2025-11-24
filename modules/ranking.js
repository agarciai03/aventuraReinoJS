/**
 * Obtiene el rango del jugador según los puntos.
 * @param {number} puntos - Puntuación final.
 * @param {number} [umbral=300] - Umbral para veterano.
 * @returns {string} 'Veterano' o 'Novato'.
 */
export function obtenerRanking(puntos, umbral = 300) {
    return puntos >= umbral ? "Veterano" : "Novato";
}

/**
 * Muestra mensaje final personalizado según ranking.
 * @param {string} ranking - 'Veterano' o 'Novato'.
 * @returns {string} Mensaje personalizado.
 */
export function mostrarMensajeRanking(ranking) {
    return ranking === "Veterano"
        ? "¡Felicidades, eres un auténtico veterano de la aventura!"
        : "Has sido un novato, pero puedes mejorar tu puntuación.";
}
