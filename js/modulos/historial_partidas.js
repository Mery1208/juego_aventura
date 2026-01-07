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

// 2. OBTENER HISTORIAL - SIEMPRE con datos de ejemplo
export function obtenerHistorial() {
  const datos = localStorage.getItem(STORAGE_KEY);
  
  // Aquí pongo los datos de ejemplo que siempre quiero que aparezcan
  // para que se vea el scroll y la tabla con contenido
  const ejemplos = [
    new Partida({nombre: 'Eve'}, 850, 'Veterano', 4, 250, 15),
    new Partida({nombre: 'Elias'}, 720, 'Veterano', 4, 180, 12),
    new Partida({nombre: 'Enrique'}, 650, 'Veterano', 3, 200, 14),
    new Partida({nombre: 'Alberto'}, 480, 'Novato', 2, 100, 10),
    new Partida({nombre: 'Aitor'}, 420, 'Novato', 2, 90, 11),
    new Partida({nombre: 'Pablo'}, 950, 'Veterano', 4, 300, 18),
    new Partida({nombre: 'Borja'}, 380, 'Novato', 2, 80, 9),
    new Partida({nombre: 'Merry'}, 320, 'Novato', 1, 60, 8)
  ];
  
  if (datos) {
    // Si ya hay partidas guardadas, las saco del localStorage
    const partidasGuardadas = JSON.parse(datos);
    // Filtro para quedarme solo con las partidas que jugué yo (no los ejemplos)
    const misPartidas = partidasGuardadas.filter(p => 
      !['Eve', 'Elias', 'Enrique', 'Alberto', 'Aitor', 'Pablo', 'Borja', 'Merry'].includes(p.nombreJugador)
    );
    // Devuelvo primero mis partidas y luego los ejemplos para que siempre haya datos
    return [...misPartidas, ...ejemplos];
  } else {
    // Si no hay nada guardado, devuelvo solo los ejemplos
    return ejemplos;
  }
}

// 3. GUARDAR PARTIDA
export function guardarPartida(partida) {
  // Obtengo el historial actual (que traerá los ejemplos si estaba vacío)
  const historial = obtenerHistorial();
  
  // Añado la nueva partida al principio
  historial.unshift(partida);

  // Si nos paso del máximo, borramos las antiguas
  if (historial.length > MAX_PARTIDAS) {
    historial.splice(MAX_PARTIDAS); // Corto el array al tamaño máximo
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  mostrarRankingEnConsola(); 
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

  // Aquí llamamos a tu función que ya trae los datos de Eve si es necesario
  const historial = obtenerHistorial();

  if (tbody) {
    tbody.innerHTML = '';
  }

  // Parte de tocar de "Sin partidas"
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
    // Si hay datos, limpio mensajes de error y muestro tabla
    const mensaje = document.getElementById('mensaje-sin-partidas');
    if (mensaje) mensaje.remove();

    if (contenedorTabla) contenedorTabla.classList.remove('oculto');

    // Dibujo las filas
    for (let i = 0; i < historial.length; i++) {
      const partida = historial[i];
      const tr = document.createElement('tr');

      // Colores de la tabla diferentes: par = beige, impar = marrón
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

// 6. MOSTRAR RANKING EN CONSOLA
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