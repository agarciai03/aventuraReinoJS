function showScene(id) {
  let escenas = document.querySelectorAll('.scene');
  for (let i = 0; i < escenas.length; i++) {
    escenas[i].classList.remove('active');
  }
  document.getElementById(id).classList.add('active');
}

class Producto {
  constructor(nombre, precio, rareza, tipo, bonus, imagen) {
    this.nombre = nombre;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
    this.imagen = imagen; 
  }

  aplicarDescuento(porcentaje) {
    let nuevo = this.precio - (this.precio * porcentaje / 100);
    return new Producto(this.nombre, Math.round(nuevo), this.rareza, this.tipo, this.bonus, this.imagen);
  }
}

class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.vida = 100;
    this.vidaMax = 100;
    this.inventario = [];
    this.puntos = 0;
  }

  añadirItem(item) {
    this.inventario.push(item);
  }

  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  get ataqueTotal() {
    let total = 0;
    for (let i = 0; i < this.inventario.length; i++) {
      if (this.inventario[i].bonus.ataque) {
        total += this.inventario[i].bonus.ataque;
      }
    }
    return total;
  }

  get defensaTotal() {
    let total = 0;
    for (let i = 0; i < this.inventario.length; i++) {
      if (this.inventario[i].bonus.defensa) {
        total += this.inventario[i].bonus.defensa;
      }
    }
    return total;
  }
}

class Enemigo {
  constructor(nombre, ataque, vida) {
    this.nombre = nombre;
    this.ataque = ataque;
    this.vida = vida;
  }
}

let mercado = [
  new Producto('Espada corta', 60, 'común', 'arma', { ataque: 8 }, 'img/axe.png'),
  new Producto('Arco de caza', 70, 'común', 'arma', { ataque: 7 }, 'img/b_t_01.png'),
  new Producto('Armadura de cuero', 90, 'común', 'armadura', { defensa: 6 }, 'img/armor.png'),
  new Producto('Poción pequeña', 20, 'común', 'consumible', { curacion: 20 }, 'img/apple.png'),
  new Producto('Espada rúnica', 200, 'raro', 'arma', { ataque: 18 }, 'img/axe.png'),
  new Producto('Escudo de roble', 160, 'raro', 'armadura', { defensa: 14 }, 'img/shield.png'),
  new Producto('Poción grande', 60, 'raro', 'consumible', { curacion: 60 }, 'img/hp.png'),
  new Producto('Mandoble épico', 300, 'épico', 'arma', { ataque: 32 }, 'img/axe.png'),
  new Producto('Placas dracónicas', 320, 'épico', 'armadura', { defensa: 28 }, 'img/helmets.png'), 
  new Producto('Elixir legendario', 120, 'épico', 'consumible', { curacion: 150 }, 'img/hp.png')
];

let enemigos = [
  new Enemigo('Goblin', 15, 50),
  new Enemigo('Orco', 25, 80),
  new Enemigo('Dragón', 40, 150)
];

let jugador;
let seleccionados;
let descuentos;
let oro;
let batallaActual;
let resultados;

function reiniciarJuego() {
  jugador = new Jugador('Aventurero');
  seleccionados = [];
  descuentos = {};
  oro = 500;
  batallaActual = 0;
  resultados = [];
  cargarInicial();
  showScene('initial');
}

function cargarInicial() {
  let html = '<p><strong>Nombre:</strong> ' + jugador.nombre + '</p>';
  html += '<p><strong>Vida:</strong> ' + jugador.vida + '</p>';
  html += '<p><strong>Ataque:</strong> ' + jugador.ataqueTotal + '</p>';
  html += '<p><strong>Defensa:</strong> ' + jugador.defensaTotal + '</p>';
  html += '<p><strong>Oro:</strong> ' + oro + '</p>';
  document.getElementById('stats-initial').innerHTML = html;
}

function cargarMercado() {
  descuentos.común = Math.floor(Math.random() * 11);      
  descuentos.raro = Math.floor(Math.random() * 16);       
  descuentos.épico = Math.floor(Math.random() * 21);      

  document.getElementById('current-gold').textContent = oro;
  document.getElementById('discount-info').innerHTML =
    'Común: ' + descuentos.común + '% | Raro: ' + descuentos.raro + '% | Épico: ' + descuentos.épico + '%';

  let container = document.getElementById('market-container');
  container.innerHTML = '';

  for (let i = 0; i < mercado.length; i++) {
    let prod = mercado[i];
    let desc = descuentos[prod.rareza];
    let prodDesc = prod.aplicarDescuento(desc);

    let div = document.createElement('div');
    div.className = 'product-item';

    let img = document.createElement('img');
    img.src = prod.imagen;
    img.alt = prod.nombre;
    img.style.width = '60px';
    img.style.height = 'auto';

    let bonus = '';
    if (prod.bonus.ataque) bonus += 'ataque +' + prod.bonus.ataque + ' ';
    if (prod.bonus.defensa) bonus += 'defensa +' + prod.bonus.defensa + ' ';
    if (prod.bonus.curacion) bonus += 'curación +' + prod.bonus.curacion;

    div.innerHTML = '<h4>' + prod.nombre + '</h4>' +
      '<p>' + prod.tipo + ' - ' + prod.rareza + '</p>' +
      '<p>' + prod.precio + '€ → ' + prodDesc.precio + '€ (' + desc + '%)</p>' +
      '<p>' + bonus + '</p>';

    div.insertBefore(img, div.firstChild);

    div.onclick = function () {
      let pos = -1;
      for (let j = 0; j < seleccionados.length; j++) {
        if (seleccionados[j].index == i) {
          pos = j;
        }
      }

      if (pos !== -1) {
        seleccionados.splice(pos, 1);
        div.classList.remove('selected');
      } else {
        seleccionados.push({ index: i, producto: prodDesc });
        div.classList.add('selected');
      }
      actualizarSeleccion();
    };

    container.appendChild(div);
  }

  actualizarSeleccion();
}

function actualizarSeleccion() {
  let html = '';
  let total = 0;

  if (seleccionados.length === 0) {
    html = 'Ninguno';
  } else {
    for (let i = 0; i < seleccionados.length; i++) {
      html += '<p>• ' + seleccionados[i].producto.nombre + ' - ' + seleccionados[i].producto.precio + '€</p>';
      total += seleccionados[i].producto.precio;
    }
  }

  document.getElementById('selected-products').innerHTML = html;
  document.getElementById('total-price').textContent = total;
}

function comprar() {
  if (seleccionados.length === 0) {
    alert('No has seleccionado nada');
    return;
  }

  let total = 0;
  for (let i = 0; i < seleccionados.length; i++) {
    total += seleccionados[i].producto.precio;
  }

  if (total > oro) {
    alert('No tienes suficiente oro');
    return;
  }

  for (let i = 0; i < seleccionados.length; i++) {
    jugador.añadirItem(seleccionados[i].producto);
  }

  oro -= total;
  seleccionados = [];
  actualizarInventario();
  showScene('player');
  cargarJugador();
}

function actualizarInventario() {
  let slots = document.querySelectorAll('#inventory-container .item');
  for (let i = 0; i < slots.length; i++) {
    if (i < jugador.inventario.length) {
      let item = jugador.inventario[i];
      slots[i].querySelector('img').src = item.imagen;
      slots[i].querySelector('img').alt = item.nombre;
    } else {
      slots[i].querySelector('img').src = '';
      slots[i].querySelector('img').alt = '';
    }
  }
}

function cargarJugador() {
  let html = '<p><strong>Nombre:</strong> ' + jugador.nombre + '</p>';
  html += '<p><strong>Vida:</strong> ' + jugador.vida + '</p>';
  html += '<p><strong>Ataque:</strong> ' + jugador.ataqueTotal + '</p>';
  html += '<p><strong>Defensa:</strong> ' + jugador.defensaTotal + '</p>';
  html += '<p><strong>Oro:</strong> ' + oro + '</p>';
  html += '<p><strong>Items:</strong> ' + jugador.inventario.length + '</p>';
  document.getElementById('stats-player').innerHTML = html;
  actualizarInventario(); 
}

function cargarEnemigos() {
  let container = document.getElementById('enemies-container');
  container.innerHTML = '';

  for (let i = 0; i < enemigos.length; i++) {
    let div = document.createElement('div');
    div.className = 'enemy-item';
    div.innerHTML = '<h3>' + enemigos[i].nombre + '</h3>' +
      '<p><strong>Ataque:</strong> ' + enemigos[i].ataque + '</p>' +
      '<p><strong>Vida:</strong> ' + enemigos[i].vida + '</p>';
    container.appendChild(div);
  }
}

function simularBatalla(enemigo) {
  let vidaJugador = jugador.vida;
  let vidaEnemigo = enemigo.vida;
  let log = [];

  let dmgJugador = jugador.ataqueTotal;
  let dmgEnemigo = enemigo.ataque - jugador.defensaTotal;
  if (dmgEnemigo < 1) dmgEnemigo = 1;

  while (vidaJugador > 0 && vidaEnemigo > 0) {
    vidaEnemigo -= dmgJugador;
    log.push('Atacas y haces ' + dmgJugador + ' de daño');

    if (vidaEnemigo <= 0) break;

    vidaJugador -= dmgEnemigo;
    log.push(enemigo.nombre + ' te ataca y hace ' + dmgEnemigo + ' de daño');
  }

  let gano = vidaJugador > 0;
  let puntosGanados = 0;

  if (gano) {
    puntosGanados = 100 + enemigo.ataque;
    jugador.ganarPuntos(puntosGanados);
    jugador.vida = vidaJugador;
  } else {
    jugador.vida = 0;
  }

  return { gano: gano, puntos: puntosGanados, log: log };
}

function cargarBatallas() {
  batallaActual = 0;
  resultados = [];
  document.getElementById('battles-container').innerHTML = '';
  document.getElementById('btn-next-battle').classList.add('hidden');
  document.getElementById('btn-to-results').classList.add('hidden');
  siguienteBatalla();
}

function siguienteBatalla() {
  if (batallaActual >= enemigos.length || jugador.vida <= 0) {
    document.getElementById('btn-next-battle').classList.add('hidden');
    document.getElementById('btn-to-results').classList.remove('hidden');
    return;
  }

  let enemigo = enemigos[batallaActual];
  let resultado = simularBatalla(enemigo);
  resultados.push(resultado);

  let div = document.createElement('div');
  div.className = 'battle-item';

  let html = '<h3>Batalla ' + (batallaActual + 1) + ': ' + enemigo.nombre + '</h3>';

  if (resultado.gano) {
    html += '<p class="result-text winner">¡VICTORIA!</p>';
    html += '<p>+' + resultado.puntos + ' puntos</p>';
  } else {
    html += '<p class="result-text loser">DERROTA</p>';
    html += '<p>0 puntos</p>';
  }

  div.innerHTML = html;
  document.getElementById('battles-container').appendChild(div);

  batallaActual++;

  if (batallaActual < enemigos.length && jugador.vida > 0) {
    document.getElementById('btn-next-battle').classList.remove('hidden');
  } else {
    document.getElementById('btn-next-battle').classList.add('hidden');
    document.getElementById('btn-to-results').classList.remove('hidden');
  }
}

function mostrarResultados() {
  const umbral = 300;
  const esPro = jugador.puntos >= umbral;
  document.getElementById('results-container').innerHTML = `
        <h3>${esPro ? '¡Eres un PRO!' : 'Eres un ROOKIE...'}</h3>
        <p><strong>Puntos totales:</strong> ${jugador.puntos}</p>
        <p><strong>Vida final:</strong> ${jugador.vida}</p>
        <p><strong>Items comprados:</strong> ${jugador.inventario.length}</p>
    `;
  showScene('results');
}

document.getElementById('btn-to-market').onclick = () => {
  showScene('market');
  cargarMercado();
};

document.getElementById('btn-buy').onclick = comprar;

document.getElementById('btn-skip-market').onclick = () => {
  showScene('player');
  cargarJugador();
};

document.getElementById('btn-to-enemies').onclick = () => {
  showScene('enemies');
  cargarEnemigos();
};

document.getElementById('btn-to-battles').onclick = () => {
  showScene('battles');
  cargarBatallas();
};

document.getElementById('btn-next-battle').onclick = siguienteBatalla;

document.getElementById('btn-to-results').onclick = mostrarResultados;

document.getElementById('btn-restart').onclick = reiniciarJuego;

reiniciarJuego();