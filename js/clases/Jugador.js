//-----------------------------------------------------------
//CLASE JUGADOR
// Aquí hice la base creando al cazador (jugador principal)
//-------------------------------------------------------------

import { MAX_INVENTARIO, TIPOS } from "../modulos/constants.js";

export class Jugador {
    //añado constructor con sus datos 
      /**
     * Constructor de la clase Jugador
     * @param {Object} config - Objeto de configuración
     * @param {string} config.nombre - Nombre del jugador
     * @param {string} config.avatar - Ruta de la imagen del avatar
     * @param {number} [config.vida=100] - Puntos de vida base
     * @param {number} [config.puntos=0] - Puntos iniciales
     */
     constructor({nombre, avatar, vida= 100, puntos = 0 }) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.vidaBase = vida;
        this.puntos = puntos;
        this.inventario = []; //es el inventario donde estará los productos que compre luego
    }
    
    //Objetivo: Intento añadir un objeto a mi mochila (inventario).
    // Devuelve 'true' si lo puse, 'false' si ya está lleno.
    /**
     * Añade un objeto al inventario del jugador
     * @param {Producto} producto - El producto que se quiere añadir
     * @returns {boolean} true si se añadió correctamente, false si el inventario está lleno
     */
    añadirObjeto(producto) {
         // compruebo si mi mochila ya tiene el máximo.
        if (this.inventario.length >= MAX_INVENTARIO) {
            return false;
        }
        // hice una copia del producto para que no se cambie el original de la tienda.
        const copia = Object.assign(Object.create(Object.getPrototypeOf(producto)), producto);
        //Lo meto en mi inventario.
        this.inventario.push(copia);
        return true;
    }

    /**
 * Retira un objeto del inventario usando su nombre
 * @param {string} nombreProducto - El nombre del producto a retirar
 */
     //saco un objeto de mi mochila usando su nombre.
    retirarObjeto(nombreProducto) {
        // Uso 'filter' para crear una nueva lista sin el producto que quiero quitar.
        this.inventario = this.inventario.filter(producto => producto.nombre !== nombreProducto);
    }

    /**
     * Suma puntos a la puntuación del jugador
     * @param {number} cantidad - La cantidad de puntos a sumar
     */
    //aumento mi puntuación sumando puntos.
    sumarPuntos(cantidad) {
        this.puntos += cantidad;
    }

      // Calculo cuánto ataque tengo en total.
    getAtaqueTotal() {
        // Sumé todos los bonus que dan los objetos de tipo Arma que llevo.
        const bonusArmas = this.inventario
        .filter(producto => producto.tipo === TIPOS.ARMA)
        .reduce((acumulador, producto) => acumulador + producto.bonus, 0);
        // Como mi ataque base es 0, el total es solo lo que me dan las armas.
        return 0 + bonusArmas;
    }

    // Calculo cuánta defensa tengo en total.
     getDefensaTotal() {
        // Sumé todos los bonus que dan los objetos de tipo Armadura que llevo.
        const bonusArmadura = this.inventario
        .filter(producto => producto.tipo === TIPOS.ARMADURA)
        .reduce((acumulador, producto) => acumulador + producto.bonus, 0);
        // Mi defensa al empezar es 0.
        return 0 + bonusArmadura;
    }

      // Calculo cuánta vida tengo en total.
     getVidaTotal() {
        // Sumé los bonus que dan los objetos de tipo Consumible.
        const bonusVida = this.inventario
        .filter(producto => producto.tipo === TIPOS.CONSUMIBLE)
        .reduce((acumulador, producto) => acumulador + producto.bonus, 0);
        // El total es mi vida base 100 más la vida extra que me dan los consumibles.
        return this.vidaBase + bonusVida;
    }
}