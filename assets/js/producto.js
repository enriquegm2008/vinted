// -------------------- Obtener id del producto --------------------
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const contenedorImagenes = document.querySelector('.producto-imagenes .carrusel');
const miniaturasCont = document.querySelector('.producto-imagenes .miniaturas');
const infoProducto = document.querySelector('.producto-info');

let indexActual = 0;
let imagenes = [];

// -------------------- Cargar producto desde JSON --------------------
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const producto = data.find(p => p.id == id);
    if(!producto) {
      infoProducto.innerHTML = '<p>Producto no encontrado</p>';
      return;
    }

    // Cargar imágenes del producto
    imagenes = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen];

    // Limpiar contenedor
    contenedorImagenes.innerHTML = '';

    // Imagen principal
    const imgPrincipal = document.createElement('img');
    imgPrincipal.classList.add('imagen-activa');
    imgPrincipal.src = imagenes[indexActual];
    imgPrincipal.alt = producto.nombre;
    contenedorImagenes.appendChild(imgPrincipal);

    // Flechas
    const flechaIzq = document.createElement('button');
    flechaIzq.classList.add('flecha', 'izquierda');
    flechaIzq.innerHTML = '&#10094;';
    contenedorImagenes.appendChild(flechaIzq);

    const flechaDer = document.createElement('button');
    flechaDer.classList.add('flecha', 'derecha');
    flechaDer.innerHTML = '&#10095;';
    contenedorImagenes.appendChild(flechaDer);

    // Funciones flechas
    flechaIzq.addEventListener('click', () => {
      indexActual = (indexActual - 1 + imagenes.length) % imagenes.length;
      actualizarCarrusel();
    });
    flechaDer.addEventListener('click', () => {
      indexActual = (indexActual + 1) % imagenes.length;
      actualizarCarrusel();
    });

    function actualizarCarrusel() {
      imgPrincipal.src = imagenes[indexActual];
      actualizarMiniaturas();
    }

    // Miniaturas
    miniaturasCont.innerHTML = '';
    imagenes.forEach((imgUrl, i) => {
      const thumb = document.createElement('img');
      thumb.src = imgUrl;
      thumb.alt = producto.nombre;
      if(i === indexActual) thumb.classList.add('selected');
      thumb.addEventListener('click', () => {
        indexActual = i;
        actualizarCarrusel();
      });
      miniaturasCont.appendChild(thumb);
    });

    function actualizarMiniaturas() {
      miniaturasCont.querySelectorAll('img').forEach((img, i) => {
        img.classList.toggle('selected', i === indexActual);
      });
    }

    // -------------------- Info producto --------------------
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

