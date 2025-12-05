import { Jefe } from '../clases/Jefe.js';

export function combate(enemigo, jugador) {
    let vidaJugador = jugador.getVidaTotal(); 
    let vidaEnemigo = enemigo.vida; 

    const log = []; 
    let turno = 1;

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        
        const dañoJugador = jugador.getAtaqueTotal(); 
        vidaEnemigo = Math.max(0, vidaEnemigo - dañoJugador);
        log.push(`Turno ${turno} - Jugador ataca: ${dañoJugador}. Vida enemigo: ${vidaEnemigo}`);

        if (vidaEnemigo <= 0) break;

        const defensaJugador = jugador.getDefensaTotal(); 
        const dañoRecibido = Math.max(0, enemigo.ataque - defensaJugador);
        vidaJugador = Math.max(0, vidaJugador - dañoRecibido);
        log.push(`Turno ${turno} - Enemigo ataca: ${enemigo.ataque} (-defensa ${defensaJugador}) = ${dañoRecibido}. Vida jugador: ${vidaJugador}`);

        turno++;
    }

    let puntosGanados = 0;
    let monedasGanadas = 0;
    let ganador = 'Enemigo';

    if (vidaEnemigo <= 0) {
        ganador = 'Jugador';
        puntosGanados = 100 + enemigo.ataque;
        
        if (enemigo instanceof Jefe) {
            monedasGanadas = 10;
            puntosGanados = Math.round(puntosGanados * enemigo.multiplicadorPupa);
        } else {
            monedasGanadas = 5;
        }
    }

    return { 
        ganador,
        puntosGanados,
        monedasGanadas,
        log 
    };
}