const STORAGE_KEY = 'historial_partidas';
const MAX_PARTIDAS = 10;

// Clase Partida - Definición de la estructura de datos
export class Partida {
  constructor(datosJugador, puntos, rango, enemigosVencidos, monedas, duracion) {
    this.id = Date.now();
    this.fecha = new Date().toLocaleString('es-ES');
    // Aseguramos que nombreJugador tenga un valor por defecto si datosJugador falla
    this.nombreJugador = datosJugador ? datosJugador.nombre : 'Desconocido';
    this.puntos = puntos;
    this.rango = rango;
    this.enemigosVencidos = enemigosVencidos;
    this.monedas = monedas || 0;
    this.duracion = duracion || 0;
  }
}

// Obtener historial desde localStorage o generar datos iniciales si está vacío
export function obtenerHistorial() {
  const datos = localStorage.getItem(STORAGE_KEY);
  
  if (datos) {
    return JSON.parse(datos);
  } else {
    // Si no hay datos, creamos el set inicial de demostración
    const ejemplos = [
      new Partida({nombre: 'Maria'}, 850, 'Veterano', 4, 250, 15),
      new Partida({nombre: 'Albertito'}, 720, 'Veterano', 4, 180, 12),
      new Partida({nombre: 'Hermene'}, 650, 'Veterano', 3, 200, 14),
      new Partida({nombre: 'Luisito'}, 480, 'Novato', 2, 100, 10),
      new Partida({nombre: 'Evelia'}, 420, 'Novato', 2, 90, 11),
      new Partida({nombre: 'Chritsmas'}, 950, 'Veterano', 4, 300, 18),
      new Partida({nombre: 'Enrique'}, 380, 'Novato', 2, 80, 9),
      new Partida({nombre: 'Merry'}, 320, 'Novato', 1, 60, 8)
    ];
    
    // Guardamos estos ejemplos en el localStorage para la próxima vez
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ejemplos));
    return ejemplos;
  }
}

// Guardar nueva partida en localStorage
export function guardarPartida(partida) {
  // Obtenemos el historial actual (que traerá los ejemplos si es la primera vez)
  const historial = obtenerHistorial();
  
  // Añadimos la nueva partida al principio
  historial.unshift(partida);

  // Limitamos el historial al máximo permitido
  if (historial.length > MAX_PARTIDAS) {
    // Eliminamos los más antiguos (sobrantes al final del array)
    historial.splice(MAX_PARTIDAS); 
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));

  mostrarRankingEnConsola();
  return historial;
}

// Limpiar todo el historial
export function limpiarHistorial() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

// Mostrar ranking automáticamente en consola
export function mostrarRankingEnConsola() {
  const historial = obtenerHistorial();

  console.log('RANKING DE PARTIDAS');

  if (historial.length === 0) {
    console.log('No hay partidas registradas aún');
  } else {
    // Ordenamos copia del array por puntos descendente
    const ranking = [...historial].sort((a, b) => b.puntos - a.puntos);

    ranking.forEach((partida, index) => {
      console.log(`${index + 1}. ${partida.nombreJugador}`);
      console.log(`   Puntos: ${partida.puntos} | Rango: ${partida.rango} | Monedas: ${partida.monedas}`);
      console.log(`   Enemigos vencidos: ${partida.enemigosVencidos} | Fecha: ${partida.fecha}`);
    });
  }
}

// Renderizar tabla con colores alternos
export function renderizarTablaHistorial() {
  const tbody = document.getElementById('tabla-body');
  const contenedorTabla = document.getElementById('contenedor-tabla');

  const historial = obtenerHistorial();

  if (tbody) {
    tbody.innerHTML = '';
  }

  // Lógica de visualización
  if (historial.length === 0) {
    if (contenedorTabla) contenedorTabla.classList.add('oculto');
    mostrarMensajeSinPartidas(true);
  } else {
    mostrarMensajeSinPartidas(false);
    if (contenedorTabla) contenedorTabla.classList.remove('oculto');

    // Crear filas
    for (let i = 0; i < historial.length; i++) {
      const partida = historial[i];
      const tr = document.createElement('tr');

      // Colores alternos: par = beige, impar = marrón
      tr.style.backgroundColor = (i % 2 === 0) ? '#d8c392' : '#b8a066';

      tr.innerHTML = `
        <td>${partida.nombreJugador}</td>
        <td style="color: var(--color-texto-oscuro); font-weight: bold; font-size: 16px;">${partida.puntos}</td>
        <td style="color: var(--color-texto-oscuro);">${partida.monedas}</td>
      `;

      if (tbody) tbody.appendChild(tr);
    }
  }
}

// Helper para mostrar/ocultar mensaje de "No hay partidas"
function mostrarMensajeSinPartidas(mostrar) {
    const escenaHistorial = document.querySelector('#escena-historial .scene-contenido');
    const msgId = 'mensaje-sin-partidas';
    const existeMensaje = document.getElementById(msgId);

    if (mostrar && !existeMensaje && escenaHistorial) {
        const mensaje = document.createElement('div');
        mensaje.id = msgId;
        mensaje.style.cssText = 'color: white; text-align: center; padding: 40px; font-size: 18px;';
        mensaje.textContent = 'No hay partidas registradas aún.';
        escenaHistorial.insertBefore(mensaje, escenaHistorial.firstChild);
    } else if (!mostrar && existeMensaje) {
        existeMensaje.remove();
    }
}

// Mostrar estadísticas simples en consola
export function renderizarEstadisticas() {
  const historial = obtenerHistorial();
  if (historial.length > 0) {
    console.log('Total de partidas guardadas:', historial.length);
  }
}