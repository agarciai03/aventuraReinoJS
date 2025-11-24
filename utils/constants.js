// Archivo: utils/constants.js
export const ORO_INICIAL = 500;
export const VIDA_JUGADOR = 100;
export const UMBRAL_VETERANO = 300;

export const productosMercado = [
    { nombre: 'Espada corta', precio: 40, rareza: 'común', tipo: 'arma', bonus: { ataque: 8 }, imagen: 'img/axe.png' },
    { nombre: 'Arco de caza', precio: 50, rareza: 'común', tipo: 'arma', bonus: { ataque: 7 }, imagen: 'img/b_t_01.png' },
    { nombre: 'Armadura de cuero', precio: 65, rareza: 'común', tipo: 'armadura', bonus: { defensa: 6 }, imagen: 'img/armor.png' },
    { nombre: 'Poción pequeña', precio: 15, rareza: 'común', tipo: 'consumible', bonus: { curacion: 20 }, imagen: 'img/apple.png' },
    { nombre: 'Espada rúnica', precio: 135, rareza: 'raro', tipo: 'arma', bonus: { ataque: 18 }, imagen: 'img/axe.png' },
    { nombre: 'Escudo de roble', precio: 130, rareza: 'raro', tipo: 'armadura', bonus: { defensa: 14 }, imagen: 'img/shield.png' },
    { nombre: 'Poción grande', precio: 40, rareza: 'raro', tipo: 'consumible', bonus: { curacion: 60 }, imagen: 'img/hp.png' },
    { nombre: 'Mandoble épico', precio: 210, rareza: 'épico', tipo: 'arma', bonus: { ataque: 32 }, imagen: 'img/axe.png' },
    { nombre: 'Placas dracónicas', precio: 220, rareza: 'épico', tipo: 'armadura', bonus: { defensa: 28 }, imagen: 'img/helmets.png' },
    { nombre: 'Elixir legendario', precio: 90, rareza: 'épico', tipo: 'consumible', bonus: { curacion: 150 }, imagen: 'img/hp.png' }
];

// Archivo: utils/constants.js
export const enemigosLista = [
    { nombre: 'Goblin', ataque: 15, vida: 50, avatar: 'img/goblin.png' },
    { nombre: 'Orco', ataque: 25, vida: 80, avatar: 'img/orco.png' },
    { nombre: 'Dragón', ataque: 40, vida: 150, avatar: 'img/dragon.png' }
];

export const jefeFinal = {
    nombre: 'Jefe Final',
    ataque: 55,
    vida: 200,
    multiplicador: 1.2,
    avatar: 'img/finalboss.png'
};

