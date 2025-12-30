//-----------------------------------------------------------
//CLASE CONSTANTS 
// Hice este archivo para guardar valores que no cambian (variables globales)
//-------------------------------------------------------------

// La lista de rarezas que uso para los productos.
export const RAREZAS = ['Comun', 'Rara', 'Epica'];

export const TIPOS = {
    ARMA: 'Arma',
    ARMADURA: 'Armadura',
    CONSUMIBLE: 'Consumible'
}

// Puntuación mínima que necesito para que el juego me considere Veterano.
export const UMBRAL_RANGO_DEFAULT =500;

// El número máximo de objetos que puedo llevar en el inventario.
export const MAX_INVENTARIO = 6;

export const PRODUCTOS_BASE = [
    // ARMADURAS: Me dan bonus de Defensa (el valor de bonus).
  { nombre: 'Casco', imagen: './img/productos/armadura/casco.png', precio: 90, rareza: 'Comun', tipo: 'Armadura', bonus: 10 },
  { nombre: 'Botas', imagen: './img/productos/armadura/botas.png', precio: 50, rareza: 'Comun', tipo: 'Armadura', bonus: 12 },
  { nombre: 'Pantalón', imagen: './img/productos/armadura/pantalon.png', precio: 80, rareza: 'Comun', tipo: 'Armadura', bonus: 15 },
  { nombre: 'Pechera', imagen: './img/productos/armadura/pechera.png', precio: 160, rareza: 'Epica', tipo: 'Armadura', bonus: 20 },
  { nombre: 'Escudo', imagen: './img/productos/armadura/escudo.png', precio: 110, rareza: 'Rara', tipo: 'Armadura', bonus: 10 },

  // ARMAS: Me dan bonus de Ataque (el valor de bonus).
  { nombre: 'Hacha', imagen: './img/productos/armas/hacha.png', precio: 100, rareza: 'Rara', tipo: 'Arma', bonus: 7 },
  { nombre: 'Espada', imagen: './img/productos/armas/espada.png', precio: 110, rareza: 'Comun', tipo: 'Arma', bonus: 6 },
  { nombre: 'Arco', imagen: './img/productos/armas/arco.png', precio: 95, rareza: 'Comun', tipo: 'Arma', bonus: 5 },

  // CONSUMIBLES: Me dan bonus de Vida extra (el valor de bonus).
  { nombre: 'Manzana curativa', imagen: './img/productos/consumibles/manzana.png', precio: 40, rareza: 'Comun', tipo: 'Consumible', bonus: 10 },
  { nombre: 'Poción', imagen: './img/productos/consumibles/pocion.png', precio: 60, rareza: 'Rara', tipo: 'Consumible', bonus: 12 },
  { nombre: 'Hierbas', imagen: './img/productos/consumibles/hierbas.png', precio: 30, rareza: 'Comun', tipo: 'Consumible', bonus: 6 },
  { nombre: 'Pan', imagen: './img/productos/consumibles/pan.png', precio: 15, rareza: 'Comun', tipo: 'Consumible', bonus: 4 }
];

export const ENEMIGOS_BASE = [
     // Enemigos normales (solo tienen ataque y vida).
  { nombre: 'Pandilleros', imagen: './img/enemigos/pandilleros.webp', ataque: 10, vida: 40 },
  { nombre: 'Lobo', imagen: './img/enemigos/lobo.png', ataque: 25, vida: 50 },
  { nombre: 'Ogro', imagen: './img/enemigos/ogro.png', ataque: 31, vida: 60 },
  // El último es el JEFE (tiene 'jefe: true' y un multiplicador de daño extra).
  { nombre: 'Dragón', imagen: './img/enemigos/dragon.png', ataque: 34, vida: 100, jefe: true, multiplicadorPupa: 1.2 }
];