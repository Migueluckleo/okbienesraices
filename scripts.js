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

            // CASO A: CATÁLOGO
            if (contenedorCatalogo) {
                const params = new URLSearchParams(window.location.search);
                const proyectoFiltro = params.get('proyecto');

                if (proyectoFiltro) {
                    if (infoDesarrollos && infoDesarrollos[proyectoFiltro]) {
                        renderizarHeroDesarrollo(infoDesarrollos[proyectoFiltro]);
                    }
                    const propiedadesFiltradas = propiedades.filter(p => p.desarrollo === proyectoFiltro);
                    if (propiedadesFiltradas.length > 0) {
                        renderizarCatalogo(propiedadesFiltradas);
                    } else {
                        mostrarErrorCatalogo("Por el momento no hay unidades disponibles.");
                    }
                } else {
                    renderizarCatalogo(propiedades);
                }
            }

            // CASO B: DETALLE DE PROPIEDAD
            if (contenedorDetalle) {
                const params = new URLSearchParams(window.location.search);
                const propId = params.get('id');
                const propiedadEncontrada = propiedades.find(p => p.id === propId);
                
                if (propiedadEncontrada) {
                    renderizarDetalle(propiedadEncontrada);
                } else {
                    const titulo = document.getElementById('prop-nombre');
                    if (titulo) titulo.textContent = "Propiedad no encontrada";
                    contenedorDetalle.classList.remove('opacity-0');
                }
            }
        })
        .catch(err => console.error("Error cargando base de datos:", err));
});

/* ==========================================
   LÓGICA DEL HERO DINÁMICO (CINTILLO)
========================================== */
function renderizarHeroDesarrollo(info) {
    const heroContainer = document.getElementById('hero-dinamico');
    if (!heroContainer) return;

    document.title = `${info.titulo} | OK Bienes Raíces`;

    heroContainer.innerHTML = `
      <section class="w-full">
        <div class="flex flex-col md:flex-row w-full md:items-start md:justify-between gap-6 pt-6 pb-6 md:pt-10 md:pb-8">
          <div class="flex flex-col">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">${info.titulo}</h1>
            <h2 class="text-xl md:text-2xl text-gray-600 font-light mt-1">${info.subtitulo}</h2>
          </div>
          <div class="w-full md:max-w-sm flex flex-col gap-4">
            <p class="text-sm text-gray-500 leading-relaxed">${info.descripcion}</p>
            <a href="${info.enlaceContacto}" target="_blank" rel="noopener noreferrer"
              class="inline-block bg-brand-primary-800 hover:bg-brand-primary-700 text-white text-sm font-semibold tracking-wider py-3 px-6 rounded-md shadow-lg transition-all text-center">
              Agenda una visita
            </a>
          </div>
        </div>

        <div class="relative pb-8 overflow-hidden">
          <img src="${info.imagen}" alt="${info.titulo}" class="w-full h-64 md:h-[400px] object-cover object-center rounded-sm shadow-md">
          
          <div class="md:absolute bottom-8 left-0 w-full bg-black/70 backdrop-blur-md text-white p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-600">
            <div class="flex items-center justify-center gap-4 py-3 md:py-0">
               <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
               <div class="text-left">
                  <p class="text-[9px] uppercase tracking-[0.2em] text-gray-300">Plusvalía en la zona</p>
                  <p class="mt-2 text-[8px] block opacity-60 uppercase">Aumento anual promedio</p>
                  <p class="text-xl font-bold"> <span class="num-anim" data-val="${info.metricas.plusvalia}" data-type="percent">0</span>%</p>
               </div>
            </div>
            <div class="flex flex-col items-center justify-center py-3 md:py-0 px-4 text-center">
               <p class="text-[9px] uppercase tracking-[0.2em] text-gray-300 mb-2">Precios de Airbnb por noche</p>
               <div class="flex justify-between w-full max-w-[200px]">
                  <div><span class="text-[8px] block opacity-60">DESDE</span><span class="font-bold text-xl num-anim" data-val="${info.metricas.airbnb.min}" data-type="money">$0</span></div>
                  <div><span class="text-[8px] block opacity-60">HASTA</span><span class="font-bold text-xl num-anim" data-val="${info.metricas.airbnb.max}" data-type="money">$0</span></div>
               </div>
            </div>
            <div class="flex flex-col items-center justify-center py-3 md:py-0 px-4 text-center">
               <p class="text-[9px] uppercase tracking-[0.2em] text-gray-300 mb-2">Rentas fijas en la zona</p>
               <div class="flex justify-between w-full max-w-[240px]">
                  <div><span class="text-[8px] block opacity-60">DESDE</span><span class="font-bold text-lg num-anim" data-val="${info.metricas.rentaFija.min}" data-type="money">$0</span></div>
                  <div><span class="text-[8px] block opacity-60">HASTA</span><span class="font-bold text-lg num-anim" data-val="${info.metricas.rentaFija.max}" data-type="money">$0</span></div>
               </div>
            </div>
          </div>
        </div>
      </section>
    `;
    heroContainer.classList.replace('opacity-0', 'opacity-100');
    setTimeout(iniciarAnimacionNumeros, 400);
}

function iniciarAnimacionNumeros() {
    const elementos = document.querySelectorAll('.num-anim');
    const moneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    elementos.forEach(el => {
        const target = parseFloat(el.getAttribute('data-val'));
        const tipo = el.getAttribute('data-type');
        let count = 0;
        const duration = 2000; 
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        const inc = target / totalFrames;

        const update = () => {
            count += inc;
            if (count < target) {
                el.innerText = tipo === 'money' ? moneda.format(count) : count.toFixed(1);
                requestAnimationFrame(update);
            } else {
                el.innerText = tipo === 'money' ? moneda.format(target) : target;
            }
        };
        update();
    });
}

/* ==========================================
   LÓGICA DEL CATÁLOGO
========================================== */
function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('contenedor-propiedades');
    contenedor.innerHTML = ""; 
    lista.forEach(prop => {
        const linkCard = document.createElement('a');
        linkCard.href = `propiedad.html?id=${prop.id}`;
        linkCard.className = "group cursor-pointer block no-underline flex flex-col h-full";
        const portada = `assets/${prop.imagenes[0]}`;

        linkCard.innerHTML = `
            <article class="flex flex-col h-full border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div class="overflow-hidden h-48 md:h-[240px]">
                    <img src="${portada}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="flex flex-col flex-grow p-5">
                    <div class="flex flex-row justify-between items-start gap-3">
                        <h4 class="font-bold text-gray-900 leading-tight">${prop.nombre}</h4>
                        <h4 class="font-bold text-gray-900 whitespace-nowrap text-right">${prop.precio}</h4>
                    </div>
                    <p class="text-gray-500 text-sm font-semibold tracking-wide mt-1 mb-6">${prop.specs}</p>
                    <div class="mt-auto">
                        <span class="block w-full bg-brand-primary-800 text-white text-center text-sm py-3 rounded-md font-semibold group-hover:bg-brand-primary-700 transition-colors">
                            Ver propiedad
                        </span>
                    </div>
                </div>
            </article>
        `;
        contenedor.appendChild(linkCard);
    });
    contenedor.classList.replace('opacity-0', 'opacity-100');
}

/* ==========================================
   LÓGICA DE DETALLE (PROPIEDAD.HTML) - RESTAURADA
========================================== */
function renderizarDetalle(data) {
    const btnAtras = document.getElementById('btn-atras-catalogo');
    if (btnAtras && data.desarrollo) {
        btnAtras.href = `propiedades.html?proyecto=${data.desarrollo}`;
    }

    const btnWhatsapp = document.getElementById('btn-whatsapp');
    if (btnWhatsapp) {
        const mensajeWa = `Hola, me interesa la propiedad "${data.nombre}".`;
        const waLink = `https://wa.me/523315556433?text=${encodeURIComponent(mensajeWa)}`;
        btnWhatsapp.href = waLink;
    }

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
        const imgs = data.imagenes; 
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
        mainContent.classList.replace('opacity-0', 'opacity-100');
    }
}

function mostrarErrorCatalogo(msj) {
    const contenedor = document.getElementById('contenedor-propiedades');
    contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">${msj}</p>`;
    contenedor.classList.replace('opacity-0', 'opacity-100');
}