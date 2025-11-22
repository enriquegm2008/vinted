// -------------------- Inicializar carrito global --------------------
window.carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función global para actualizar el carrito visualmente
window.actualizarCarrito = function() {
  const lista = document.getElementById('lista-carrito');
  if (!lista) return;
  lista.innerHTML = '';
  let total = 0;

  window.carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="carrito-item-grid">
        <div class="col-info">
          <span class="nombre">${item.nombre}</span>
          <span class="marca-talla">${item.marca || 'Sin marca'} - ${item.talla}</span>
        </div>

        <div class="col-cantidad">
          <select class="cantidad-selector" data-id="${item.id}">
            ${[1,2,3,4,5].map(n => `
              <option value="${n}" ${n === item.cantidad ? "selected" : ""}>${n}</option>
            `).join('')}
          </select>
        </div>

        <div class="col-precio">
          ${(item.precio * item.cantidad).toFixed(2)} €
        </div>

        <button class="eliminar" data-id="${item.id}">×</button>
      </div>
    `;
    lista.appendChild(li);
  });

  // Eventos eliminar
  lista.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      window.carrito = window.carrito.filter(p => p.id !== id);
      localStorage.setItem('carrito', JSON.stringify(window.carrito));
      window.actualizarCarrito();
    });
  });

  // Selector cantidades
  lista.querySelectorAll('.cantidad-selector').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const producto = window.carrito.find(p => p.id === id);
      producto.cantidad = parseInt(e.target.value);
      localStorage.setItem('carrito', JSON.stringify(window.carrito));
      window.actualizarCarrito();
    });
  });

  // Contador carrito
  const contador = document.getElementById('carrito-count');
  if(contador) contador.textContent = window.carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Precio final sin "Total:"
  const totalElem = document.getElementById('total');
  if(totalElem) totalElem.textContent = `${total.toFixed(2)} €`;

  const btnPagar = document.getElementById('btn-pagar');
  if(btnPagar) btnPagar.href = total > 0 ? `https://paypal.me/tuusuario/${total.toFixed(2)}` : '#';
};

// Llamada inicial
window.actualizarCarrito();

// -------------------- Carrito desplegable --------------------
const btnCerrar = document.getElementById('btn-cerrar-carrito'); // botón cerrar
if(typeof btnCarrito !== 'undefined' && menuCarrito) {
  // Al abrir/cerrar carrito
  btnCarrito.addEventListener('click', () => {
    menuCarrito.classList.toggle('visible');
    if(btnCerrar) btnCerrar.style.display = menuCarrito.classList.contains('visible') ? 'flex' : 'none';
  });

  // Botón cerrar
  if(btnCerrar) {
    btnCerrar.addEventListener('click', (e) => {
      e.stopPropagation();
      menuCarrito.classList.remove('visible');
      btnCerrar.style.display = 'none';
    });
  }

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!menuCarrito.contains(e.target) && e.target !== btnCarrito) {
      menuCarrito.classList.remove('visible');
      if(btnCerrar) btnCerrar.style.display = 'none';
    }
  });
}

// -------------------- Cargar productos desde JSON --------------------
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById('productos');
    if (!contenedor) return;

    data.forEach(producto => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('producto-wrapper');

      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="fila-superior">
          <span class="marca">${producto.marca || ''}</span>
          <span class="talla">${producto.talla}</span>
        </div>
        <p class="precio">€${producto.precio}</p>
      `;

      // Redirigir a producto.html al clicar en la tarjeta
      card.addEventListener('click', () => {
        window.location.href = `producto.html?id=${producto.id}`;
      });

      // Botón añadir al carrito
      const btnComprar = document.createElement('button');
      btnComprar.classList.add('btn', 'btn-comprar');
      btnComprar.textContent = 'Añadir al carrito';
      btnComprar.addEventListener('click', (e) => {
        e.stopPropagation();
        agregarAlCarrito(producto);
        alert('Producto añadido al carrito');
      });

      wrapper.appendChild(card);
      wrapper.appendChild(btnComprar);
      contenedor.appendChild(wrapper);
    });
  })
  .catch(err => console.error("Error cargando productos:", err));

// -------------------- Función para añadir producto al carrito --------------------
function agregarAlCarrito(producto) {
  const existe = window.carrito.find(p => p.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    window.carrito.push({...producto, cantidad: 1});
  }
  localStorage.setItem('carrito', JSON.stringify(window.carrito));
  window.actualizarCarrito();
}

