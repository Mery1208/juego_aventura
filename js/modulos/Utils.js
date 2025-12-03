import { MAX_INVENTARIO } from './constants.js';
//----------------------------------------------
//showScene (por Elías)
//Hice esta función para poder cambiar de pantalla fácilmente.
//Recibo el 'id' de la pantalla que quiero mostrar.
//------------------------------------------

/**
 * Cambia la escena visible ocultando todas y mostrando la seleccionada
 * @param {string} id - El ID de la escena que se quiere mostrar
 */
export function showScene(id) {
    // Busco todas las pantallas y las escondo quitándoles la clase 'active'.
    document.querySelectorAll('.scene').forEach(escena => escena.classList.remove('active'));
    // Busco la pantalla que tiene el 'id' que me pasaron.
    const escenaObjetivo = document.getElementById(id);
    // Si existe, la muestro añadiéndole la clase 'active'.
    if (escenaObjetivo) escenaObjetivo.classList.add('active');
}

//----------------------------------------------
//inicializarInventariovacio
// La usé al principio para dibujar los 6 huecos vacíos en la barra de abajo.
//------------------------------------------
/**
 * Inicializa el inventario creando huecos vacíos
 * @param {number} n - Número de huecos vacíos a crear (por defecto MAX_INVENTARIO)
 */
export function inicializarInventarioVacio(n = MAX_INVENTARIO) {
    const contenedor = document.getElementById('inventory-container');
    contenedor.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const hueco = document.createElement('div');
        hueco.className = 'inventario-slot-vacio';
        contenedor.appendChild(hueco);
    }
}

//----------------------------------------------
//cargarInventario
//Uso esta función para dibujar los productos o huecos vacíos en la barra de inventario.
//Recibe 'items', una lista que tiene productos y 'null' si el hueco está vacío.
//------------------------------------------
/**
 * Carga y renderiza los items del inventario en la pantalla
 * @param {Array<Object|null>} items - Array con los productos o null para huecos vacíos
 */
export function cargarInventario(items) {
    const contenedor = document.getElementById('inventory-container');
    contenedor.innerHTML = ''; // Limpio para dibujar de nuevo.

    items.forEach(item => {
        const hueco = document.createElement('div');
        // Si 'item' tiene datos, es un producto. Si es 'null', es un hueco vacío.
        hueco.className = item ? 'inventario-item' : 'inventario-slot-vacio';

        if(item) {
            // Si es un producto, creo su imagen y la meto en el hueco.
            const imagen = document.createElement('img');
            imagen.src = item.imagen;
            imagen.alt = item.nombre;
            hueco.appendChild(imagen);
        }
        contenedor.appendChild(hueco);
    });
}