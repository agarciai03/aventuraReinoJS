// Archivo: modules/mercado.js
import { productosMercado } from "../utils/constants.js";
import { Producto } from "./producto.js";

// Devuelve lista de productos como instancias de Producto
export function obtenerProductosMercado() {
    return productosMercado.map(obj => new Producto(obj.nombre, obj.precio, obj.rareza, obj.tipo, obj.bonus, obj.imagen));
}
