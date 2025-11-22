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
      ${item.nombre} x${item.cantidad} - €${(item.precio*item.cantidad).toFixed(2)}
      <button class="eliminar" data-id="${item.id}">x</button>
    `;
    lista.appendChild(li);
  });

  const totalElem = document.getElementById('total');
  if(totalElem) totalElem.textContent = total.toFixed(2);

  const btnPagar = document.getElementById('btn-pagar');
  if(btnPagar) btnPagar.href = total > 0 ? `https://paypal.me/tuusuario/${total.toFixed(2)}` : '#';

  // Eliminar productos
  lista.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      window.carrito = window.carrito.filter(p => p.id !== id);
      localStorage.setItem('carrito', JSON.stringify(window.carrito));
      window.actualizarCarrito();
    });
  });

  // Actualizar contador del header
  const contador = document.getElementById('carrito-count');
  if(contador) contador.textContent = window.carrito.reduce((sum, p) => sum + p.cantidad, 0);
};

// Llamada inicial
window.actualizarCarrito();

// -------------------- Carrito desplegable --------------------
const btnCarrito = document.getElementById('btn-carrito');
const menuCarrito = document.getElementById('menu-carrito');

if(btnCarrito && menuCarrito) {
  btnCarrito.addEventListener('click', () => {
    menuCarrito.classList.toggle('visible');
  });

  document.addEventListener('click', (e) => {
    if (!menuCarrito.contains(e.target) && e.target !== btnCarrito) {
      menuCarrito.classList.remove('visible');
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
        e.stopPropagation(); // importante para no activar el click de la tarjeta
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
