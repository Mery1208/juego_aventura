const MONEDAS_INICIAL = 500;
const STORAGE_KEY = 'jugador_monedas';

export function obtenerMonedas() {
   const guardado = localStorage.getItem(STORAGE_KEY);
   return guardado ? parseInt(guardado) : MONEDAS_INICIAL;
}

export function establecerMonedas(cantidad) {
   localStorage.setItem(STORAGE_KEY, cantidad.toString());
   actualizarInterfazMonedero();
}

export function restarMonedas(cantidad) {
   const actual = obtenerMonedas();
   if (actual >= cantidad) {
       establecerMonedas(actual - cantidad);
       return true;
   }
   return false;
}

export function sumarMonedas(cantidad) {
   const actual = obtenerMonedas();
   establecerMonedas(actual + cantidad);
}

export function tieneMonedas(cantidad) {
   return obtenerMonedas() >= cantidad;
}

export function resetearMonedas() {
   establecerMonedas(MONEDAS_INICIAL);
}

export function crearInterfazMonedero() {
    actualizarInterfazMonedero();
}

function actualizarInterfazMonedero() {
    const elemento = document.getElementById('monedero-cantidad');
    if (elemento) {
        elemento.textContent = obtenerMonedas();
    }
}

export function animarCambioMonedas(cantidad) {
    const monedero = document.getElementById('monedero-container');
    if (!monedero) return;
    
    const notif = document.createElement('div');
    notif.className = 'monedero-notificacion';
    notif.textContent = cantidad > 0 ? `+${cantidad}` : `${cantidad}`;
    notif.style.color = cantidad > 0 ? '#4caf50' : '#f44336';
    
    monedero.appendChild(notif);
    
    setTimeout(() => notif.remove(), 1500);
}

export function inicializarMonedero() {
    crearInterfazMonedero();
    resetearMonedas();
}

export { MONEDAS_INICIAL };