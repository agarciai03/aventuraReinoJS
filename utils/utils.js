export function filtrarPorRareza(lista, rareza) {
    return lista.filter(x => x.rareza === rareza);
}

export function buscarPorNombre(lista, nombre) {
    return lista.find(x => x.nombre === nombre);
}

export function aplicarDescuentoPorRareza(lista, rareza, porcentaje) {
    return lista.map(item => item.rareza === rareza ? { ...item, precio: Math.round(item.precio * (1 - porcentaje / 100)) } : item);
}

export function formatearPrecio(precio) {
    return (precio) + " monedas";
}

export function comprobarRanking(puntos, umbral = 300) {
    return puntos >= umbral ? "Veterano" : "Novato";
}
