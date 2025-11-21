// -------------------- Obtener id del producto --------------------
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const contenedorImagenes = document.querySelector('.producto-imagenes .carrusel');
const miniaturasCont = document.querySelector('.producto-imagenes .miniaturas');
const infoProducto = document.querySelector('.producto-info');

// -------------------- Cargar producto desde JSON --------------------
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const producto = data.find(p => p.id == id);
    if(!producto) {
      infoProducto.innerHTML = '<p>Producto no encontrado</p>';
      return;
    }

    // Carrusel de imágenes
    if(producto.imagenes && producto.imagenes.length > 0){
      producto.imagenes.forEach((imgUrl, i) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = producto.nombre;
        if(i === 0) img.classList.add('active');
        contenedorImagenes.appendChild(img);

        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        thumb.alt = producto.nombre;
        if(i === 0) thumb.classList.add('selected');
        miniaturasCont.appendChild(thumb);

        thumb.addEventListener('click', () => {
          document.querySelectorAll('.carrusel img').forEach(im => im.classList.remove('active'));
          document.querySelectorAll('.miniaturas img').forEach(m => m.classList.remove('selected'));
          img.classList.add('active');
          thumb.classList.add('selected');
        });
      });
    } else {
      const img = document.createElement('img');
      img.src = producto.imagen;
      img.alt = producto.nombre;
      img.classList.add('active');
      contenedorImagenes.appendChild(img);
    }

    // Info producto
    infoProducto.innerHTML = `
      <h2>${producto.nombre}</h2>
      <p class="precio">€${producto.precio}</p>
      <p class="descripcion">${producto.descripcion}</p>
      <ul class="detalles">
        <li>Talla: ${producto.talla}</li>
        <li>Estado: ${producto.estado}</li>
        <li>Color: ${producto.color || 'No especificado'}</li>
      </ul>
      <div class="botones-producto">
        <button class="btn-comprar">Añadir al carrito</button>
        <a href="https://paypal.me/tuusuario/${producto.precio}" target="_blank" class="btn-comprar-ahora">
            Comprar ya <img src="assets/img/paypal.png" alt="PayPal">
        </a>
      </div>
    `;

    // Botón añadir al carrito
    const btnComprar = infoProducto.querySelector('.btn-comprar');
    btnComprar.addEventListener('click', () => {
      window.carrito = window.carrito || [];
      const existe = window.carrito.find(p => p.id === producto.id);
      if (existe) {
        existe.cantidad += 1;
      } else {
        window.carrito.push({...producto, cantidad: 1});
      }
      localStorage.setItem('carrito', JSON.stringify(window.carrito));
      window.actualizarCarrito();
      alert('Producto añadido al carrito');
    });
  })
  .catch(err => console.error("Error cargando producto:", err));
