const STORAGE_KEY = 'historial_partidas';
const MAX_PARTIDAS = 10;
const COOKIE_ULTIMA_PARTIDA = 'ultima_partida';

export class Partida {
  constructor(datosJugador, puntos, rango, enemigosVencidos, monedas, duracion) {
    this.id = Date.now();
    this.fecha = new Date().toLocaleString('es-ES');
    this.nombreJugador = datosJugador.nombre;
    this.puntos = puntos;
    this.rango = rango;
    this.enemigosVencidos = enemigosVencidos;
    this.monedas = monedas || 0;
    this.duracion = duracion || this.calcularDuracion();
  }

  calcularDuracion() {
    return Math.floor(Math.random() * 10) + 5;
  }
}

export function crearCookie(nombre, valor, dias = 30) {
  try {
    const valorFinal = typeof valor === 'object' ? JSON.stringify(valor) : valor;
    
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expira = "expires=" + fecha.toUTCString();
    
    document.cookie = `${nombre}=${valorFinal};${expira};path=/`;
    console.log(`Cookie '${nombre}' creada con éxito`);
    return true;
  } catch (error) {
    console.error('Error al crear cookie:', error);
    return false;
  }
}

export function obtenerCookie(nombre) {
  try {
    const nombreBuscado = nombre + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      
      if (cookie.indexOf(nombreBuscado) === 0) {
        const valor = cookie.substring(nombreBuscado.length);
        
        try {
          return JSON.parse(valor);
        } catch {
          return valor;
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export function eliminarCookie(nombre) {
  document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function existeCookie(nombre) {
  return obtenerCookie(nombre) !== null;
}

export function guardarUltimaPartidaEnCookie(partida) {
  const datosPartida = {
    id: partida.id,
    fecha: partida.fecha,
    nombreJugador: partida.nombreJugador,
    puntos: partida.puntos,
    rango: partida.rango,
    enemigosVencidos: partida.enemigosVencidos,
    monedas: partida.monedas,
    duracion: partida.duracion
  };
  
  crearCookie(COOKIE_ULTIMA_PARTIDA, datosPartida, 30);
}

export function obtenerUltimaPartidaDeCookie() {
  const partida = obtenerCookie(COOKIE_ULTIMA_PARTIDA);
  return partida;
}

export function mostrarUltimaPartida() {
  const ultima = obtenerUltimaPartidaDeCookie();
  if (!ultima) {
    return null;
  }
  return ultima;
}

export function guardarPartida(partida) {
  const historial = obtenerHistorial();
  historial.unshift(partida); 
  
  if (historial.length > MAX_PARTIDAS) {
    historial.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  guardarUltimaPartidaEnCookie(partida);
  
  return historial;
}

export function obtenerHistorial() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

export function eliminarPartida(id) {
  const historial = obtenerHistorial();
  const nuevoHistorial = historial.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoHistorial));
  return nuevoHistorial;
}

export function limpiarHistorial() {
  localStorage.removeItem(STORAGE_KEY);
  eliminarCookie(COOKIE_ULTIMA_PARTIDA);
  return [];
}

export function obtenerEstadisticasHistorial() {
  const historial = obtenerHistorial();
  if (historial.length === 0) return null;

  const puntuacionTotal = historial.reduce((sum, p) => sum + p.puntos, 0);
  const puntuacionPromedio = Math.round(puntuacionTotal / historial.length);

  const mejorPartida = historial.reduce((max, p) => (p.puntos > max.puntos ? p : max), historial[0]);
  const totalEnemigosVencidos = historial.reduce((sum, p) => sum + p.enemigosVencidos, 0);

  return {
    totalPartidas: historial.length,
    puntuacionPromedio,
    mejorPartida,
    partidasVeterano: historial.filter(p => p.rango === 'Veterano').length,
    partidasNovato: historial.filter(p => p.rango === 'Novato').length
  };
}

export function renderizarTablaHistorial() {
  const tbody = document.getElementById('tabla-body');
  const contenedorTabla = document.getElementById('contenedor-tabla');
  
  const btnLimpiar = document.getElementById('btn-limpiar-historial');

  const historial = obtenerHistorial();

  if (tbody) tbody.innerHTML = '';

  if (historial.length === 0) {
    if (contenedorTabla) contenedorTabla.classList.add('oculto');
  } else {
    if (contenedorTabla) contenedorTabla.classList.remove('oculto');

    historial.forEach(partida => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${partida.fecha.split(',')[0]}</td>
        <td>${partida.nombreJugador}</td>
        <td style="color: var(--color-boton); font-weight: bold;">${partida.puntos}</td>
        <td><span class="badge-rango ${partida.rango.toLowerCase()}">${partida.rango}</span></td>
        <td>${partida.monedas}</td>
        <td>${partida.enemigosVencidos}</td>
        <td>${partida.duracion} min</td>
        <td>
          <button class="btn-eliminar" data-id="${partida.id}">Borrar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  if (tbody) {
    tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('¿Eliminar esta partida?')) {
          eliminarPartida(id);
          renderizarTablaHistorial(); 
          renderizarEstadisticas();   
        }
      });
    });
  }

  if (btnLimpiar) {
    btnLimpiar.onclick = () => {
      if (historial.length > 0 && confirm('¿Borrar todo el historial permanentemente?')) {
        limpiarHistorial();
        renderizarTablaHistorial();
        renderizarEstadisticas();
      }
    };
  }
}

export function renderizarEstadisticas() {
  const stats = obtenerEstadisticasHistorial();
  
  if (stats) {
    console.log('Estadísticas del historial:', stats);
  }
}