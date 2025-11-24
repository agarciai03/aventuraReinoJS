/**
 * Filtra una lista de productos por rareza.
 * @param {Array} lista - Lista de productos u objetos.
 * @param {string} rareza - Rareza a buscar ('común', 'raro', 'épico', etc).
 * @returns {Array} Lista filtrada por rareza.
 */
export function filtrarPorRareza(lista, rareza) {
    return lista.filter(x => x.rareza === rareza);
}

/**
 * Busca un producto por nombre.
 * @param {Array} lista - Lista de productos.
 * @param {string} nombre - Nombre a buscar.
 * @returns {Object|undefined} Primer elemento cuyo nombre coincide.
 */
export function buscarPorNombre(lista, nombre) {
    return lista.find(x => x.nombre === nombre);
}

/**
 * Aplica un descuento a todos los objetos de una rareza concreta.
 * @param {Array} lista - Lista de productos.
 * @param {string} rareza - Rareza sobre la que aplicar descuento.
 * @param {number} porcentaje - Porcentaje de descuento (ej: 15).
 * @returns {Array} Nueva lista con descuento aplicado.
 */
export function aplicarDescuentoPorRareza(lista, rareza, porcentaje) {
    return lista.map(item => item.rareza === rareza ? { ...item, precio: Math.round(item.precio * (1 - porcentaje / 100)) } : item);
}

/**
 * Formatea el precio en monedas.
 * @param {number} precio - Precio en número.
 * @returns {string} Precio formateado con texto.
 */
export function formatearPrecio(precio) {
    return (precio) + " monedas";
}

/**
 * Devuelve el ranking según los puntos y el umbral.
 * @param {number} puntos - Puntuación del jugador.
 * @param {number} [umbral=300] - Umbral para veterano.
 * @returns {string} 'Veterano' o 'Novato'.
 */
export function comprobarRanking(puntos, umbral = 300) {
    return puntos >= umbral ? "Veterano" : "Novato";
}
