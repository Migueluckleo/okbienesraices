/**
 * scripts.js - OK Bienes Raíces
 * Maneja tanto el catálogo dinámico como la vista de detalle de propiedad.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Detectamos en qué página estamos mediante la existencia de contenedores específicos
    const contenedorCatalogo = document.getElementById('contenedor-propiedades');
    const contenedorDetalle = document.getElementById('main-content');

    // 1. Carga centralizada del JSON
    fetch("./assets/propiedades.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const propiedades = data.propiedades;

            // CASO A: Estamos en propiedades.html (Catálogo)
            if (contenedorCatalogo) {
                renderizarCatalogo(propiedades);
            }

            // CASO B: Estamos en propiedad.html (Detalle)
            if (contenedorDetalle) {
                const params = new URLSearchParams(window.location.search);
                const propId = params.get('id');
                const propiedadEncontrada = propiedades.find(p => p.id === propId);

                if (propiedadEncontrada) {
                    renderizarDetalle(propiedadEncontrada);
                } else {
                    mostrarErrorDetalle("Propiedad no encontrada");
                }
            }
        })
        .catch(err => {
            console.error("Error cargando base de datos:", err);
            if (contenedorCatalogo) mostrarErrorCatalogo("Error al cargar el catálogo.");
        });
});

/* ==========================================
   LÓGICA DEL CATÁLOGO (propiedades.html)
   ========================================== */

function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('contenedor-propiedades');
    contenedor.innerHTML = ""; // Limpiar mensaje de carga

    lista.forEach(prop => {
        const linkCard = document.createElement('a');
        // El ID del JSON se inyecta directamente en la URL aquí:
        linkCard.href = `propiedad.html?id=${prop.id}`;
        linkCard.className = "group cursor-pointer block no-underline";

        const portada = (prop.imagenes && prop.imagenes.length > 0) 
            ? `assets/${prop.imagenes[0]}` 
            : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';

        linkCard.innerHTML = `
            <article class="flex flex-col gap-2">
                <div class="overflow-hidden rounded-md">
                    <img src="${portada}" 
                         alt="${prop.nombre}" 
                         class="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="flex flex-row justify-between items-baseline mt-1">
                    <h2 class="font-roboto-condensed text-xl md:text-xl font-bold text-gray-900 leading-none">${prop.nombre}</h2>
                    <p class="font-roboto-condensed text-xl md:text-xl font-bold text-brand-primary-800 leading-none">${prop.precio}</p>
                </div>
                <p class="font-roboto-condensed text-gray-600 text-sm md:text-base font-semibold tracking-wide">
                    ${prop.specs}
                </p>
            </article>
        `;
        contenedor.appendChild(linkCard);
    });

    contenedor.classList.remove('opacity-0');
    contenedor.classList.add('opacity-100');
}

function mostrarErrorCatalogo(msj) {
    document.getElementById('contenedor-propiedades').innerHTML = `<p class="text-center font-yrsa text-gray-500">${msj}</p>`;
    document.getElementById('contenedor-propiedades').classList.remove('opacity-0');
}

/* ==========================================
   LÓGICA DE DETALLE (propiedad.html)
   ========================================== */

function renderizarDetalle(data) {
    // A. Textos básicos
    document.title = `${data.nombre} | OK Bienes Raíces`;
    document.getElementById('prop-nombre').textContent = data.nombre;
    document.getElementById('prop-precio').textContent = data.precio;
    document.getElementById('prop-specs').textContent = data.specs;
    document.getElementById('prop-descripcion').textContent = data.descripcion;

    // B. Amenidades
    const amenidadesContainer = document.getElementById('prop-amenidades');
    amenidadesContainer.innerHTML = data.amenidades.map(item => `
        <div class="flex items-center gap-2">
            <span class="text-brand-primary-800">❖</span> ${item}
        </div>
    `).join('');

    // C. Carrusel Glide.js
    const slidesTarget = document.getElementById('glide-slides-target');
    const imgs = data.imagenes.slice(0, 5); // Máximo 5 imágenes

    slidesTarget.innerHTML = imgs.map(img => `
        <li class="glide__slide">
            <img src="assets/${img}" class="w-full aspect-[4/3] object-cover rounded-xl shadow-sm" alt="${data.nombre}">
        </li>
    `).join('');

    // Configurar flechas
    if (imgs.length > 1) {
        document.getElementById('glide-controls').classList.remove('hidden');
    }

    // Inicializar Glide
    new Glide('.glide', {
        type: imgs.length > 1 ? 'carousel' : 'slider',
        autoplay: imgs.length > 1 ? 4000 : false,
        hoverpause: true,
        animationDuration: 800
    }).mount();

    // D. Mostrar contenido
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('opacity-0');
    mainContent.classList.add('opacity-100');
}

function mostrarErrorDetalle(msj) {
    const titulo = document.getElementById('prop-nombre');
    if (titulo) titulo.textContent = msj;
    document.getElementById('main-content').classList.remove('opacity-0');
}