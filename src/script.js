// IMPORTS
import { productosMercado, enemigosLista, jefeFinal, UMBRAL_VETERANO } from '../utils/constants.js';
import { formatearPrecio } from '../utils/utils.js';
import { Jugador } from '../modules/jugador.js';
import { Enemigo, Jefe } from '../modules/enemigos.js';
import { Producto } from '../modules/producto.js';
import { obtenerProductosMercado } from '../modules/mercado.js';
import { combate } from '../modules/batallas.js';
import { obtenerRanking, mostrarMensajeRanking } from '../modules/ranking.js';

// VARIABLES GLOBALES
let jugador;
let productosDisponibles;
let enemigos;
let jefe;
let seleccionados = [];
let descuentos = {};
let rondaActual = 0;
let resultadosBatallas = [];

/**
 * Solo mostramos la pantalla
 */
function iniciarAplicacion() {
  mostrarEscena("initial");
  document.getElementById('btn-start-game').onclick = validarYCrearJugador;
}

/**
 * LOGICA DEL FORMULARIO Y VALIDACIÓN (REQUISITO 1)
 */
function validarYCrearJugador() {
  const nombre = document.getElementById('inp-nombre').value;
  const vida = parseInt(document.getElementById('inp-vida').value);
  const ataque = parseInt(document.getElementById('inp-ataque').value);
  const defensa = parseInt(document.getElementById('inp-defensa').value);

  // REGEX
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

  jugador = new Jugador(nombre, "img/personaje.png", vida, ataque, defensa);

  productosDisponibles = obtenerProductosMercado();
  enemigos = enemigosLista.map(e => new Enemigo(e.nombre, e.avatar, e.ataque, e.vida));
  jefe = new Jefe(jefeFinal.nombre, jefeFinal.avatar, jefeFinal.ataque, jefeFinal.vida, jefeFinal.multiplicador);
  seleccionados = [];
  rondaActual = 0;
  resultadosBatallas = [];

  mostrarEscena('market');
  cargarMercado();
}

function mostrarEscena(id) {
  document.querySelectorAll('.scene').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/**
 * Mostrar dinero disponible en tiempo real
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

    //formatear precio con descuento
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

  contenedor.querySelectorAll(".product-btn").forEach(btn => {
    btn.onclick = () => {
      const indice = Number(btn.dataset.indice);
      seleccionarProductoMercado(indice, listaDescuento[indice], btn.closest(".product-item"), btn);
    };
  });

  actualizarSeleccion();
}

function actualizarInfoDineroMercado() {
  let costeCesta = seleccionados.reduce((acc, sel) => acc + sel.producto.precio, 0);
  let dineroDisponible = jugador.dinero - costeCesta;

  document.getElementById('current-gold').textContent = dineroDisponible;
}

function seleccionarProductoMercado(indice, prod, div, boton) {
  let existe = seleccionados.find(sel => sel.indice === indice);

  if (existe) {
    // RETIRAR producto
    seleccionados = seleccionados.filter(sel => sel.indice !== indice);
    div.classList.remove('selected');
    boton.textContent = "Añadir";
  } else {
    // AÑADIR producto 
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
 * mostrar estado actual del jugador
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

function cargarBatallas() {
  mostrarEscena('battles');
  document.getElementById('battles-container').innerHTML = "";
  siguienteBatalla();
}

/**
 * ganar dinero extra
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
  // comprobar si es el jefe
  let esJefe = (enemigo === jefe);

  let resultado = combate(jugador, enemigo);
  resultadosBatallas.push(resultado);

  let mensajeDinero = "";

  if (resultado.ganador === "jugador") {
    jugador.sumarPuntos(resultado.puntos);
    jugador.vida = jugador.obtenerVidaTotal();

    // PREMIO EN ORO
    let premio = esJefe ? 10 : 5;
    jugador.dinero += premio;
    mensajeDinero = `<span style="color:yellow; font-weight:bold;">(+${premio} oro)</span>`;

  } else {
    jugador.vida = 0;
  }

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

  if (jugador.vida > 0 && rondaActual < listaLucha.length) {
    btnNextBattle.style.display = 'block';
    btnToResults.style.display = 'none';
  } else {
    btnNextBattle.style.display = 'none';
    btnToResults.style.display = 'block';
  }
}

/**
 * LocalStorage y Puntos totales + Monedas
 */
function mostrarResultados() {
  let listaLucha = enemigos.concat([jefe]);
  let ranking = "Novato";

  // Sumar el oro restante a la puntuación final
  jugador.puntos += jugador.dinero;

  if (jugador.vida > 0 && rondaActual === listaLucha.length && resultadosBatallas[resultadosBatallas.length - 1].ganador === "jugador") {
    ranking = obtenerRanking(jugador.puntos, UMBRAL_VETERANO);
  }

  // GUARDAR EN LOCALSTORAGE
  // Creamos un objeto con los datos
  const registroRanking = {
    nombre: jugador.nombre,
    puntuacion: jugador.puntos,
    monedasTotales: jugador.dinero
  };
  // Lo guardamos convertido a texto
  localStorage.setItem('rankingAventura', JSON.stringify(registroRanking));

  let mensaje = mostrarMensajeRanking(ranking);
  document.getElementById('results-container').innerHTML = `
    <h3>${ranking}</h3>
    <p><strong>Puntos totales (Score + Oro):</strong> ${jugador.puntos}</p>
    <p><strong>Oro final:</strong> ${jugador.dinero}</p>
    <p><strong>Vida final:</strong> ${jugador.vida}</p>
    <p>${mensaje}</p>
  `;

  if (typeof confetti === "function" && jugador.vida > 0) {
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
  }

  mostrarEscena('results');
}

// Botón para ver el ranking por consola
document.getElementById('btn-show-ranking').onclick = () => {
  const data = localStorage.getItem('rankingAventura');
  if (data) {
    console.table(JSON.parse(data));
    alert("Mira la consola (F12) para ver el ranking.");
  } else {
    console.log("No hay ranking guardado aún.");
    alert("No hay ranking guardado.");
  }
};


// LISTENERS 
document.getElementById('btn-buy').onclick = comprar;
document.getElementById('btn-skip-market').onclick = () => { mostrarEscena('player'); mostrarEstadoActual(); };
document.getElementById('btn-to-enemies').onclick = () => { mostrarEscena('enemies'); cargarEnemigos(); };
document.getElementById('btn-to-battles').onclick = cargarBatallas;
document.getElementById('btn-next-battle').onclick = siguienteBatalla;
document.getElementById('btn-to-results').onclick = mostrarResultados;
document.getElementById('btn-restart').onclick = () => location.reload();

// INICIO
iniciarAplicacion();