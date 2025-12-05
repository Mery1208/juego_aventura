export function mostrarFormularioRegistro(onRegistroCompleto) {
    
setTimeout(() => {
    const inputNombre = document.getElementById('input-nombre');
    const inputAtaque = document.getElementById('input-ataque');
    const inputDefensa = document.getElementById('input-defensa');
    const inputVida = document.getElementById('input-vida');
    const form = document.getElementById('form-registro');
    const spanPuntos = document.getElementById('puntos-disponibles');
    const errorNombre = document.getElementById('error-nombre');
    const errorPuntos = document.getElementById('error-puntos');
    
    if (!form || !inputNombre) {
      console.error("Error: No se encontraron elementos del formulario");
      return;
    }

    // Regex: 1 a 20 caracteres
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,20}$/;

    // Función para capitalizar 
    function capitalizarNombre(nombre) {
        return nombre
            .split(' ')
            .filter(palabra => palabra.length > 0)
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ');
    }

    // Función para calcular puntos disponibles
    function calcularPuntosDisponibles() {
        const ataque = parseInt(inputAtaque.value) || 0;
        const defensa = parseInt(inputDefensa.value) || 0;
        const vida = parseInt(inputVida.value) || 100;
        
        const puntosUsados = ataque + defensa + (vida - 100);
        const puntosDisponibles = 10 - puntosUsados;
        
        spanPuntos.textContent = puntosDisponibles;
        
        if (puntosDisponibles < 0) {
            errorPuntos.textContent = 'Has superado el límite de 10 puntos';
            errorPuntos.style.color = 'red';
            return false;
        } else {
            errorPuntos.textContent = '';
            return true;
        }
    }

    // Validación en tiempo real del nombre
    inputNombre.oninput = function() {
        const valor = this.value;

        if (valor.length === 0) {
            this.style.borderColor = '';
            this.style.boxShadow = '';
            errorNombre.textContent = '';
            return;
        }

        // Verificar si solo tiene espacios
        if (valor.trim().length === 0) {
            this.style.borderColor = 'red';
            this.style.boxShadow = '0 0 5px red';
            errorNombre.textContent = 'El nombre no puede ser solo espacios';
            return;
        }

        // Verificar si la primera letra es mayúscula
        if (!/^[A-ZÁÉÍÓÚÑ]/.test(valor)) {
            this.style.borderColor = 'orange';
            this.style.boxShadow = '0 0 5px orange';
            errorNombre.textContent = 'Debe empezar con mayúscula';
            return;
        }

        // Verificar regex completa
        if (!regexNombre.test(valor)) {
            this.style.borderColor = 'red';
            this.style.boxShadow = '0 0 5px red';
            errorNombre.textContent = 'Solo letras, espacios y máximo 20 caracteres';
            return;
        }

        // Todo correcto
        this.style.borderColor = 'green';
        this.style.boxShadow = '0 0 5px green';
        errorNombre.textContent = '';
    };

    // Listeners para calcular puntos
    inputAtaque.addEventListener('input', calcularPuntosDisponibles);
    inputDefensa.addEventListener('input', calcularPuntosDisponibles);
    inputVida.addEventListener('input', calcularPuntosDisponibles);

    // Validaciones al enviar formulario
    form.onsubmit = function(e) {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const ataque = parseInt(inputAtaque.value) || 0;
        const defensa = parseInt(inputDefensa.value) || 0;
        const vida = parseInt(inputVida.value) || 100;

        // Validar nombre vacío
        if (!nombre || nombre.length === 0) {
            alert('El nombre no puede estar vacío');
            inputNombre.focus();
            return false;
        }

        // Validar solo espacios
        if (nombre.replace(/\s/g, '').length === 0) {
            alert('El nombre no puede contener solo espacios en blanco');
            inputNombre.focus();
            return false;
        }

        // Validar longitud
        if (nombre.length > 20) {
            alert('El nombre debe tener como máximo 20 caracteres');
            inputNombre.focus();
            return false;
        }

        // Validar regex
        if (!regexNombre.test(nombre)) {
            alert('Nombre inválido.\n\nRequisitos:\n• Máximo 20 caracteres\n• Solo letras, espacios y tildes\n• Sin números ni símbolos');
            inputNombre.focus();
            return false;
        }

        // Validar primera letra mayúscula
        if (!/^[A-ZÁÉÍÓÚÑ]/.test(nombre)) {
            alert('El nombre debe empezar con letra mayúscula');
            inputNombre.focus();
            return false;
        }

        // Validar que no tenga números
        if (/\d/.test(nombre)) {
            alert('El nombre no puede contener números.');
            inputNombre.focus();
            return false;
        }

        // Validar ataque
        if (ataque < 0 || ataque > 10) {
            alert('El ataque debe estar entre 0 y 10');
            inputAtaque.focus();
            return false;
        }

        // Validar defensa
        if (defensa < 0 || defensa > 10) {
            alert('La defensa debe estar entre 0 y 10');
            inputDefensa.focus();
            return false;
        }

        // Validar vida
        if (vida < 100 || vida > 110) {
            alert('La vida debe estar entre 100 y 110');
            inputVida.focus();
            return false;
        }

        // Validar total de puntos
        const puntosUsados = ataque + defensa + (vida - 100);
        if (puntosUsados > 10) {
            alert('El total de puntos asignados no puede superar 10.\n\nActual: ' + puntosUsados);
            return false;
        }

        // Validar que ninguna propiedad sea negativa
        if (ataque < 0 || defensa < 0 || vida < 0) {
            alert('Ninguna propiedad puede ser negativa');
            return false;
        }

        // Todo validado correctamente
        const nombreCapitalizado = capitalizarNombre(nombre);
        
        const datosPersonaje = {
            nombre: nombreCapitalizado,
            avatar: './img/jugador/maria.png',
            clase: 'cazador',
            bonus: {   
                ataque: ataque, 
                vida: vida - 100,
                defensa: defensa
            },
            fechaRegistro: new Date().toISOString()
        };

        localStorage.setItem('personaje_activo', JSON.stringify(datosPersonaje));

        if (typeof onRegistroCompleto === 'function') {
            onRegistroCompleto(datosPersonaje);
        }
        return false;
    };

}, 100);
}

export function cargarPersonajeGuardado() {
    const datos = localStorage.getItem('personaje_activo');
    return datos ? JSON.parse(datos) : null;
}

export function tienePersonajeGuardado() {
    return localStorage.getItem('personaje_activo') !== null;
}