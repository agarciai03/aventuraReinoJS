// Archivo: utils/constants.js

/** Oro inicial del jugador */
export const ORO_INICIAL = 500;
/** Vida inicial del jugador */
export const VIDA_JUGADOR = 100;
/** Puntos necesarios para ser Veterano */
export const UMBRAL_VETERANO = 300;

/**
 * @typedef {Object} ProductoMercado
 * @property {string} nombre
 * @property {number} precio
 * @property {string} rareza
 * @property {string} tipo
 * @property {Object} bonus
 * @property {string} imagen
 */
/** Lista de productos disponibles en el mercado */
export const productosMercado = [
    { nombre: 'Espada corta', precio: 30, rareza: 'común', tipo: 'arma', bonus: { ataque: 8 }, imagen: 'img/axe.png' },
    { nombre: 'Arco de caza', precio: 40, rareza: 'común', tipo: 'arma', bonus: { ataque: 7 }, imagen: 'img/b_t_01.png' },
    { nombre: 'Armadura de cuero', precio: 55, rareza: 'común', tipo: 'armadura', bonus: { defensa: 6 }, imagen: 'img/armor.png' },
    { nombre: 'Poción pequeña', precio: 15, rareza: 'común', tipo: 'consumible', bonus: { curacion: 20 }, imagen: 'img/apple.png' },
    { nombre: 'Espada rúnica', precio: 105, rareza: 'raro', tipo: 'arma', bonus: { ataque: 18 }, imagen: 'img/axe.png' },
    { nombre: 'Escudo de roble', precio: 100, rareza: 'raro', tipo: 'armadura', bonus: { defensa: 14 }, imagen: 'img/shield.png' },
    { nombre: 'Poción grande', precio: 30, rareza: 'raro', tipo: 'consumible', bonus: { curacion: 60 }, imagen: 'img/hp.png' },
    { nombre: 'Mandoble épico', precio: 180, rareza: 'épico', tipo: 'arma', bonus: { ataque: 32 }, imagen: 'img/axe.png' },
    { nombre: 'Placas dracónicas', precio: 160, rareza: 'épico', tipo: 'armadura', bonus: { defensa: 28 }, imagen: 'img/helmets.png' },
    { nombre: 'Elixir legendario', precio: 65, rareza: 'épico', tipo: 'consumible', bonus: { curacion: 150 }, imagen: 'img/hp.png' }
];

/**
 * @typedef {Object} EnemigoDatos
 * @property {string} nombre
 * @property {number} ataque
 * @property {number} vida
 * @property {string} avatar
 */
/** Lista de enemigos normales */
export const enemigosLista = [
    { nombre: 'Goblin', ataque: 15, vida: 50, avatar: 'img/goblin.png' },
    { nombre: 'Orco', ataque: 25, vida: 80, avatar: 'img/orco.png' },
    { nombre: 'Dragón', ataque: 40, vida: 150, avatar: 'img/dragon.png' }
];

/**
 * @typedef {Object} JefeFinal
 * @property {string} nombre
 * @property {number} ataque
 * @property {number} vida
 * @property {number} multiplicador
 * @property {string} avatar
 */
/** Jefe final de la aventura */
export const jefeFinal = {
    nombre: 'Jefe Final',
    ataque: 55,
    vida: 200,
    multiplicador: 1.2,
    avatar: 'img/finalboss.png'
};