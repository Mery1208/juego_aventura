//-----------------------------------------------------------
//CLASE ENEMIGO
// Aquí hice la base creando a los enemigos del juego para usarlo después 
//-------------------------------------------------------------

export class Enemigo {
       /**
     * Constructor de la clase Enemigo
     * @param {Object} config - Objeto de configuración
     * @param {string} config.nombre - Nombre del enemigo
     * @param {string} config.imagen - Ruta de la imagen
     * @param {number} config.ataque - Puntos de ataque
     * @param {number} config.vida - Puntos de vida
     */
    constructor({nombre, imagen, ataque, vida }) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.ataque = ataque;
        this.vida = vida;
    }
}