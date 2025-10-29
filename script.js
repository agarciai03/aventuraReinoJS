function showScene(id) {
  let escenas = document.querySelectorAll('.scene');
  for (let i = 0; i < escenas.length; i++) {
    escenas[i].classList.remove('active');
  }
  document.getElementById(id).classList.add('active');
}

// Producto
class Producto {
  constructor(nombre, precio, rareza, tipo, bonus) {
    this.nombre = nombre;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
  }

  aplicarDescuento(porcentaje) {
    let nuevo = this.precio - (this.precio * porcentaje / 100);
    return new Producto(this.nombre, Math.round(nuevo), this.rareza, this.tipo, this.bonus);
  }
}

// Jugador
class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.vida = 100;
    this.vidaMax = 100;
    this.inventario = [];
  }

  añadirItem(item) {
    this.inventario.push(item);
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

// datos
let mercado = [
  new Producto('Espada corta', 120, 'común', 'arma', { ataque: 8 }),
  new Producto('Arco de caza', 140, 'común', 'arma', { ataque: 7 }),
  new Producto('Armadura de cuero', 180, 'común', 'armadura', { defensa: 6 }),
  new Producto('Poción pequeña', 40, 'común', 'consumible', { curacion: 20 }),
  new Producto('Espada rúnica', 460, 'raro', 'arma', { ataque: 18 }),
  new Producto('Escudo de roble', 320, 'raro', 'armadura', { defensa: 14 }),
  new Producto('Poción grande', 110, 'raro', 'consumible', { curacion: 60 }),
  new Producto('Mandoble épico', 450, 'épico', 'arma', { ataque: 32 }),
  new Producto('Placas dracónicas', 480, 'épico', 'armadura', { defensa: 28 }),
  new Producto('Elixir legendario', 220, 'épico', 'consumible', { curacion: 150 })
];

let jugador = new Jugador('Aventurero');
let seleccionados = [];
let descuentos = {};
let oro = 500;

// ESCENA 1
function cargarInicial() {
  let html = '<p><strong>Nombre:</strong> ' + jugador.nombre + '</p>';
  html += '<p><strong>Vida:</strong> ' + jugador.vida + '</p>';
  html += '<p><strong>Ataque:</strong> ' + jugador.ataqueTotal + '</p>';
  html += '<p><strong>Defensa:</strong> ' + jugador.defensaTotal + '</p>';
  html += '<p><strong>Oro:</strong> ' + oro + '</p>';
  document.getElementById('stats-initial').innerHTML = html;
}

// ESCENA 2
function cargarMercado() {
  descuentos.común = Math.floor(Math.random() * 11);
  descuentos.raro = Math.floor(Math.random() * 16);
  descuentos.épico = Math.floor(Math.random() * 21);

  document.getElementById('current-gold').textContent = oro;
  document.getElementById('discount-info').innerHTML = 'Común: ' + descuentos.común + '% | Raro: ' + descuentos.raro + '% | Épico: ' + descuentos.épico + '%';

  let container = document.getElementById('market-container');
  container.innerHTML = '';

  for (let i = 0; i < mercado.length; i++) {
    let prod = mercado[i];
    let desc = descuentos[prod.rareza];
    let prodDesc = prod.aplicarDescuento(desc);

    let div = document.createElement('div');
    div.className = 'product-item';

    let bonus = '';
    if (prod.bonus.ataque) bonus += 'ataque +' + prod.bonus.ataque + ' ';
    if (prod.bonus.defensa) bonus += 'defensa +' + prod.bonus.defensa + ' ';
    if (prod.bonus.curacion) bonus += 'curación +' + prod.bonus.curacion;

    div.innerHTML = '<h4>' + prod.nombre + '</h4>' +
      '<p>' + prod.tipo + ' - ' + prod.rareza + '</p>' +
      '<p>' + prod.precio + '€ → ' + prodDesc.precio + '€ (' + desc + '%)</p>' +
      '<p>' + bonus + '</p>';

    div.onclick = function () {
      let pos = -1;
      for (let j = 0; j < seleccionados.length; j++) {
        if (seleccionados[j].index == i) {
          pos = j;
        }
      }

      if (pos != -1) {
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

  if (seleccionados.length == 0) {
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
  if (seleccionados.length == 0) {
    alert('No has seleccionado nada');
    return;
  }

  let total = 0;
  for (let i = 0; i < seleccionados.length; i++) {
    total += seleccionados[i].producto.precio;
  }

  if (total > oro) {
    alert('No tienes oro');
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
  let container = document.getElementById('inventory-container');
  container.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    let div = document.createElement('div');
    div.className = 'item';
    if (i < jugador.inventario.length) {
      div.textContent = jugador.inventario[i].nombre;
    }
    container.appendChild(div);
  }
}

// ESCENA 3
function cargarJugador() {
  let html = '<p><strong>Nombre:</strong> ' + jugador.nombre + '</p>';
  html += '<p><strong>Vida:</strong> ' + jugador.vida + '</p>';
  html += '<p><strong>Ataque:</strong> ' + jugador.ataqueTotal + '</p>';
  html += '<p><strong>Defensa:</strong> ' + jugador.defensaTotal + '</p>';
  html += '<p><strong>Oro:</strong> ' + oro + '</p>';
  html += '<p><strong>Items:</strong> ' + jugador.inventario.length + '</p>';
  document.getElementById('stats-player').innerHTML = html;
}

// eventos
document.getElementById('btn-to-market').onclick = function () {
  showScene('market');
  cargarMercado();
};

document.getElementById('btn-buy').onclick = comprar;

document.getElementById('btn-skip-market').onclick = function () {
  showScene('player');
  cargarJugador();
};

document.getElementById('btn-to-enemies').onclick = function () {
  showScene('enemies');
};

cargarInicial();