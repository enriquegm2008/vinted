// -------------------- Carrito global --------------------
let carrito = [];

// Cargar carrito desde localStorage
if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    actualizarCarrito();
}

// -------------------- Función para añadir al carrito --------------------
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

// -------------------- Guardar carrito en localStorage --------------------
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// -------------------- Función para actualizar visualmente el carrito --------------------
function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const carritoCount = document.getElementById('carrito-count');
    let total = 0;

    if (lista) {
        lista.innerHTML = '';

        carrito.forEach(item => {
            total += item.precio * item.cantidad;

            const li = document.createElement('li');
            li.innerHTML = `
                ${item.nombre} x${item.cantidad} - €${(item.precio * item.cantidad).toFixed(2)}
                <button class="eliminar" data-id="${item.id}">x</button>
            `;
            lista.appendChild(li);
        });

        // Botones eliminar productos
        lista.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                carrito = carrito.filter(p => p.id !== id);
                guardarCarrito();
                actualizarCarrito();
            });
        });
    }

    // Actualizar contador en el header
    if (carritoCount) {
        const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        carritoCount.textContent = cantidadTotal;
    }

    // Actualizar total
    const totalElem = document.getElementById('total');
    if (totalElem) totalElem.textContent = total.toFixed(2);

    // Actualizar enlace de pago
    const btnPagar = document.getElementById('btn-pagar');
    if (btnPagar) btnPagar.href = total > 0 ? `https://paypal.me/tuusuario/${total.toFixed(2)}` : '#';
}
