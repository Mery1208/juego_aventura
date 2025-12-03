//---------------------------------------------------------
//CLASE RANKING
// Determina el nivel del jugador (NovatO o Veterano) según su puntuación total.
//Recibe la 'puntuacion' final y un umbral, que es la puntuación mínima para ser Veterano, por defecto 500.
// y muestra el texto con el rango del jugador.
//----------------------------------------------------------
/**
 * Determina el nivel del jugador según su puntuación
 * @param {number} puntuacion - La puntuación total del jugador
 * @param {number} umbral - La puntuación mínima para ser Veterano (por defecto 500)
 * @returns {string} 'Veterano' o 'Novato' según la puntuación
 */ 

export function distinguirJugador(puntuacion, umbral = 500) {
// Si la puntuación es igual o mayor al umbral, devuelve Veterano, si no, devuelve Novato.
return puntuacion >= umbral ? 'Veterano' : 'Novato';
}