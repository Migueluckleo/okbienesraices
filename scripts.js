/**
* scripts.js - OK Bienes Raíces
*/

document.addEventListener('DOMContentLoaded', () => {
    const contenedorCatalogo = document.getElementById('contenedor-propiedades');
    const contenedorDetalle = document.getElementById('main-content');

    fetch("./assets/propiedades.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const propiedades = data.propiedades;
            const infoDesarrollos = data.infoDesarrollos;

            // CASO A: Estamos en propiedades.html (Catálogo)
            if (contenedorCatalogo) {
                const params = new URLSearchParams(window.location.search);
                const proyectoFiltro = params.get('proyecto');

                if (proyectoFiltro) {
                    // 1. Renderizar el Hero
                    if (infoDesarrollos && infoDesarrollos[proyectoFiltro]) {
                        renderizarHeroDesarrollo(infoDesarrollos[proyectoFiltro]);
                    }

                    // 2. Filtrar propiedades
                    const propiedadesFiltradas = propiedades.filter(p => p.desarrollo === proyectoFiltro);
                    
                    if (propiedadesFiltradas.length > 0) {
                        renderizarCatalogo(propiedadesFiltradas);
                    } else {
                        mostrarErrorCatalogo("Por el momento no hay unidades disponibles para este desarrollo.");
                    }
                } else {
                    renderizarCatalogo(propiedades); // Muestra todas si no hay filtro
                }
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
   LÓGICA DEL HERO DINÁMICO
========================================== */
function renderizarHeroDesarrollo(info) {
    const heroContainer = document.getElementById('hero-dinamico');
    if (!heroContainer) return;

    // Actualiza el título de la pestaña del navegador
    document.title = `${info.titulo} | OK Bienes Raíces`;

    heroContainer.innerHTML = `
      <section class="w-full">
        <div class="flex flex-col md:flex-row w-full md:items-start md:justify-between gap-6 pt-6 pb-6 md:pt-10 md:pb-8">
          
          <div class="flex flex-col">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              ${info.titulo}
            </h1>
            <h2 class="text-xl md:text-2xl text-gray-600 font-light mt-1">
              ${info.subtitulo}
            </h2>
          </div>

          <div class="w-full md:max-w-sm flex flex-col gap-4">
            <p class="text-sm text-gray-500 leading-relaxed">
              ${info.descripcion}
            </p>
            <a href="${info.enlaceContacto}" target="_blank" rel="noopener noreferrer"
              class="inline-block bg-brand-primary-800 hover:bg-brand-primary-700 text-white text-sm font-semibold tracking-wider py-3 px-6 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 text-center">
              Agenda una visita
            </a>
          </div>
        </div>

        <div class="pb-8">
          <img src="${info.imagen}" alt="${info.titulo}" class="w-full h-64 md:h-[400px] object-cover object-center rounded-sm shadow-md">
        </div>
      </section>
    `;

    heroContainer.classList.remove('opacity-0');
    heroContainer.classList.add('opacity-100');
}

/* ==========================================
LÓGICA DEL CATÁLOGO (propiedades.html)
========================================== */

function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('contenedor-propiedades');
    contenedor.innerHTML = ""; 

    lista.forEach(prop => {
        const linkCard = document.createElement('a');
        linkCard.href = `propiedad.html?id=${prop.id}`;
        linkCard.className = "group cursor-pointer block no-underline flex flex-col h-full";

        const portada = (prop.imagenes && prop.imagenes.length > 0)
            ? `assets/${prop.imagenes[0]}`
            : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';

        linkCard.innerHTML = `
            <article class="flex flex-col h-full border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div class="overflow-hidden h-48 md:h-[240px]">
                    <img src="${portada}" alt="${prop.nombre}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                
                <div class="flex flex-col flex-grow p-5">
                    <div class="flex flex-row justify-between items-start gap-3">
                        <h4 class="font-roboto-condensed text-lg font-bold text-gray-900 leading-tight">${prop.nombre}</h4>
                        <h4 class="font-roboto-condensed text-lg font-bold text-gray-900 whitespace-nowrap text-right">${prop.precio}</h4>
                    </div>
                    
                    <p class="text-gray-500 text-sm font-semibold tracking-wide mt-1 mb-6">${prop.specs}</p>
                    
                    <div class="mt-auto">
                        <span class="block w-full bg-brand-primary-800 text-white text-center text-sm md:text-base py-3 rounded-md font-semibold group-hover:bg-brand-primary-700 transition-colors">
                            Ver propiedad
                        </span>
                    </div>
                </div>
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
    const btnAtras = document.getElementById('btn-atras-catalogo');
    if (btnAtras && data.desarrollo) {
        btnAtras.href = `propiedades.html?proyecto=${data.desarrollo}`;
    }

    // --- NUEVO: Botón de WhatsApp dinámico ---
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    if (btnWhatsapp) {
        // Formatear el mensaje
        const mensajeWa = `Hola, me interesa la propiedad "${data.nombre}".`;
        // Crear el enlace a WhatsApp (52 es el código de país para México)
        const waLink = `https://wa.me/523315556433?text=${encodeURIComponent(mensajeWa)}`;
        btnWhatsapp.href = waLink;
    }
    // ------------------------------------------

    document.title = `${data.nombre} | OK Bienes Raíces`;
    document.getElementById('prop-nombre').textContent = data.nombre;
    document.getElementById('prop-precio').textContent = data.precio;
    document.getElementById('prop-specs').textContent = data.specs;
    document.getElementById('prop-descripcion').textContent = data.descripcion;

    const amenidadesContainer = document.getElementById('prop-amenidades');
    if(amenidadesContainer) {
        amenidadesContainer.innerHTML = data.amenidades.map(item => `
            <div class="flex items-center gap-2">
                <span class="text-brand-primary-800">❖</span> ${item}
            </div>
        `).join('');
    }

    const slidesTarget = document.getElementById('glide-slides-target');
    if(slidesTarget) {
        const imgs = data.imagenes.slice(0, 5); 
        slidesTarget.innerHTML = imgs.map(img => `
            <li class="glide__slide">
                <img src="assets/${img}" class="w-full aspect-[4/3] object-cover rounded-xl shadow-sm" alt="${data.nombre}">
            </li>
        `).join('');

        if (imgs.length > 1) {
            document.getElementById('glide-controls').classList.remove('hidden');
        }

        new Glide('.glide', {
            type: imgs.length > 1 ? 'carousel' : 'slider',
            autoplay: imgs.length > 1 ? 4000 : false,
            hoverpause: true,
            animationDuration: 800
        }).mount();
    }

    const mainContent = document.getElementById('main-content');
    if(mainContent) {
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');
    }
}

function mostrarErrorDetalle(msj) {
    const titulo = document.getElementById('prop-nombre');
    if (titulo) titulo.textContent = msj;
    const mainContent = document.getElementById('main-content');
    if(mainContent) mainContent.classList.remove('opacity-0');
}