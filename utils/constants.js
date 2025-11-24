/** Oro inicial del jugador */
export const ORO_INICIAL = 500;

/** Vida máxima inicial del jugador */
export const VIDA_INICIAL = 100;

/** Puntos necesarios para ser Veterano */
export const MINIMO_VETERANO = 300;

/** Productos del mercado (array de objetos) */
export const productosMercado = [
    { nombre: 'Espada corta', precio: 950, rareza: 'común', tipo: 'arma', bonus: { ataque: 8 }, imagen: 'img/axe.png' },
    { nombre: 'Arco de caza', precio: 1200, rareza: 'común', tipo: 'arma', bonus: { ataque: 7 }, imagen: 'img/b_t_01.png' },
    { nombre: 'Armadura de cuero', precio: 1350, rareza: 'común', tipo: 'armadura', bonus: { defensa: 6 }, imagen: 'img/armor.png' },
    { nombre: 'Poción pequeña', precio: 200, rareza: 'común', tipo: 'consumible', bonus: { curacion: 20 }, imagen: 'img/apple.png' },
    { nombre: 'Espada rúnica', precio: 1700, rareza: 'raro', tipo: 'arma', bonus: { ataque: 18 }, imagen: 'img/axe.png' },
    { nombre: 'Escudo de roble', precio: 1100, rareza: 'raro', tipo: 'armadura', bonus: { defensa: 14 }, imagen: 'img/shield.png' },
    { nombre: 'Poción grande', precio: 800, rareza: 'raro', tipo: 'consumible', bonus: { curacion: 60 }, imagen: 'img/hp.png' },
    { nombre: 'Mandoble épico', precio: 2400, rareza: 'épico', tipo: 'arma', bonus: { ataque: 32 }, imagen: 'img/axe.png' },
    { nombre: 'Placas dracónicas', precio: 2200, rareza: 'épico', tipo: 'armadura', bonus: { defensa: 28 }, imagen: 'img/helmets.png' },
    { nombre: 'Elixir legendario', precio: 800, rareza: 'épico', tipo: 'consumible', bonus: { curacion: 150 }, imagen: 'img/hp.png' }
];

/** Enemigos básicos */
export const enemigosLista = [
    { nombre: 'Goblin', avatar: 'img/goblin.png', ataque: 15, vida: 50 },
    { nombre: 'Orco', avatar: 'img/orco.png', ataque: 25, vida: 80 },
    { nombre: 'Dragón', avatar: 'img/dragon.png', ataque: 40, vida: 150 }
];

/** Jefe final */
export const jefeFinal = {
    nombre: 'Señor Oscuro', avatar: 'img/jefe.png', ataque: 55, vida: 200, multiplicador: 1.2
};

