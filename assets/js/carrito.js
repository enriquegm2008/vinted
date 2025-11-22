// -------------------- Carrito global --------------------
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Añadir producto
function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarrito();
}

// Actualizar visualmente el carrito
function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const carritoCount = document.getElementById('carrito-count');
    const totalElem = document.getElementById('total');
    const btnPagar = document.getElementById('btn-pagar');

    if (!lista) return;
    lista.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        // Crear <li>
        const li = document.createElement('li');
        li.classList.add('carrito-item');

        // Div info producto (nombre + select cantidad)
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('carrito-item-info');

        const nombreSpan = document.createElement('span');
        nombreSpan.classList.add('nombre');
        nombreSpan.textContent = item.nombre;

        const selectCantidad = document.createElement('select');
        selectCantidad.classList.add('cantidad-selector');
        selectCantidad.dataset.id = item.id;

        [1,2,3,4,5].forEach(n => {
            const option = document.createElement('option');
            option.value = n;
            option.textContent = `${n} unidad${n>1 ? "es" : ""}`;
            if(n === item.cantidad) option.selected = true;
            selectCantidad.appendChild(option);
        });

        infoDiv.appendChild(nombreSpan);
        infoDiv.appendChild(selectCantidad);

        // Div precio
        const precioDiv = document.createElement('div');
        precioDiv.classList.add('carrito-item-precio');
        precioDiv.textContent = `€${(item.precio * item.cantidad).toFixed(2)}`;

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('eliminar');
        btnEliminar.dataset.id = item.id;
        btnEliminar.textContent = '×';

        // Añadir todo al <li>
        li.appendChild(infoDiv);
        li.appendChild(precioDiv);
        li.appendChild(btnEliminar);

        lista.appendChild(li);
    });

    // Eventos eliminar
    lista.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.target.dataset.id);
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCarrito();
        });
    });

    // Eventos cambio cantidad
    lista.querySelectorAll('.cantidad-selector').forEach(select => {
        select.addEventListener('change', e => {
            const id = parseInt(e.target.dataset.id);
            const producto = carrito.find(p => p.id === id);
            if(producto) {
                producto.cantidad = parseInt(select.value);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarCarrito();
            }
        });
    });

    // Contador total
    if(carritoCount) carritoCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Total y enlace pagar
    if(totalElem) totalElem.textContent = total.toFixed(2);
    if(btnPagar) btnPagar.href = total > 0 ? `https://paypal.me/tuusuario/${total.toFixed(2)}` : '#';
}


// Inicializar
actualizarCarrito();
