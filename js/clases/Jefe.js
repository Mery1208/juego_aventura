import { Enemigo } from './Enemigo.js';

//-----------------------------------------------------------
//CLASE JEFE
//Herencia de Enemigo (extends) tiene sus datos recogidos de Enemigo
//-------------------------------------------------------------

export class Jefe extends Enemigo {
       /**
     * Constructor de la clase Jefe
     * @param {Object} config - Objeto de configuración
     * @param {string} config.nombre - Nombre del jefe
     * @param {string} config.imagen - Ruta de la imagen
     * @param {number} config.ataque - Puntos de ataque
     * @param {number} config.vida - Puntos de vida
     * @param {number} [config.multiplicadorPupa=1.2] - Multiplicador de puntos
     */
    constructor({ nombre, imagen, ataque, vida, multiplicadorPupa = 1.2}) {
        //llamo al super para darle los datos de la clase enemigo 
        super({ nombre, imagen, ataque, vida});
        // le añado un dato extra que solo tendra Jefe, es hacer ganar más puntos.
        this.multiplicadorPupa = multiplicadorPupa;
    }
}