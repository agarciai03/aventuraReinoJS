/**
 * @file Archivo principal que controla la lógica del juego "Aventura en el Reino de JS".
 * Maneja el flujo de escenas, la creación del jugador, el mercado, las batallas y los resultados.
 */

// IMPORTS
import { productosMercado, enemigosLista, jefeFinal, UMBRAL_VETERANO } from '../utils/constants.js';
import { formatearPrecio } from '../utils/utils.js';
import { Jugador } from '../modules/jugador.js';
import { Enemigo, Jefe } from '../modules/enemigos.js';
import { Producto } from '../modules/producto.js';
import { obtenerProductosMercado } from '../modules/mercado.js';
import { combate } from '../modules/batallas.js';
import { obtenerRanking, mostrarMensajeRanking } from '../modules/ranking.js';

// VARIABLES 

/** * Instancia del jugador actual.
 * @type {Jugador} 
 */
let jugador;

/** * Lista de productos disponibles en el mercado.
 * @type {Producto[]} 
 */
let productosDisponibles;

/** * Lista de enemigos a combatir.
 * @type {Enemigo[]} 
 */
let enemigos;

/** * Jefe final del juego.
 * @type {Jefe} 
 */
let jefe;

/** * Lista de productos seleccionados en el carrito de compra.
 * @type {Object[]} 
 */
let seleccionados = [];

/** * Objeto que guarda los porcentajes de descuento por rareza.
 * @type {Object} 
 */
let descuentos = {};

/** * Índice de la ronda de batalla actual.
 * @type {number} 
 */
let rondaActual = 0;

/** * Historial de resultados de las batallas.
 * @type {Object[]} 
 */
let resultadosBatallas = [];

/**
 * Inicia la aplicacion mostrando la escena inicial y asignando eventos.
 * No recibe parámetros ni devuelve valor.
 */
function iniciarAplicacion() {
  mostrarEscena("initial");
  document.getElementById('btn-start-game').onclick = validarYCrearJugador;
}

/**
 * Valida los datos del formulario de creación de personaje.
 * Si los datos son correctos, crea la instancia del Jugador e inicia el juego cargando el mercado.
 * Si hay errores, muestra alertas al usuario.
 */
function validarYCrearJugador() {
  const nombre = document.getElementById('inp-nombre').value;
  const vida = parseInt(document.getElementById('inp-vida').value);
  const ataque = parseInt(document.getElementById('inp-ataque').value);
  const defensa = parseInt(document.getElementById('inp-defensa').value);

  // REGEX - mayuscula al inicio, solo letras, max 20 caracteres
  const regexNombre = /^[A-Z][a-zA-Z\s]{0,19}$/;

  if (!regexNombre.test(nombre) || nombre.trim().length === 0) {
    alert("Error en el nombre: Debe empezar por mayúscula, solo letras/espacios y máx 20 caracteres.");
    return;
  }

  if (vida < 100) {
    alert("La vida no puede ser menor a 100.");
    return;
  }

  if (ataque < 0 || defensa < 0) {
    alert("No puede haber valores negativos.");
    return;
  }

  const sumaTotal = vida + ataque + defensa;
  if (sumaTotal > 110) {
    alert(`Te has pasado de puntos. Sumas ${sumaTotal} y el máximo es 110.`);
    return;
  }

  // Creación del jugador si todo es válido
  jugador = new Jugador(nombre, "img/personaje.png", vida, ataque, defensa);

  // Inicialización de datos del juego
  productosDisponibles = obtenerProductosMercado();
  enemigos = enemigosLista.map(e => new Enemigo(e.nombre, e.avatar, e.ataque, e.vida));
  jefe = new Jefe(jefeFinal.nombre, jefeFinal.avatar, jefeFinal.ataque, jefeFinal.vida, jefeFinal.multiplicador);
  seleccionados = [];
  rondaActual = 0;
  resultadosBatallas = [];

  mostrarEscena('market');
  cargarMercado();
}

/**
 * Cambia la visibilidad de las escenas del juego.
 * Oculta todas las escenas y muestra solo la que coincide con el ID.
 * @param {string} id - El ID del elemento HTML de la escena a mostrar.
 */
function mostrarEscena(id) {
  document.querySelectorAll('.scene').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/**
 * Genera descuentos aleatorios y renderiza la lista de productos en el mercado.
 * También actualiza la información visual de los descuentos y precios.
 */
function cargarMercado() {
  descuentos.común = Math.floor(Math.random() * 11);
  descuentos.raro = Math.floor(Math.random() * 16);
  descuentos.épico = Math.floor(Math.random() * 21);

  actualizarInfoDineroMercado();

  document.getElementById('discount-info').innerText =
    `Común: ${descuentos.común}% | Raro: ${descuentos.raro}% | Épico: ${descuentos.épico}%`;

  // aplicamos el descuento a los productos
  let listaDescuento = productosDisponibles.map(prod => prod.aplicarDescuento(descuentos[prod.rareza] || 0));

  let contenedor = document.getElementById('market-container');
  contenedor.innerHTML = "";

  listaDescuento.forEach((prod, i) => {
    let div = document.createElement("div");
    div.className = "product-item";

    // Formatear precio con descuento y mostrar en tarjeta
    div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h4>${prod.nombre}</h4>
            <p>${prod.tipo} - ${prod.rareza}</p>
            <p>Precio: ${formatearPrecio(prod.precio)} (${descuentos[prod.rareza]}% dto.)</p>
            <p>${prod.mostrarBonus()}</p>
            <button class="product-btn" data-indice="${i}">Añadir</button>
        `;
    contenedor.appendChild(div);
  });

  // eventos botones añadir
  contenedor.querySelectorAll(".product-btn").forEach(btn => {
    btn.onclick = () => {
      const indice = Number(btn.dataset.indice);
      seleccionarProductoMercado(indice, listaDescuento[indice], btn.closest(".product-item"), btn);
    };
  });

  actualizarSeleccion();
}

/**
 * Calcula y actualiza en la interfaz el dinero disponible del jugador.
 * Resta el coste de los productos seleccionados en la cesta al dinero total del jugador.
 */
function actualizarInfoDineroMercado() {
  let costeCesta = seleccionados.reduce((acc, sel) => acc + sel.producto.precio, 0);
  let dineroDisponible = jugador.dinero - costeCesta;

  document.getElementById('current-gold').textContent = dineroDisponible;
}

/**
 * Gestiona la selección o deselección de un producto en el mercado.
 * Verifica si hay dinero suficiente antes de añadir.
 * @param {number} indice - Índice del producto en la lista mostrada.
 * @param {Producto} prod - Objeto producto seleccionado.
 * @param {HTMLElement} div - Elemento HTML de la tarjeta del producto.
 * @param {HTMLButtonElement} boton - Botón pulsado añadir/retirar.
 */
function seleccionarProductoMercado(indice, prod, div, boton) {
  let existe = seleccionados.find(sel => sel.indice === indice);

  if (existe) {
    //retiro producto de la cesta
    seleccionados = seleccionados.filter(sel => sel.indice !== indice);
    div.classList.remove('selected');
    boton.textContent = "Añadir";
  } else {
    //añado producto a la cesta
    let costeActual = seleccionados.reduce((acc, sel) => acc + sel.producto.precio, 0);

    if (costeActual + prod.precio > jugador.dinero) {
      alert("No tienes suficiente dinero para añadir esto.");
      return;
    }

    seleccionados.push({ indice: indice, producto: prod });
    div.classList.add('selected');
    boton.textContent = "Retirar";
  }
  actualizarSeleccion();
  actualizarInfoDineroMercado();
}

/**
 * Actualiza la lista visual de productos seleccionados en la cesta de compra
 * y muestra el coste total acumulado.
 */
function actualizarSeleccion() {
  let html = "";
  let total = 0;
  if (seleccionados.length === 0) {
    html = "Ninguno";
  } else {
    seleccionados.forEach(sel => {
      html += `<p>• ${sel.producto.nombre} - ${sel.producto.precio}</p>`;
      total += sel.producto.precio;
    });
  }
  document.getElementById('selected-products').innerHTML = html;
  document.getElementById('total-price').textContent = formatearPrecio(total);
}

/**
 * Finaliza la compra en el mercado.
 * Verifica fondos, añade items al inventario del jugador, descuenta el oro
 * y avanza a la siguiente escena.
 */
function comprar() {
  if (seleccionados.length === 0) {
    alert("No has seleccionado nada");
    return;
  }

  let total = seleccionados.reduce((acc, sel) => acc + sel.producto.precio, 0);
  if (total > jugador.dinero) {
    alert("Error: No hay dinero suficiente.");
    return;
  }

  seleccionados.forEach(sel => jugador.añadirAlInventario(sel.producto.clonar()));
  jugador.dinero -= total;

  seleccionados = [];
  actualizarInventario();
  mostrarEscena('player');
  mostrarEstadoActual();
}

/**
 * Muestra en la interfaz los datos actuales del jugador (stats, oro, items).
 * Actualiza los elementos del DOM correspondientes.
 */
function mostrarEstadoActual() {
  document.getElementById("stat-nombre-actual").textContent = jugador.nombre;
  document.getElementById("stat-vida-actual").textContent = jugador.vida;
  document.getElementById("stat-ataque-actual").textContent = jugador.obtenerAtaqueTotal();
  document.getElementById("stat-defensa-actual").textContent = jugador.obtenerDefensaTotal();

  document.getElementById("stat-oro-actual").textContent = jugador.dinero;
  document.getElementById("stat-items-actual").textContent = jugador.inventario.length;

  const imgActual = document.getElementById("player-image-actual");
  if (imgActual) {
    imgActual.src = jugador.avatar;
  }
}

/**
 * Renderiza el inventario del jugador en el footer.
 * Muestra iconos de los objetos obtenidos.
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
 * Genera y muestra las tarjetas de los enemigos en la escena de pre-combate.
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
 * Prepara la escena de batallas reiniciando el contenedor visual e iniciando la primera pelea.
 */
function cargarBatallas() {
  mostrarEscena('battles');
  document.getElementById('battles-container').innerHTML = "";
  siguienteBatalla();
}

/**
 * Ejecuta la lógica de una ronda de batalla entre el jugador y el enemigo actual.
 * Calcula resultados, otorga recompensas (puntos y oro extra) y actualiza la interfaz.
 * Controla si el jugador gana, pierde o si se terminan los enemigos.
 */
function siguienteBatalla() {
  let listaLucha = enemigos.concat([jefe]);
  let btnNextBattle = document.getElementById('btn-next-battle');
  let btnToResults = document.getElementById('btn-to-results');

  if (rondaActual >= listaLucha.length || jugador.vida <= 0) {
    btnNextBattle.style.display = 'none';
    btnToResults.style.display = 'block';
    return;
  }

  let enemigo = listaLucha[rondaActual];
  // Comprobar si es el jefe 
  let esJefe = (enemigo === jefe);

  let resultado = combate(jugador, enemigo);
  resultadosBatallas.push(resultado);

  let mensajeDinero = "";

  if (resultado.ganador === "jugador") {
    jugador.sumarPuntos(resultado.puntos);
    jugador.vida = jugador.obtenerVidaTotal();

    //oro extra por victoria
    let premio = esJefe ? 10 : 5;
    jugador.dinero += premio;
    mensajeDinero = `<span style="color:yellow; font-weight:bold;">(+${premio} oro)</span>`;

  } else {
    jugador.vida = 0;
  }

  // resultado de la batalla
  let battlesDiv = document.getElementById("battles-container");
  battlesDiv.innerHTML = `
    <div class="battle-vs-row">
      <img class="battle-vs-avatar" src="${jugador.avatar}">
      <span class="battle-vs-vs">vs</span>
      <img class="battle-vs-avatar" src="${enemigo.avatar}">
    </div>
    <div class="battle-item">
      <div class="result-text ${resultado.ganador === "jugador" ? "winner" : "loser"}">
        ${resultado.ganador === "jugador" ? "¡VICTORIA!" : "DERROTA"}
      </div>
      <div>
        ${resultado.ganador === "jugador" ? `+${resultado.puntos} puntos ${mensajeDinero}` : "0 puntos"}
      </div>
    </div>
  `;

  rondaActual++;

  //botones Siguiente o Ver resultados
  if (jugador.vida > 0 && rondaActual < listaLucha.length) {
    btnNextBattle.style.display = 'block';
    btnToResults.style.display = 'none';
  } else {
    btnNextBattle.style.display = 'none';
    btnToResults.style.display = 'block';
  }
}

/**
 * Calcula los resultados finales, guarda la partida en el historial y muestra la pantalla de resumen.
 * Determina si el jugador ganó o perdió y actualiza la interfaz acorde a ello.
 * * @returns {void} No devuelve ningún valor, modifica el DOM directamente.
 */
function mostrarResultados() {
  let listaLucha = enemigos.concat([jefe]);
  let rangoObtenido = "Novato";

  const cajaHeader = document.getElementById('result-header');
  const titulo = document.getElementById('res-title');
  const mensaje = document.getElementById('res-msg');

  if (jugador.vida > 0) {
    jugador.puntos += jugador.dinero;
    cajaHeader.className = "success-box";
    titulo.innerText = "¡Aventura Completada!";
    mensaje.innerText = "¡ERES UNA PRO!";

    try {
      rangoObtenido = obtenerRanking(jugador.puntos, UMBRAL_VETERANO);
    } catch (e) {
      rangoObtenido = jugador.puntos > 600 ? "PRO" : "Aventurero";
    }

    // Confetti solo si gana
    if (typeof confetti === "function") {
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    }

  } else {
    //si pierdo
    cajaHeader.className = "failure-box";
    titulo.innerText = "¡Fin de la partida!";
    mensaje.innerText = "HAS SIDO DERROTADO, ERES UN VETERANO";
    rangoObtenido = "Derrotado";
  }

  // GUARDADO EN LOCALSTORAGE
  const registroActual = {
    nombre: jugador.nombre,
    puntuacion: jugador.puntos,
    monedas: jugador.dinero,
    fecha: new Date().toLocaleDateString()
  };

  let historial = JSON.parse(localStorage.getItem('rankingAventura')) || [];
  if (!Array.isArray(historial)) historial = [];
  historial.push(registroActual);
  localStorage.setItem('rankingAventura', JSON.stringify(historial));

  // RESTO DE DATOS 
  document.getElementById('score-big').innerText = `${jugador.puntos} puntos`;

  const listaStats = document.getElementById('final-stats-list');
  listaStats.innerHTML = `
      <div class="stat-row"><span class="label">Nombre</span> <span class="value">${jugador.nombre}</span></div>
      <div class="stat-row"><span class="label">Puntos Totales</span> <span class="value">${jugador.puntos}</span></div>
      <div class="stat-row"><span class="label">Dinero Final</span> <span class="value">${jugador.dinero}</span></div>
      <div class="stat-row"><span class="label">Batallas Ganadas</span> <span class="value">${rondaActual}/${listaLucha.length}</span></div>
      <div class="stat-row"><span class="label">Vida Final</span> <span class="value">${jugador.vida}/100</span></div>
      <div class="stat-row"><span class="label">Ataque Total</span> <span class="value">${jugador.obtenerAtaqueTotal()}</span></div>
      <div class="stat-row"><span class="label">Defensa Total</span> <span class="value">${jugador.obtenerDefensaTotal()}</span></div>
      <div class="stat-row"><span class="label">Objetos Comprados</span> <span class="value">${jugador.inventario.length}</span></div>
  `;

  const pieRank = document.getElementById('final-rank-row');
  pieRank.innerHTML = `
      <span class="label">🏆 Nivel Final</span> <span class="value-rank">${rangoObtenido}</span>
  `;

  mostrarEscena('results');
}

/**
 * Obtiene el historial de partidas del almacenamiento local, lo ordena y genera la tabla de ranking.
 * * @returns {void} Renderiza la tabla en el HTML.
 */
function mostrarPantallaRanking() {
  let historial = JSON.parse(localStorage.getItem('rankingAventura')) || [];

  if (!Array.isArray(historial)) historial = [];

  historial.sort((a, b) => b.puntuacion - a.puntuacion);

  const tbody = document.getElementById('ranking-body');
  tbody.innerHTML = "";

  historial.forEach((partida, index) => {
    let fila = document.createElement('tr');

    let clasePosicion = "";
    if (index === 0) clasePosicion = "rank-1";
    if (index === 1) clasePosicion = "rank-2";
    if (index === 2) clasePosicion = "rank-3";

    let medalla = "#" + (index + 1);
    if (index === 0) medalla = "🥇";
    if (index === 1) medalla = "🥈";
    if (index === 2) medalla = "🥉";

    fila.innerHTML = `
            <td>${medalla}</td>
            <td class="${clasePosicion}"><strong>${partida.nombre}</strong></td>
            <td>${partida.puntuacion}</td>
            <td class="coin-cell">${partida.monedas} 💰</td>
        `;
    tbody.appendChild(fila);
  });

  mostrarEscena('ranking-scene');
}

// EVENT 

// Boton en la pantalla de Resumen Final para ir al Ranking
document.getElementById('btn-show-ranking').onclick = mostrarPantallaRanking;

// Boton en la pantalla de Ranking para reiniciar juego
document.getElementById('btn-new-game').onclick = () => location.reload();

// asigno eventos a botones 
document.getElementById('btn-buy').onclick = comprar;
document.getElementById('btn-skip-market').onclick = () => { mostrarEscena('player'); mostrarEstadoActual(); };
document.getElementById('btn-to-enemies').onclick = () => { mostrarEscena('enemies'); cargarEnemigos(); };
document.getElementById('btn-to-battles').onclick = cargarBatallas;
document.getElementById('btn-next-battle').onclick = siguienteBatalla;
document.getElementById('btn-to-results').onclick = mostrarResultados;
const btnRestartOld = document.getElementById('btn-restart');
if (btnRestartOld) btnRestartOld.onclick = () => location.reload();

// iniciar aplicacion
iniciarAplicacion();