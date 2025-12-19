import { PRODUCTOS_BASE, RAREZAS } from './constants.js';
import { Producto } from '../clases/Producto.js';

//-----------------------------------------------------------
//CLASE MERCADO
// Aqui añado funciones de mercado 
//-------------------------------------------------------------

/**
 * Crea un objeto Producto a partir de los datos base
 * @param {Object} base - Objeto con los datos base del producto
 * @returns {Producto} Nueva instancia de Producto
 */
function crearProductoDesdeBase(base) {
    return new Producto(base);
}

// Función obtenerProductosConDescuentoAleatorio
// Lo que hice aquí fue preparar la lista de productos que el jugador verá en la tienda.
// Aplico un descuento especial a los productos de una rareza elegida al azar.
// y asi muestra una lista de objetos Producto.

export function obtenerProductosConDescuentoAleatorio() {
    // Elegí una rareza al azar Común, Rara, o Épica de la lista RAREZAS.
    const rarezaObjetivo = RAREZAS[Math.floor(Math.random() * RAREZAS.length)];
    const porcentajeDescuento = 0.20; // Mi descuento especial es del 20%.

    console.log(` Descuento del 20% aplicado a productos de rareza: ${rarezaObjetivo}`);

    // Recorrí todos los productos base con map para crear las tarjetas.
    return PRODUCTOS_BASE.map(productoBase => {
        const producto = crearProductoDesdeBase(productoBase);
        // Si la rareza del producto coincide con la que elegí al azar
        if (productoBase.rareza === rarezaObjetivo) {
            // ... le aplico el descuento especial del 20%.
            const productoConDescuento = producto.aplicarDescuento(porcentajeDescuento);
            console.log(` Descuento aplicado a: ${producto.nombre} - De ${producto.precio}€ a ${productoConDescuento.precio}€`);
            return productoConDescuento;
        }
        // Si no coincide, devuelvo el producto normal sin descuento.
        return producto;
    });
}

/**
 * Filtra una lista de productos por su rareza
 * @param {Array<Producto>} productos - Lista de productos a filtrar
 * @param {string} rareza - La rareza por la que filtrar ('Comun', 'Rara', 'Epica')
 * @returns {Array<Producto>} Array de productos filtrados
 */
export function filtrarPorRareza(productos, rareza) {
    return productos.filter(producto => producto.rareza === rareza);
}

/**
 * Busca un producto por su nombre
 * @param {Array<Producto>} productos - Lista de productos donde buscar
 * @param {string} nombre - El nombre del producto a buscar
 * @returns {Producto|undefined} El producto encontrado o undefined
 */
export function buscarPorNombre(productos, nombre) {
    return productos.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

// Función renderizarProductos
// Me encargo de dibujar todas las tarjetas de los productos en la pantalla del Mercado.

/**
 * Renderiza las tarjetas de productos en el mercado
 * @param {Array<Producto>} productos - Lista de productos a mostrar
 * @param {Function} alHacerToggle - Función callback que se ejecuta al añadir/retirar producto
 * @param {Set<string>} seleccionados - Set con los nombres de productos ya seleccionados
 */
export function renderizarProductos(productos, alHacerToggle, seleccionados = new Set()) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';
        
        // Crear el HTML con o sin indicador de descuento
        let precioHTML = '';
        if (producto.tieneDescuento) {
            // Mostrar precio original tachado y nuevo precio
            precioHTML = `
                <p>
                    <strong>Precio:</strong> 
                    <span style="text-decoration: line-through; color: #888; font-size: 14px;">
                        ${producto.precioOriginal.toFixed(2).replace('.', ',')} €
                    </span>
                    <span style="color: #c41e3a; font-weight: bold; font-size: 18px;">
                        ${producto.formatearPrecio()}
                    </span>
                    <span style="background: #c41e3a; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-left: 5px;">
                        -20%
                    </span>
                </p>
            `;
        } else {
            // Precio normal sin descuento
            precioHTML = `<p><strong>Precio:</strong> ${producto.formatearPrecio()}</p>`;
        }
        
        // Pongo el contenido HTML de la tarjeta con la imagen, nombre, bonus y precio.
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <h4>${producto.nombre}</h4>
            <p><strong>Bonus:</strong> ${producto.bonus}</p>
            ${precioHTML}
            <p><strong>Rareza:</strong> ${producto.rareza}</p>
            <button class="btn-toggle">Añadir</button>
        `;

        const boton = tarjeta.querySelector('.btn-toggle');

        // Compruebo si el producto ya está seleccionado. Si es así, le cambio el estilo y el texto a 'Retirar'.
        if (seleccionados.has(producto.nombre)) {
            tarjeta.classList.add('selected');
            boton.textContent = 'Retirar';
        }

        // Pongo el 'escuchador' de eventos: le digo al botón lo que tiene que hacer al ser pulsado.
        boton.addEventListener('click', (evento) => {
            evento.stopPropagation();
            // Uso 'toggle' para cambiar el estado de la tarjeta y saber si la acaban de añadir o retirar.
            const estaSeleccionado = tarjeta.classList.toggle('selected');
            // Cambio el texto del botón según el nuevo estado.
            boton.textContent = estaSeleccionado ? 'Retirar' : 'Añadir';
            // Llamo a la función principal ('alHacerToggle') para que se actualice la cesta real y los stats.
            alHacerToggle(producto, estaSeleccionado);
        });

        contenedor.appendChild(tarjeta);
    });
}

// Función renderizarCesta
// Dibuje un resumen simple de los productos que el jugador ha seleccionado.

/**
 * Renderiza un resumen de los productos en la cesta
 * @param {Array<Producto>} productosCesta - Lista de productos seleccionados
 */
export function renderizarCesta(productosCesta) {
    const contenedor = document.getElementById('cesta-productos');
    contenedor.innerHTML = '';

    productosCesta.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';
        // Muestro solo el nombre, el tipo y el bonus en esta vista de resumen.
        tarjeta.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p>${producto.tipo} (+${producto.bonus})</p>
        `;
        contenedor.appendChild(tarjeta);
    });
}