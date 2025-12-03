import { Jugador } from './clases/Jugador.js';
import { showScene, inicializarInventarioVacio, cargarInventario } from './modulos/Utils.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { Producto } from './clases/Producto.js';
import { PRODUCTOS_BASE, ENEMIGOS_BASE } from './modulos/constants.js';
import { obtenerProductosConDescuentoAleatorio, renderizarProductos, renderizarCesta } from './modulos/mercado.js';
import { MAX_INVENTARIO } from './modulos/constants.js';
import { combate } from './modulos/batalla.js';

//INDICE global
//Es mi almacén de datos que yo uso para guardar la información importante del juego.
const estado = {
    jugador: null, // Aquí guardo todos los datos de mi personaje.
    productosDisponibles: [], // Lista de productos que muestro en el Mercado
    cesta: [],// Productos que seleccioné para comprar
    enemigos: [], // Lista de todos los enemigos a los que me voy a enfrentar
    indiceEnemigoActual: 0, // Uso esta variable para saber contra qué enemigo me toca pelear ahora , empieza en 0
    inventarioVisual: [null, null, null, null, null, null] //array de los items que hay en el inventario
}

// Función  init
// Lo que hago aquí es preparar todo para que el juego arranque por primera vez.

function init() {
    console.log('Iniciando juego..');
    estado.jugador = new Jugador({ nombre: 'Cazador', avatar: './img/jugador/maria.png', vida: 100, puntos: 0 });
    inicializarInventarioVacio(6);
    pintarStatsInicio();
    wireEvents();
    console.log('Aplicación inicializada correctamente');
}


//-----------------ESCENA 1-------------------------------
// Muestra los datos básicos de mi personaje.
function pintarStatsInicio() {
  if (!estado.jugador) return; 
  const inventarioJugador = estado.jugador.inventario || [];
  // Hice una suma de los bonus de ataque que me dan los objetos de tipo arma que tengo.
  const bonusArmas = inventarioJugador.filter(p => p.tipo === 'Arma').reduce((a, p) => a + (p.bonus || 0), 0);
    // Hice lo mismo para la defensa, sumando los bonus de las defensas.
  const bonusArmadura = inventarioJugador.filter(p => p.tipo === 'Armadura').reduce((a, p) => a + (p.bonus || 0), 0);
  // uso el getVidaTotal de la clase Jugador para obtener mi vida final.
  const vidaTotal = estado.jugador.getVidaTotal();

  // y actualizo el texto en la pantalla en index con estos números.
  document.getElementById('inicio-ataque').textContent = bonusArmas;
  document.getElementById('inicio-ataque').textContent = bonusArmas;
  document.getElementById('inicio-defensa').textContent = bonusArmadura;
  document.getElementById('inicio-vida').textContent = vidaTotal;
  document.getElementById('inicio-puntos').textContent = estado.jugador.puntos;
}
  // navego y los eventos
//Aquí es donde defino qué pasa cuando pulso cada botón.
function wireEvents() {
  // Botón  continuar de la  escena 1, me lleva al mercado.
 document.getElementById('btn-iniciar-aventura').addEventListener('click', () => {
    irAMercado();
  });

  //boton comprar
  const btnComprar = document.getElementById('btn-comprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      renderizarCesta(estado.cesta);
      pintarStatsInicio();
      pintarEstadoActualizado();
      console.log('Compra realizada y stats actualizados');
    });
  }
  // Botón  continuar de la  escena 2, me lleva al 3.
  document.getElementById('btn-ir-estado').addEventListener('click', () => {
    showScene('escena-estado');
    pintarEstadoActualizado();
  });

    // Botón  continuar de la  escena 3, me lleva al 4.
  document.getElementById('btn-ir-enemigos-2').addEventListener('click', () => {
    irAEnemigos();
  });

  // Botón  continuar de la  escena 4, me lleva al 5.
  document.getElementById('btn-empezar-batallas').addEventListener('click', () => {
    estado.indiceEnemigoActual = 0; 
    showScene('escena-batallas');
    iniciarSiguienteCombate(); 
  });

    // Botón Siguiente Combate escena 5.
  document.getElementById('btn-siguiente-combate').addEventListener('click', () => {
    // Si todavía me quedan enemigos en mi lista, sigo peleando.
    if (estado.indiceEnemigoActual < estado.enemigos.length) {
      iniciarSiguienteCombate();
    } else {
      // Si ya no quedan, limpio la pantalla de resultados y llamo a finalizarJuego.
      document.getElementById('resultado-combate').innerHTML = '';
      finalizarJuego(); 
    }
  });

  //boton reiniciar q va de la escena 6 a la 1 de nuevo
  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    //Reseteo mi jugador a su estado inicial.
    estado.jugador = new Jugador({ nombre: 'Cazador', avatar: './img/jugador/maria.png', vida: 100, puntos: 0 });
   //Vacié todas las listas y el inventario visual.
    estado.cesta = [];
    estado.inventarioVisual = [null, null, null, null, null, null];
    inicializarInventarioVacio(6);
  //Vuelvo a mostrar las estadísticas y la primera pantalla.
    pintarStatsInicio();
    showScene('escena-inicio');
  });
}

// Función  MostrarNotificacionCarrito
// Lo que hice: creé esta función para mostrar un mensaje visual cuando
// añado un producto al carrito. La notificación aparece durante 2 segundos
// y luego desaparece automáticamente.

/**
 * Muestra una notificación visual cuando se añade un producto al carrito
 * @param {string} nombreProducto - El nombre del producto que se ha añadido
 */

function mostrarNotificacionCarrito(nombreProducto) {
  // Creé el elemento HTML de la notificación.
  const notificacion = document.createElement('div');
  notificacion.className = 'cart-notificacion';
  notificacion.textContent = ` ${nombreProducto} añadido`;
  
  // Lo añadí al body para que se vea en pantalla bonico.
  document.body.appendChild(notificacion);
  
  //Después de 2 segundos, lo quito del DOM, 
  setTimeout(() => {
    notificacion.remove();
  }, 2000);
}

//-----------------ESCENA 2-------------------------------
//preparo la tienda y la lógica de compra.

function irAMercado() {
  showScene('escena-mercado');

// Generé una lista de productos para la tienda, con un descuento especial al azar.
  estado.productosDisponibles = obtenerProductosConDescuentoAleatorio();
  const seleccionarSet = () => new Set(estado.cesta.map(p => p.nombre));

  // funcion que se ejecuta cada vez que hago añadir o retirar.
  const onToggleCallback = (producto, seleccionado) => {
    if (seleccionado) {
      // Intenté añadir el producto a mi inventario real.
      const añadido = estado.jugador.añadirObjeto(producto);
      if (!añadido) {
      // Si esta lleno, le aviso al jugador.
        alert(`No puedes tener más de ${MAX_INVENTARIO} productos en el inventario.`);
        const seleccionarSet = () => new Set(estado.cesta.map(p => p.nombre));
        renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
        return;
      }
      // Lo añado a la lista de seleccionados y al inventario visual.
      estado.cesta.push(new Producto(producto));
      actualizarInventarioVisual(new Producto(producto));
      

      // muestro notificación al añadir producto
      // llamo a la función que muestra el mensaje "Producto añadido"

      mostrarNotificacionCarrito(producto.nombre);
    } else {
       // Si pulso retirar, lo quito de la cesta y de mi inventario.
      estado.cesta = estado.cesta.filter(p => p.nombre !== producto.nombre);
      estado.jugador.retirarObjeto(producto.nombre);
      quitarDelInventarioVisual(producto.nombre);
    }
    
// si selecciono o quito algo, siempre hago esto:
    if (typeof aplicarDescuentoAutomatico === 'function') aplicarDescuentoAutomatico(0.20);
    actualizarResumenOferta();
    pintarStatsInicio();
    pintarEstadoActualizado();
    
//  vuelvo a renderizar productos para sincronizar estado de selección cuando haya búsqueda activa.
    const buscador = document.getElementById('buscar-producto');
    if (buscador && buscador.value.trim() !== '') {
      const term = buscador.value.trim().toLowerCase();
      const filtrados = estado.productosDisponibles.filter(p => p.nombre.toLowerCase().includes(term));
      renderizarProductos(filtrados, onToggleCallback, seleccionarSet());
    }
  }
  renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
  actualizarResumenOferta();

// busqueda filtrar por nombre en tiempo real
  const inputBuscar = document.getElementById('buscar-producto');
  const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
  if (inputBuscar) {
    inputBuscar.value = '';
    inputBuscar.addEventListener('input', (e) => {
      const term = e.target.value.trim().toLowerCase();
      const filtrados = term === '' ? estado.productosDisponibles : estado.productosDisponibles.filter(p => p.nombre.toLowerCase().includes(term));
      renderizarProductos(filtrados, onToggleCallback, seleccionarSet());
    });
  }
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      if (inputBuscar) inputBuscar.value = '';
      renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
    });
  }

  /**
 * Aplica un descuento automático a todos los productos de la cesta
 * @param {number} porcentaje - El porcentaje de descuento a aplicar (por ejemplo, 0.20 para 20%)
 */

  // Función que cambia el precio de los productos en la cesta aplicándoles el descuento.
  function aplicarDescuentoAutomatico(porcentaje = 0.20) {
    estado.cesta = estado.cesta.map(p => {
      const copia = new Producto(p);
      copia.precioOriginal = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
      copia.precio = Math.round(copia.precioOriginal * (1 - porcentaje) * 100) / 100;
      return copia;
    });
  }
  // Ejecuto el descuento al entrar para asegurar que los precios mostrados están bien.
  aplicarDescuentoAutomatico(0.20);
}


// -----------------ESCENA 3 --------------------------- 
// Muestra mis datos después de haber comprado.

function pintarEstadoActualizado() {
  document.getElementById('estado-ataque').textContent = estado.jugador.getAtaqueTotal();
  document.getElementById('estado-defensa').textContent = estado.jugador.getDefensaTotal();
  document.getElementById('estado-vida').textContent = estado.jugador.getVidaTotal();
  document.getElementById('estado-puntos').textContent = estado.jugador.puntos;
}

/* Resumen y descuento */
function actualizarResumenOferta() {

// Función para formatear el número con dos decimales y el símbolo de euro.
  const format = v => v.toFixed(2).replace('.', ',') + ' €';
  const lista = document.getElementById('resumen-oferta');
  const itemsContainerId = 'resumen-items-list';
  let itemsContainer = document.getElementById(itemsContainerId);
  if (lista && !itemsContainer) {
    const div = document.createElement('div');
    div.id = itemsContainerId;
    div.style.marginTop = '8px';
    div.style.maxHeight = '180px';
    div.style.overflowY = 'auto';
    lista.appendChild(div);
    itemsContainer = div;
  }

 //los calculos totales de todo
  const totalOriginal = estado.cesta.reduce((acc, p) => acc + ((p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0)), 0);
  const totalDescontado = estado.cesta.reduce((acc, p) => acc + (p.precio || 0), 0);
  const descuento = Math.round((totalOriginal - totalDescontado) * 100) / 100;


  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    estado.cesta.forEach(p => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      const nombre = document.createElement('div');
      nombre.textContent = p.nombre;
      const precios = document.createElement('div');
      const orig = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
      const disc = (p.precio !== undefined) ? p.precio : orig;
      precios.textContent = `${format(orig)} → ${format(disc)}`;
      row.appendChild(nombre);
      row.appendChild(precios);
      itemsContainer.appendChild(row);
    });
  }

  // actualizo el texto final de la caja de resumen
  const elTotal = document.getElementById('total-seleccion');
  const elDesc = document.getElementById('total-descuento');
  const elCon = document.getElementById('total-con-descuento');
  if (elTotal) elTotal.textContent = format(totalOriginal || 0);
  if (elDesc) elDesc.textContent = format(descuento || 0);
  if (elCon) elCon.textContent = format(totalDescontado || 0);
}

/**
 * Aplica un descuento global a todos los productos de la cesta
 * @param {number} porcentaje - El porcentaje de descuento a aplicar (por ejemplo, 0.20 para 20%)
 */

function aplicarDescuentoGlobal(porcentaje) {
  //esta funcion no la suo, pero la mantengo 
  estado.cesta = estado.cesta.map(p => {
    const copia = new Producto(p);
    copia.precioOriginal = (p.precioOriginal !== undefined) ? p.precioOriginal : (p.precio || 0);
    copia.precio = Math.round(copia.precioOriginal * (1 - porcentaje) * 100) / 100;
    return copia;
  });
  actualizarResumenOferta();
}

//-------------------- Escena 4 -Enemigos ---------------------------------
// Preparé y muestré la lista de enemigos.
function irAEnemigos() {
  showScene('escena-enemigos');
  //creo la lista de objetos enemigo y jefe a partit de los datos que tengo.
  estado.enemigos = ENEMIGOS_BASE.map(e => e.jefe ? new Jefe(e) : new Enemigo(e));
  //pongo las tarjetas de enemigo en el juego
  renderizarEnemigos(estado.enemigos);
}
/**
 * Renderiza la lista de enemigos en la pantalla
 * @param {Array<Enemigo>} lista - Array de objetos Enemigo o Jefe a mostrar
 */

function renderizarEnemigos(lista) {
  const cont = document.getElementById('lista-enemigos');
  cont.innerHTML = '';
  lista.forEach(e => {
    const card = document.createElement('div');
    card.className = 'enemy-card';
    card.innerHTML = `
      <img src="${e.imagen}" alt="${e.nombre}">
      <h4>${e.nombre}</h4>
      <p><strong>Ataque:</strong> ${e.ataque}</p>
      <p><strong>Vida:</strong> ${e.vida}</p>
      ${'multiplicadorPupa' in e ? `<p><strong>Jefe x${e.multiplicadorPupa}</strong></p>` : ''}
    `;
    cont.appendChild(card);
  });
}


// Combates 
// Inicia la pelea contra el siguiente enemigo.
// Además de la lógica del combate, me aseguré de que

function iniciarSiguienteCombate() {
  const enemigo = estado.enemigos[estado.indiceEnemigoActual];
//usé la funcion combate para la pelea
  const { ganador, puntosGanados } = combate(enemigo, estado.jugador);

  //muestro manera visual la pelea
  const resDiv = document.getElementById('resultado-combate');
  resDiv.innerHTML = `
    <div class="combate-visual">
      <div class="combatiente">
        <img src="${estado.jugador.avatar}" alt="Jugador" />
        <p>${estado.jugador.nombre}</p>
      </div>
      <div class="versus">VS</div>
      <div class="combatiente">
        <img src="${enemigo.imagen}" alt="${enemigo.nombre}" />
        <p>${enemigo.nombre}</p>
      </div>
    </div>
    <p>Ganador: ${ganador} | Puntos ganados: ${puntosGanados}</p>
  `;

  // REINICIO con aanimaciónEsto es para que funcione en cada combate
  // Lo que hice aquí fue resetear la animación CSS para que se vuelva a ejecutar.
  // Sin esto, la animación solo se vería en el primer combate.
  setTimeout(() => {
    //Busco las imágenes del jugador y del enemigo en el DOM.
    const combatPlayerImg = document.querySelector('.combatiente:first-child img');
    const combatEnemyImg = document.querySelector('.combatiente:last-child img');
    
    if (combatPlayerImg && combatEnemyImg) {
      //Quité la animación css poniéndola en none.
      combatPlayerImg.style.animation = 'none';
      combatEnemyImg.style.animation = 'none';
      
       //obligo al navegador a cargar.
      // Usé .offsetHeight (busqué en internet) porque al pedir un valor visual, el navegador 
      // recalcula todo y olvida que ya había una animación y no me funcionaba.
      combatPlayerImg.offsetHeight;
      combatEnemyImg.offsetHeight;
      
      //Volví a activar la animación css dejando el valor vacío.
      // Como el navegador cargó, ahora cree que es la primera vez 
      // que se usa y la animación se repite.
      combatPlayerImg.style.animation = '';
      combatEnemyImg.style.animation = '';
    }
  }, 10); //espera 10 ms oara asegura que html funciona.

  // Si gané, me sumo los puntos obtenidos.
  if (ganador === 'Jugador') {
    estado.jugador.sumarPuntos(puntosGanados);
  }
// Aumento el contador para saber que ya he terminado con este enemigo.
  estado.indiceEnemigoActual++;

  // Cambio el texto del botón a finalizar si ya es el último enemigo.
  const btn = document.getElementById('btn-siguiente-combate');
  btn.textContent = estado.indiceEnemigoActual >= estado.enemigos.length ? 'Finalizar' : 'Continuar';
}


//---------------------------ESCENA 6 RESULTADO---------------------------------------
// Calculo el resultado final y el rango Y AÑADO LO DE ANIMACIÓN CONFETTI
function finalizarJuego() {
  console.log('Finalizando juego con puntos:', estado.jugador.puntos);
  showScene('escena-final');
  
  document.getElementById('final-puntos').textContent = estado.jugador.puntos;
  
  //confetti
  if (typeof confetti === 'function') {
    // Lancé confetti desde ambos lados de la pantalla
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Esperé un poquito y lancé más confetti para que dure más tiempo
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
  
  // Función local de emergencia para calcular el rango (la primera me falla).
  const distinguirJugadorLocal = (puntuacion, umbral = 500) => (puntuacion >= umbral ? 'Veterano' : 'Novato');


  const importPromise = import('./modulos/ranking.js')
    .then(mod => ({ fn: (typeof mod.distinguirJugador === 'function') ? mod.distinguirJugador : distinguirJugadorLocal }))
    .catch(err => {
      console.warn('Fallo al importar ranking.js:', err);
      return { fn: distinguirJugadorLocal };
    });

  //pongo limite 5 segundos para que no se quede cargando 
  const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ fn: distinguirJugadorLocal }), 5000));

// espera la que se resuelva primero.
  Promise.race([importPromise, timeoutPromise])
    .then(result => {
      try {
        const rango = result && typeof result.fn === 'function' ? result.fn(estado.jugador.puntos) : 'Novato';
        document.getElementById('final-rango').textContent = `El Jugador ha subido al nivel ${rango}.`;
        console.log('Rango asignado:', rango);
      } catch (e) {
        console.error('Error al calcular rango:', e);
        document.getElementById('final-rango').textContent = `El Jugador ha logrado subir a Novato.`;
      }
    });
 
}


// Inventario Visual (la barra de abajo)
// Objetivo: Gestiona los iconos de los productos comprados.
// Añade un nuevo producto al primer hueco libre de la barra.
//  además de añadir el producto, le pongo una animación
// de pulso para que se note que se acaba de añadir algo nuevo.
/**
 * Actualiza el inventario visual añadiendo un producto al primer hueco libre
 * @param {Producto} producto - El producto que se va a añadir al inventario visual
 */

function actualizarInventarioVisual(producto) {
  const idx = estado.inventarioVisual.findIndex(item => item === null);
  if (idx !== -1) {
    estado.inventarioVisual[idx] = { nombre: producto.nombre, imagen: producto.imagen };
  } else {
    alert(`No puedes tener más de ${MAX_INVENTARIO} productos en el inventario.`);
  }
  cargarInventario(estado.inventarioVisual);
  

  //animación de pulso. cuando llega a 600ms se apaga
  setTimeout(() => {
    const slots = document.querySelectorAll('.inventario-item');
    if (slots[idx]) {
      slots[idx].classList.add('just-added');
      setTimeout(() => {
        slots[idx].classList.remove('just-added');
      }, 600);
    }
  }, 50);

}

/**
 * Quita un producto del inventario visual
 * @param {string} nombreProducto - El nombre del producto a retirar
 */
// Quita un producto de la barra de inventario.
function quitarDelInventarioVisual(nombreProducto) {
  const idx = estado.inventarioVisual.findIndex(item => item && item.nombre === nombreProducto);
  if (idx !== -1) {
    estado.inventarioVisual[idx] = null;
  }
  cargarInventario(estado.inventarioVisual);
}

// Llamada para que todo empiece
init();