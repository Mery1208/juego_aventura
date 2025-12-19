import { inicializarMonedero, obtenerMonedas, restarMonedas, sumarMonedas, animarCambioMonedas, tieneMonedas } from './modulos/monedero.js';
import { Jugador } from './clases/Jugador.js';
import { showScene, inicializarInventarioVacio, cargarInventario } from './modulos/Utils.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { Producto } from './clases/Producto.js';
import { PRODUCTOS_BASE, ENEMIGOS_BASE, MAX_INVENTARIO } from './modulos/constants.js';
import { obtenerProductosConDescuentoAleatorio, renderizarProductos } from './modulos/mercado.js';
import { combate } from './modulos/batalla.js';
import { mostrarFormularioRegistro, cargarPersonajeGuardado, tienePersonajeGuardado } from './modulos/formulario_registro.js';
import { guardarPartida, Partida, renderizarTablaHistorial, renderizarEstadisticas } from './modulos/historial_partidas.js';

const estado = {
    jugador: null,
    datosPersonaje: null,
    productosDisponibles: [],
    cesta: [],
    enemigos: [],
    indiceEnemigoActual: 0,
    inventarioVisual: [null, null, null, null, null, null],
    tiempoInicio: null
}

function init() {
    showScene('escena-registro');
    configurarFormulario();
    wireEvents();
    inicializarMonedero();
    estado.productosDisponibles = obtenerProductosConDescuentoAleatorio();
}

function configurarFormulario() {
    mostrarFormularioRegistro((datosPersonaje) => {
        iniciarConPersonaje(datosPersonaje);
        estado.tiempoInicio = Date.now();
        showScene('escena-inicio');
    });
}

function iniciarConPersonaje(datosPersonaje) {
    try {
        const vidaBase = 100 + (datosPersonaje.bonus?.vida || 0);
        const ataqueBase = (datosPersonaje.bonus?.ataque || 0);
        const defensaBase = (datosPersonaje.bonus?.defensa || 0);
        
        estado.jugador = new Jugador({ 
            nombre: datosPersonaje.nombre, 
            avatar: datosPersonaje.avatar, 
            vida: vidaBase, 
            ataque: ataqueBase,
            defensa: defensaBase, 
            puntos: 0 
        });

        estado.jugador.ataqueBase = ataqueBase;
        estado.jugador.defensaBase = defensaBase;

        estado.datosPersonaje = datosPersonaje;
        inicializarInventarioVacio(MAX_INVENTARIO);
        pintarStatsInicio();
        
    } catch (e) {
        console.error("Error al crear el personaje:", e);
        alert("Hubo un error al crear el personaje.");
    }
}

function pintarStatsInicio() {
  if (!estado.jugador) return; 
  document.getElementById('inicio-ataque').textContent = estado.jugador.getAtaqueTotal();
  document.getElementById('inicio-defensa').textContent = estado.jugador.getDefensaTotal();
  document.getElementById('inicio-vida').textContent = estado.jugador.getVidaTotal();
  document.getElementById('inicio-monedas').textContent = obtenerMonedas();
  
  const titulo = document.getElementById('cazador-titulo');
  if(titulo) titulo.textContent = estado.jugador.nombre;
  
  const avatarGrande = document.querySelector('#inicio-top-area .jugador-avatar-large img');
  if(avatarGrande && estado.jugador.avatar) avatarGrande.src = estado.jugador.avatar;
}

function wireEvents() {
    const binds = [
        { id: 'btn-ir-mercado-desde-inicio', action: () => irAMercado() },
        { id: 'btn-ir-estado', action: () => { showScene('escena-estado'); pintarEstadoActualizado(); } },
        { id: 'btn-ir-enemigos-2', action: () => irAEnemigos() },
        { id: 'btn-empezar-batallas', action: () => { 
            estado.indiceEnemigoActual = 0; 
            showScene('escena-batallas'); 
            iniciarSiguienteCombate(); 
        } },
        { id: 'btn-ver-ranking', action: () => mostrarRankingConsola() },
        { id: 'btn-ir-historial-desde-final', action: () => { 
            showScene('escena-historial'); 
            renderizarEstadisticas(); 
            renderizarTablaHistorial(); 
        } },
        { id: 'btn-historial-a-inicio', action: () => {
            localStorage.removeItem('personaje_activo'); 
            location.reload();
        } }
    ];

    binds.forEach(btn => {
        const el = document.getElementById(btn.id);
        if(el) el.addEventListener('click', btn.action);
    });

    document.getElementById('btn-siguiente-combate').addEventListener('click', () => {
        if (estado.indiceEnemigoActual < estado.enemigos.length) {
            iniciarSiguienteCombate();
        } else {
            document.getElementById('resultado-combate').innerHTML = '';
            finalizarJuego(); 
        }
    });
}

function mostrarNotificacionCarrito(nombreProducto) {
  const notificacion = document.createElement('div');
  notificacion.className = 'cart-notificacion';
  notificacion.textContent = `${nombreProducto} añadido`;
  document.body.appendChild(notificacion);
  setTimeout(() => notificacion.remove(), 2000);
}

function irAMercado() { 
    showScene('escena-mercado');
    actualizarDisplayMonedas();

    if (!PRODUCTOS_BASE || PRODUCTOS_BASE.length === 0) {
        alert('Error: No hay productos disponibles');
        return;
    }

    const seleccionarSet = () => new Set(estado.cesta.map(p => p.nombre));

    const onToggleCallback = (producto, seleccionado) => {
        if (seleccionado) {
            if (!tieneMonedas(producto.precio)) {
                alert(`No tienes suficiente dinero. Necesitas ${producto.precio} monedas`);
                const tarjeta = Array.from(document.querySelectorAll('.product-card')).find(
                    card => card.querySelector('h4').textContent === producto.nombre
                );
                if (tarjeta) {
                    tarjeta.classList.remove('selected');
                    tarjeta.querySelector('.btn-toggle').textContent = 'Añadir';
                }
                return;
            }
      
            if (estado.cesta.length >= MAX_INVENTARIO) {
                alert(`Inventario lleno (${MAX_INVENTARIO} objetos máx).`);
                const tarjeta = Array.from(document.querySelectorAll('.product-card')).find(
                    card => card.querySelector('h4').textContent === producto.nombre
                );
                if (tarjeta) {
                    tarjeta.classList.remove('selected');
                    tarjeta.querySelector('.btn-toggle').textContent = 'Añadir';
                }
                return;
            }

            const añadido = estado.jugador.añadirObjeto(producto); 
            if (!añadido) {
                alert("No se pudo añadir al inventario del jugador.");
                return;
            }

            restarMonedas(producto.precio);
            animarCambioMonedas(-producto.precio);
            
            estado.cesta.push(producto);
            actualizarInventarioVisual(producto);
            mostrarNotificacionCarrito(producto.nombre);
            actualizarDisplayMonedas();
        } else {
            sumarMonedas(producto.precio);
            animarCambioMonedas(producto.precio);
     
            estado.cesta = estado.cesta.filter(p => p.nombre !== producto.nombre);
            estado.jugador.retirarObjeto(producto.nombre);
            quitarDelInventarioVisual(producto.nombre);
            actualizarDisplayMonedas();
        }
        
        actualizarResumenOferta();
        pintarStatsInicio();
    }

    renderizarProductos(estado.productosDisponibles, onToggleCallback, seleccionarSet());
    actualizarResumenOferta();
}

function actualizarDisplayMonedas() {
    const elemento = document.getElementById('monedas-disponibles');
    if (elemento) {
        elemento.textContent = obtenerMonedas();
    }
}

function actualizarResumenOferta() {
  let totalOriginal = 0;
  let totalDescontado = 0;
  
  estado.cesta.forEach(p => {
    totalOriginal += p.precioOriginal || p.precio;
    totalDescontado += p.precio;
  });
  
  const descuento = totalOriginal - totalDescontado;

  const formatear = (n) => `${n.toFixed(2)} €`.replace('.', ',');
  
  document.getElementById('total-seleccion').textContent = formatear(totalOriginal);
  document.getElementById('total-descuento').textContent = formatear(descuento);
  document.getElementById('total-con-descuento').textContent = formatear(totalDescontado);
}

function pintarEstadoActualizado() {
  document.getElementById('estado-ataque').textContent = estado.jugador.getAtaqueTotal();
  document.getElementById('estado-defensa').textContent = estado.jugador.getDefensaTotal();
  document.getElementById('estado-vida').textContent = estado.jugador.getVidaTotal();
  document.getElementById('estado-monedas').textContent = obtenerMonedas();
  
  const avatarGrande = document.querySelector('#estado-top-area .jugador-avatar-large img');
  if(avatarGrande && estado.jugador.avatar) avatarGrande.src = estado.jugador.avatar;
  const titulo = document.getElementById('estado-titulo');
  if(titulo) titulo.textContent = estado.jugador.nombre;
}
function irAEnemigos() { 
  showScene('escena-enemigos');
  estado.enemigos = ENEMIGOS_BASE.map(e => e.jefe ? new Jefe(e) : new Enemigo(e));
  renderizarEnemigos(estado.enemigos);
}

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

function iniciarSiguienteCombate() {
  const enemigo = estado.enemigos[estado.indiceEnemigoActual];
  const { ganador, puntosGanados, monedasGanadas } = combate(enemigo, estado.jugador);

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
    <p>Ganador: ${ganador} | Puntos ganados: ${puntosGanados} | Monedas Ganadas: ${monedasGanadas}</p>
  `;

  setTimeout(() => {
    const pImg = document.querySelector('.combatiente:first-child img');
    const eImg = document.querySelector('.combatiente:last-child img');
    if (pImg && eImg) {
      pImg.style.animation = 'none'; eImg.style.animation = 'none';
      pImg.offsetHeight; 
      pImg.style.animation = ''; eImg.style.animation = '';
    }
  }, 10);

  if (ganador === 'Jugador') {
    estado.jugador.sumarPuntos(puntosGanados);
    sumarMonedas(monedasGanadas);
  }
  
  setTimeout(() => {
      const monedas = document.querySelectorAll('.moneda-cayendo');
      monedas.forEach(moneda => {
        moneda.style.animation = 'none';
        moneda.offsetHeight; 
        moneda.style.animation = '';
      });
    }, 100);
  
  estado.indiceEnemigoActual++;

  const btn = document.getElementById('btn-siguiente-combate');
  btn.textContent = estado.indiceEnemigoActual >= estado.enemigos.length ? 'Finalizar' : 'Continuar';
}

function finalizarJuego() {
  showScene('escena-final');
  
  const monedasRestantes = obtenerMonedas();
  const puntosFinales = estado.jugador.puntos + monedasRestantes;
  
  document.getElementById('final-puntos').textContent = puntosFinales;
  document.getElementById('final-monedas').textContent = monedasRestantes;
  
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
  }
  
  function calcularRango(puntos) {
    if (puntos >= 500) {
      return 'Veterano';
      } else {
      return 'Novato';
      }
    }

  const rango = calcularRango(puntosFinales);
  document.getElementById('final-rango').textContent = `El jugador ha subido de nivel ${rango}.`;

  //  Calculo el tiempo total que duró la partida en minutos
  let tiempoTotal = 0;
  if (estado.tiempoInicio) {
    const tiempoEnMilisegundos = Date.now() - estado.tiempoInicio;
    tiempoTotal = Math.floor(tiempoEnMilisegundos / 60000); // Convertir a minutos
  }
  
// Creo el objeto de partida con todos los datos
  const partida = new Partida(
    estado.datosPersonaje || { nombre: 'Cazador', clase: 'Desconocido' },
    puntosFinales,
    rango,
    estado.indiceEnemigoActual,
    monedasRestantes,
    tiempoTotal
  );
  
  // Guardo la partida en localStorage
  guardarPartida(partida);
}

function mostrarRankingConsola() {
    const historial = JSON.parse(localStorage.getItem('historial_partidas') || '[]');
    
    console.log('%cRANKING DE PARTIDAS ');
    
    if (historial.length === 0) {
        console.log('%cNo hay partidas registradas aún');
    } else {
        const ranking = [...historial].sort((a, b) => b.puntos - a.puntos);
        
        ranking.forEach((partida, index) => {
            const medalla = index === 0 ? '' : index === 1 ? '' : index === 2 ? '' : `${index + 1}.`;
            console.log(`%c${medalla} ${partida.nombreJugador}`);
            console.log(`   Puntos: ${partida.puntos} | Rango: ${partida.rango} | Monedas: ${partida.monedas}`);
            console.log(`   Enemigos vencidos: ${partida.enemigosVencidos} | Fecha: ${partida.fecha}`);
        });
    }
    
}

function actualizarInventarioVisual(producto) {
  const idx = estado.inventarioVisual.findIndex(item => item === null);
  if (idx !== -1) estado.inventarioVisual[idx] = { nombre: producto.nombre, imagen: producto.imagen };
  cargarInventario(estado.inventarioVisual);
  
  setTimeout(() => {
    const slots = document.querySelectorAll('.inventario-item');
    if (slots[idx]) {
      slots[idx].classList.add('just-added');
      setTimeout(() => slots[idx].classList.remove('just-added'), 600);
    }
  }, 50);
}

function quitarDelInventarioVisual(nombreProducto) {
  const idx = estado.inventarioVisual.findIndex(item => item && item.nombre === nombreProducto);
  if (idx !== -1) estado.inventarioVisual[idx] = null;
  cargarInventario(estado.inventarioVisual);
}


init();