// Archivo: modules/ranking.js
export function obtenerRanking(puntos, umbral = 300) {
    return puntos >= umbral ? "Veterano" : "Novato";
}
export function mostrarMensajeRanking(ranking) {
    return ranking === "Veterano"
        ? "¡Felicidades, eres un auténtico veterano de la aventura!"
        : "Has sido un novato, pero puedes mejorar tu puntuación.";
}
