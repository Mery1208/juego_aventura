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

  mostrarRankingEnConsola();
  return historial;
}

//Obtener historial desde localStorage
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

// Mostrar ranking automáticamente en consola
export function mostrarRankingEnConsola() {
  const historial = obtenerHistorial();
  
  console.log('RANKING DE PARTIDAS');
  
  if (historial.length === 0) {
    console.log('No hay partidas registradas aún');
  } else {
    const ranking = [...historial].sort((a, b) => b.puntos - a.puntos);
    
    ranking.forEach((partida, index) => {
      console.log(`${index + 1}. ${partida.nombreJugador}`);
      console.log(`   Puntos: ${partida.puntos} | Rango: ${partida.rango} | Monedas: ${partida.monedas}`);
      console.log(`   Enemigos vencidos: ${partida.enemigosVencidos} | Fecha: ${partida.fecha}`);
    });
  }
}

// Renderizar tabla con colores DEPENDIENDO SI ES PAR O IMPAR
export function renderizarTablaHistorial() {
  const tbody = document.getElementById('tabla-body');
  const contenedorTabla = document.getElementById('contenedor-tabla');

  const historial = obtenerHistorial();

  if (tbody) {
    tbody.innerHTML = '';
  }

  if (historial.length === 0) {
    if (contenedorTabla) {
      contenedorTabla.classList.add('oculto');
    }
    
    // Mostrar mensaje cuando no hay partidas
    const escenaHistorial = document.querySelector('#escena-historial .scene-contenido');
    if (escenaHistorial && !document.getElementById('mensaje-sin-partidas')) {
      const mensaje = document.createElement('div');
      mensaje.id = 'mensaje-sin-partidas';
      mensaje.style.cssText = 'color: white; text-align: center; padding: 40px; font-size: 18px;';
      mensaje.textContent = 'No hay partidas registradas aún.';
      escenaHistorial.insertBefore(mensaje, escenaHistorial.firstChild);
    }
  } else {
    // Eliminar mensaje si existe
    const mensaje = document.getElementById('mensaje-sin-partidas');
    if (mensaje) mensaje.remove();
    
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
      
      //  mostrar: Nombre, Puntos, Monedas
      tr.innerHTML = `
        <td>${partida.nombreJugador}</td>
        <td style="color: var(--color-texto-oscuro); font-weight: bold; font-size: 16px;">${partida.puntos}</td>
        <td style="color: var(--color-texto-oscuro);">${partida.monedas}</td>
      `;
      
      tbody.appendChild(tr);
    }
  }
}

// Mostrar estadísticas en consola
export function renderizarEstadisticas() {
  const historial = obtenerHistorial();
  
  if (historial.length > 0) {
    console.log('Total de partidas guardadas:', historial.length);
  }
}