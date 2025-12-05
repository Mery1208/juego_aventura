//-----------------------------------------------------------
//CLASE PRODUCTO
// Es la base para crear los productos y añadirlo al main y se puedan comprar
//-------------------------------------------------------------

export class Producto {
  constructor({ nombre, imagen, precio, rareza, tipo, bonus, precioOriginal = null }) {
    /**
     * Constructor de la clase Producto
     * @param {Object} config - Objeto de configuración
     * @param {string} config.nombre - Nombre del producto
     * @param {string} config.imagen - Ruta de la imagen
     * @param {number} config.precio - Precio del producto
     * @param {string} config.rareza - Rareza ('Comun', 'Rara', 'Epica')
     * @param {string} config.tipo - Tipo ('Arma', 'Armadura', 'Consumible')
     * @param {number} config.bonus - Bonus que otorga
     * @param {number} [config.precioOriginal] - Precio original antes de descuento
     */
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
    // Guardamos el precio original para mostrar el descuento
    this.precioOriginal = precioOriginal || precio;
    this.tieneDescuento = precioOriginal !== null && precioOriginal !== precio;
  }

  //Muestra el precio con el formato correcto
  formatearPrecio() {
    // Uso toFixed(2) para que siempre tenga dos decimales y luego cambiamos el punto por una coma.
    return `${(this.precio).toFixed(2)} €`.replace('.', ',');
  }

  //  Creo una copia de este producto y le aplica un descuento.
  // Recibe porcentaje del 20%.
  /**
   * Aplica un descuento al producto creando una copia
   * @param {number} porcentaje - El porcentaje de descuento (por ejemplo, 0.20 para 20%)
   * @returns {Producto} Nueva instancia de Producto con el precio descontado.
   */
  aplicarDescuento(porcentaje) {
    // Guardamos el precio original antes de aplicar el descuento
    const precioOriginal = this.precio;
    // Calculamos el nuevo precio asegurándose de que no sea negativo.
    const precioDescontado = Math.max(0, Math.round(this.precio * (1 - porcentaje)));
    
    // Creamos una copia con el precio descontado y guardamos el original
    const productoClonado = new Producto({ 
      ...this,
      precio: precioDescontado,
      precioOriginal: precioOriginal
    });
    
    return productoClonado;
  }
}