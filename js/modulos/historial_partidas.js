const STORAGE_KEY = 'historial_partidas';
const MAX_PARTIDAS = 10;

// Clase Partida - solo con los datos necesarios
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

// Guardar partida en localStorage
export function guardarPartida(partida) {
  const historial = obtenerHistorial();
  historial.unshift(partida); 
  
  if (historial.length > MAX_PARTIDAS) {
    historial.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  return historial;
}

// Obtener historial desde localStorage
export function obtenerHistorial() {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (datos) {
    return JSON.parse(datos);
  } else {
    return [];
  }
}

// Limpiar todo el historial
export function limpiarHistorial() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

// Renderizar tabla con colores alternados (beige/marrón)
export function renderizarTablaHistorial() {
  const tbody = document.getElementById('tabla-body');
  const contenedorTabla = document.getElementById('contenedor-tabla');
  const btnLimpiar = document.getElementById('btn-limpiar-historial');

  const historial = obtenerHistorial();

  if (tbody) {
    tbody.innerHTML = '';
  }

  if (historial.length === 0) {
    if (contenedorTabla) {
      contenedorTabla.classList.add('oculto');
    }
  } else {
    if (contenedorTabla) {
      contenedorTabla.classList.remove('oculto');
    }

    // Crear cada fila con color alternado
    for (let i = 0; i < historial.length; i++) {
      const partida = historial[i];
      const tr = document.createElement('tr');
      
      //colores: par = beige, impar = marrón
      let colorFondo = '';
      if (i % 2 === 0) {
        colorFondo = '#d8c392'; 
      } else {
        colorFondo = '#b8a066'; 
      }
      
      tr.style.backgroundColor = colorFondo;
      
      // Solo mostrar: Nombre, Puntos, Monedas
      tr.innerHTML = `
        <td>${partida.nombreJugador}</td>
        <td style="color: var(--color-texto-oscuro); font-weight: bold;">${partida.puntos}</td>
        <td>${partida.monedas}</td>
      `;
      
      tbody.appendChild(tr);
    }
  }

  // Botón para limpiar historial
  if (btnLimpiar) {
    btnLimpiar.onclick = function() {
      if (historial.length > 0) {
        const confirmar = confirm('¿Borrar todo el historial permanentemente?');
        if (confirmar) {
          limpiarHistorial();
          renderizarTablaHistorial();
          renderizarEstadisticas();
        }
      }
    };
  }
}

// Mostrar estadísticas en consola
export function renderizarEstadisticas() {
  const historial = obtenerHistorial();
  
  if (historial.length > 0) {
    console.log('Total de partidas guardadas:', historial.length);
  }
}