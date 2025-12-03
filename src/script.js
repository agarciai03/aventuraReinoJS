//imports
import { ORO_INICIAL, VIDA_JUGADOR, productosMercado, enemigosLista, jefeFinal, UMBRAL_VETERANO } from '../utils/constants.js';
import { formatearPrecio } from '../utils/utils.js';
import { Jugador } from '../modules/jugador.js';
import { Enemigo, Jefe } from '../modules/enemigos.js';
import { Producto } from '../modules/producto.js';
import { obtenerProductosMercado } from '../modules/mercado.js';
import { combate } from '../modules/batallas.js';
import { obtenerRanking, mostrarMensajeRanking } from '../modules/ranking.js';


//variables
let jugador, oro, productosDisponibles, enemigos, jefe, seleccionados = [], descuentos = {};
let rondaActual = 0;
let resultadosBatallas = [];


/**
 * Inicia la partida desde cero.
 * Crea jugador, carga mercado, enemigos y jefe y muestra la escena inicial.
 * @returns {void}
 */
function iniciarJuego() {
  jugador = new Jugador("Aventurero", "img/personaje.png", VIDA_JUGADOR);
  oro = ORO_INICIAL;
  productosDisponibles = obtenerProductosMercado();
  enemigos = enemigosLista.map(event => new Enemigo(event.nombre, event.avatar, event.ataque, event.vida));
  jefe = new Jefe(jefeFinal.nombre, jefeFinal.avatar, jefeFinal.ataque, jefeFinal.vida, jefeFinal.multiplicador);
  seleccionados = [];
  descuentos = {};
  mostrarEscena("initial");
  mostrarEstadoInicial();
  actualizarInventario();
}


/**
 * Cambia la escena activa del juego.
 * @param {string} id - Id de la escena que se quiere mostrar.
 * @returns {void}
 */
function mostrarEscena(id) {
  document.querySelectorAll('.scene').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}


/**
 * Muestra el estado inicial del jugador (antes de comprar nada).
 * Rellena el div con id "stats-inicial".
 * @returns {void}
 */
function mostrarEstadoInicial() {
  document.getElementById("stat-vida-inicial").textContent = jugador.vida;
  document.getElementById("stat-ataque-inicial").textContent = jugador.obtenerAtaqueTotal();
  document.getElementById("stat-defensa-inicial").textContent = jugador.obtenerDefensaTotal();
  document.getElementById("stat-oro-inicial").textContent = oro;
  document.getElementById("stat-items-inicial").textContent = jugador.inventario.length;

  const imgInicial = document.getElementById("player-image");
  if (imgInicial) {
    imgInicial.src = jugador.avatar;
    imgInicial.alt = jugador.nombre;
  }
}


/**
 * Muestra el estado del jugador después del mercado.
 * Rellena el div con id "stats-actual".
 * @returns {void}
 */
function mostrarEstadoActual() {
  document.getElementById("stat-vida-actual").textContent = jugador.vida;
  document.getElementById("stat-ataque-actual").textContent = jugador.obtenerAtaqueTotal();
  document.getElementById("stat-defensa-actual").textContent = jugador.obtenerDefensaTotal();
  document.getElementById("stat-oro-actual").textContent = oro;
  document.getElementById("stat-items-actual").textContent = jugador.inventario.length;

  const imgActual = document.getElementById("player-image-actual");
  if (imgActual) {
    imgActual.src = jugador.avatar;
    imgActual.alt = jugador.nombre;
  }
}


/**
 * Actualiza el inventario visual del footer.
 * Si no hay objetos lo oculta, si hay los dibuja en las casillas.
 * @returns {void}
 */
function actualizarInventario() {
  let contenedor = document.getElementById('inventory-container');
  if (jugador.inventario.length === 0) {
    contenedor.style.display = 'none';
  } else {
    contenedor.style.display = 'flex';
    let slots = contenedor.querySelectorAll('.item');
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
}


/**
 * Carga el mercado con productos y descuentos aleatorios.
 * Rellena el contenedor "market-container" con las tarjetas de producto.
 * @returns {void}
 */
function cargarMercado() {
  descuentos.común = Math.floor(Math.random() * 11);
  descuentos.raro = Math.floor(Math.random() * 16);
  descuentos.épico = Math.floor(Math.random() * 21);

  document.getElementById('current-gold').textContent = oro;
  document.getElementById('discount-info').innerText =
    `Común: ${descuentos.común}% | Raro: ${descuentos.raro}% | Épico: ${descuentos.épico}%`;

  let listaDescuento = productosDisponibles.map(prod => prod.aplicarDescuento(descuentos[prod.rareza] || 0));
  let contenedor = document.getElementById('market-container');
  contenedor.innerHTML = "";

  listaDescuento.forEach((prod, i) => {
    let div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" style="width:85px;height:85px;">
      <h4>${prod.nombre}</h4>
      <p>${prod.tipo} - ${prod.rareza}</p>
      <p>Precio: ${formatearPrecio(prod.precio)} (${descuentos[prod.rareza]}% dto.)</p>
      <p>${prod.mostrarBonus()}</p>
      <button class="product-btn" data-indice="${i}">Añadir</button>
    `;
    contenedor.appendChild(div);
  });

  // eventos en los botones de mercado
  contenedor.querySelectorAll(".product-btn").forEach(btn => {
    btn.onclick = () => {
      const indice = Number(btn.dataset.indice);
      const prod = listaDescuento[indice];
      const tarjeta = btn.closest(".product-item");
      seleccionarProductoMercado(indice, prod, tarjeta, btn);
    };
  });

  actualizarSeleccion();
}


/**
 * Marca o desmarca un producto del mercado según se haga clic.
 * @param {number} indice - Posición del producto en la lista.
 * @param {Producto} prod - Producto asociado a la tarjeta.
 * @param {HTMLDivElement} div - Tarjeta del producto.
 * @param {HTMLButtonElement} boton - Botón Añadir/Retirar.
 * @returns {void}
 */
function seleccionarProductoMercado(indice, prod, div, boton) {
  let existe = seleccionados.find(sel => sel.indice === indice);
  if (existe) {
    // quitamos de la cesta
    seleccionados = seleccionados.filter(sel => sel.indice !== indice);
    div.classList.remove('selected');
    boton.textContent = "Añadir";
  } else {
    // añadimos a la cesta
    seleccionados.push({ indice: indice, producto: prod });
    div.classList.add('selected');
    boton.textContent = "Retirar";
  }
  actualizarSeleccion();
}


/**
 * Actualiza la lista de productos seleccionados y el total.
 * Escribe el detalle en "selected-products" y el total en "total-price".
 * @returns {void}
 */
function actualizarSeleccion() {
  let html = "";
  let total = 0;
  if (seleccionados.length === 0) {
    html = "Ninguno";
  } else {
    seleccionados.forEach(sel => {
      html += `<p>• ${sel.producto.nombre} - ${formatearPrecio(sel.producto.precio)}</p>`;
      total += sel.producto.precio;
    });
  }
  document.getElementById('selected-products').innerHTML = html;
  document.getElementById('total-price').textContent = formatearPrecio(total);
}


/**
 * Intenta comprar los productos seleccionados del mercado.
 * Comprueba que haya selección y oro suficiente antes de comprar.
 * @returns {void}
 */
function comprar() {
  if (seleccionados.length === 0) {
    alert("No has seleccionado nada");
    return;
  }
  let total = seleccionados.reduce((acc, sel) => acc + sel.producto.precio, 0);
  if (total > oro) {
    alert("No tienes suficiente oro");
    return;
  }
  seleccionados.forEach(sel => jugador.añadirAlInventario(sel.producto.clonar()));
  oro -= total;
  seleccionados = [];
  actualizarInventario();
  mostrarEscena('player');
  mostrarEstadoActual();
}


/**
 * Carga la lista de enemigos más el jefe en la escena de enemigos.
 * Rellena el contenedor "enemies-container".
 * @returns {void}
 */
function cargarEnemigos() {
  let container = document.getElementById('enemies-container');
  container.innerHTML = "";
  enemigos.concat([jefe]).forEach(enemigo => {
    let div = document.createElement("div");
    div.className = "enemy-item";
    div.innerHTML = `
      <img src="${enemigo.avatar}" alt="${enemigo.nombre}">
      <h3>${enemigo.nombre}</h3>
      <p><strong>Ataque:</strong> ${enemigo.ataque}</p>
      <p><strong>Vida:</strong> ${enemigo.vida}</p>
    `;
    container.appendChild(div);
  });
}

/**
 * Prepara la escena de batallas y lanza la primera.
 * @returns {void}
 */
function cargarBatallas() {
  mostrarEscena('battles');
  rondaActual = 0;
  resultadosBatallas = [];
  document.getElementById('battles-container').innerHTML = "";
  siguienteBatalla();
}

/**
 * Ejecuta la siguiente batalla contra el siguiente enemigo o el jefe.
 * Actualiza puntos, vida y muestra solo una batalla en pantalla.
 * @returns {void}
 */
function siguienteBatalla() {
  let listaLucha = enemigos.concat([jefe]);
  let btnNextBattle = document.getElementById('btn-next-battle');
  let btnToResults = document.getElementById('btn-to-results');

  if (rondaActual >= listaLucha.length || jugador.vida <= 0) {
    // Si el jugador pierde o se acaban las batallas, mostrar solo "Ver resultados"
    btnNextBattle.style.display = 'none';
    btnToResults.style.display = 'block';
    return;
  }

  let enemigo = listaLucha[rondaActual];
  let resultado = combate(jugador, enemigo);
  resultadosBatallas.push(resultado);

  // Suma puntos
  if (resultado.ganador === "jugador") {
    jugador.sumarPuntos(resultado.puntos);
    jugador.vida = jugador.obtenerVidaTotal();
  } else {
    jugador.vida = 0;
  }

  // Mostrar la batalla actual
  let battlesDiv = document.getElementById("battles-container");
  battlesDiv.innerHTML = `
    <div class="battle-vs-row">
      <img class="battle-vs-avatar entrar-izquierda" src="${jugador.avatar}" alt="Jugador" style="margin-right:18px;">
      <span class="battle-vs-vs">vs</span>
      <img class="battle-vs-avatar entrar-derecha" src="${enemigo.avatar}" alt="${enemigo.nombre}" style="margin-left:18px;">
    </div>
    <div class="battle-item">
      <div class="result-text ${resultado.ganador === "jugador" ? "winner" : "loser"}">
        ${resultado.ganador === "jugador" ? "¡VICTORIA!" : "DERROTA"}
      </div>
      <div>
        ${resultado.ganador === "jugador" ? `+${resultado.puntos} puntos` : "0 puntos"}
      </div>
    </div>
  `;

  rondaActual++;

  // Mostrar/ocultar botones según el estado del jugador
  if (jugador.vida > 0 && rondaActual < listaLucha.length) {
    // Si el jugador sigue vivo y hay más batallas, mostrar "Siguiente batalla"
    btnNextBattle.style.display = 'block';
    btnToResults.style.display = 'none';
  } else {
    // Si el jugador pierde o se acaban las batallas, mostrar solo "Ver resultados"
    btnNextBattle.style.display = 'none';
    btnToResults.style.display = 'block';
  }
}

/**
 * Muestra la pantalla de resultados finales:
 * puntos, vida, items y ranking (Novato/Veterano).
 * @returns {void}
 */
function mostrarResultados() {
  let listaLucha = enemigos.concat([jefe]);
  let ranking = "Novato"; // por defecto el jugador es un novato

  // Cambiar el ranking solo si el jugador derrota al jefe final
  if (jugador.vida > 0 && rondaActual === listaLucha.length && resultadosBatallas[resultadosBatallas.length - 1].ganador === "jugador") {
    ranking = obtenerRanking(jugador.puntos, UMBRAL_VETERANO);
  }

  let mensaje = mostrarMensajeRanking(ranking);
  document.getElementById('results-container').innerHTML = `
    <h3>${ranking}</h3>
    <p><strong>Puntos totales:</strong> ${jugador.puntos}</p>
    <p><strong>Vida final:</strong> ${jugador.vida}</p>
    <p><strong>Items comprados:</strong> ${jugador.inventario.length}</p>
    <p>${mensaje}</p>
  `;

  // si superamos a los enemigos, lanzamos confetti
  if (typeof confetti === "function" && jugador.vida > 0) {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  mostrarEscena('results');
}


// botones
document.getElementById('btn-to-market').onclick = () => { mostrarEscena('market'); cargarMercado(); };
document.getElementById('btn-buy').onclick = comprar;
document.getElementById('btn-skip-market').onclick = () => { mostrarEscena('player'); mostrarEstadoActual(); };
document.getElementById('btn-to-enemies').onclick = () => { mostrarEscena('enemies'); cargarEnemigos(); };
document.getElementById('btn-to-battles').onclick = cargarBatallas;
document.getElementById('btn-next-battle').onclick = siguienteBatalla;
document.getElementById('btn-to-results').onclick = mostrarResultados;
document.getElementById('btn-restart').onclick = iniciarJuego;


//inicio del juego
iniciarJuego();
