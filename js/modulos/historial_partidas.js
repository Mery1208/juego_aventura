const STORAGE_KEY = 'historial_partidas';
const MAX_PARTIDAS = 10;

// 1. CLASE PARTIDA
export class Partida {
  constructor(datosJugador, puntos, rango, enemigosVencidos, monedas, duracion) {
    this.id = Date.now();
    this.fecha = new Date().toLocaleString('es-ES');
    this.nombreJugador = datosJugador.nombre;
    this.puntos = puntos;
    this.rango = rango;
    this.enemigosVencidos = enemigosVencidos;
    this.monedas = monedas || 0;
    this.duracion = duracion || 0;
  }
}

// 2. OBTENER HISTORIAL (Con tu lógica de datos iniciales)
export function obtenerHistorial() {
  const datos = localStorage.getItem(STORAGE_KEY);
  
  if (datos) {
    // Si ya existen datos, los devolvemos
    return JSON.parse(datos);
  } else {
    // Si NO hay datos, creamos los ejemplos, los guardamos y los devolvemos
    const ejemplos = [
      new Partida({nombre: 'Aragorn'}, 850, 'Veterano', 4, 250, 15),
      new Partida({nombre: 'Legolas'}, 720, 'Veterano', 4, 180, 12),
      new Partida({nombre: 'Gimli'}, 650, 'Veterano', 3, 200, 14),
      new Partida({nombre: 'Frodo'}, 480, 'Novato', 2, 100, 10),
      new Partida({nombre: 'Sam'}, 420, 'Novato', 2, 90, 11),
      new Partida({nombre: 'Gandalf'}, 950, 'Veterano', 4, 300, 18),
      new Partida({nombre: 'Boromir'}, 380, 'Novato', 2, 80, 9),
      new Partida({nombre: 'Merry'}, 320, 'Novato', 1, 60, 8)
    ];
    
    // IMPORTANTE: Guardamos esto en localStorage para que persista
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ejemplos));
    return ejemplos;
  }
}

// 3. GUARDAR PARTIDA
export function guardarPartida(partida) {
  // Obtenemos el historial actual (que traerá los ejemplos si estaba vacío)
  const historial = obtenerHistorial();
  
  // Añadimos la nueva partida al principio
  historial.unshift(partida);

  // Si nos pasamos del máximo, borramos las antiguas
  if (historial.length > MAX_PARTIDAS) {
    historial.splice(MAX_PARTIDAS); // Corta el array al tamaño máximo
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  mostrarRankingEnConsola(); // Opcional: ver en consola
  return historial;
}

// 4. LIMPIAR HISTORIAL
export function limpiarHistorial() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

// 5. RENDERIZAR TABLA (Visualización)
export function renderizarTablaHistorial() {
  const tbody = document.getElementById('tabla-body');
  const contenedorTabla = document.getElementById('contenedor-tabla');

  // Aquí llamamos a tu función que ya trae los datos de Aragorn si es necesario
  const historial = obtenerHistorial();

  if (tbody) {
    tbody.innerHTML = '';
  }

  // Manejo de "Sin partidas"
  if (historial.length === 0) {
    if (contenedorTabla) contenedorTabla.classList.add('oculto');
    
    // Mensaje de aviso si está vacío
    const escenaHistorial = document.querySelector('#escena-historial .scene-contenido');
    if (escenaHistorial && !document.getElementById('mensaje-sin-partidas')) {
      const mensaje = document.createElement('div');
      mensaje.id = 'mensaje-sin-partidas';
      mensaje.style.cssText = 'color: white; text-align: center; padding: 40px; font-size: 18px;';
      mensaje.textContent = 'No hay partidas registradas aún.';
      escenaHistorial.insertBefore(mensaje, escenaHistorial.firstChild);
    }
  } else {
    // Si hay datos, limpiamos mensajes de error y mostramos tabla
    const mensaje = document.getElementById('mensaje-sin-partidas');
    if (mensaje) mensaje.remove();

    if (contenedorTabla) contenedorTabla.classList.remove('oculto');

    // Dibujamos las filas
    for (let i = 0; i < historial.length; i++) {
      const partida = historial[i];
      const tr = document.createElement('tr');

      // Colores alternos: par = beige, impar = marrón
      let colorFondo = (i % 2 === 0) ? '#d8c392' : '#b8a066';
      tr.style.backgroundColor = colorFondo;

      tr.innerHTML = `
        <td>${partida.nombreJugador}</td>
        <td style="color: var(--color-texto-oscuro); font-weight: bold; font-size: 16px;">${partida.puntos}</td>
        <td style="color: var(--color-texto-oscuro);">${partida.monedas}</td>
      `;

      if (tbody) tbody.appendChild(tr);
    }
  }
}

// 6. EXTRAS (Consola y estadísticas)
export function mostrarRankingEnConsola() {
  const historial = obtenerHistorial();
  console.log('RANKING DE PARTIDAS');
  if (historial.length > 0) {
    const ranking = [...historial].sort((a, b) => b.puntos - a.puntos);
    ranking.forEach((p, i) => console.log(`${i + 1}. ${p.nombreJugador} - ${p.puntos} pts`));
  }
}

export function renderizarEstadisticas() {
  const historial = obtenerHistorial();
  if (historial.length > 0) {
    console.log('Total de partidas guardadas:', historial.length);
  }
}