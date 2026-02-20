// ==========================================
// LÓGICA DE LA GALERÍA DE PROPIEDADES
// ==========================================

// Toma las fotos que el HTML le indique. Si no hay, usa un array vacío para evitar errores.
let allGalleryImages = typeof pageGalleryImages !== 'undefined' ? pageGalleryImages : [];
let currentImageIndex = 0;

// 1. Cambiar la imagen principal (con efecto fade)
function changeMainImage(url) {
  const mainImg = document.getElementById('mainImage');
  if (!mainImg) return; 
  
  mainImg.style.opacity = '0'; 
  
  setTimeout(() => {
    mainImg.src = url;
    mainImg.style.opacity = '1';
  }, 150);
}

// 2. Abrir la galería a pantalla completa
function openGallery(startIndex) {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;

  currentImageIndex = startIndex;
  updateModalImage();
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => { modal.classList.remove('opacity-0'); }, 10);
  
  document.body.style.overflow = 'hidden'; 
}

// 3. Cerrar la galería
function closeGallery() {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;

  modal.classList.add('opacity-0');
  setTimeout(() => { 
    modal.classList.add('hidden'); 
    modal.classList.remove('flex');
  }, 300);
  
  document.body.style.overflow = 'auto';
}

// 4. Siguiente foto
function nextImage(event) {
  if(event) event.stopPropagation(); 
  currentImageIndex = (currentImageIndex + 1) % allGalleryImages.length;
  updateModalImage();
}

// 5. Foto anterior
function prevImage(event) {
  if(event) event.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
  updateModalImage();
}

// 6. Actualizar la imagen y el contador visual
function updateModalImage() {
  const modalImg = document.getElementById('modalImage');
  const counter = document.getElementById('galleryCounter');
  
  if (modalImg) modalImg.src = allGalleryImages[currentImageIndex];
  if (counter) counter.innerText = currentImageIndex + 1;
}

// ==========================================
// INICIALIZADORES AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const galleryTotal = document.getElementById('galleryTotal');
  if (galleryTotal) {
    galleryTotal.innerText = allGalleryImages.length;
  }

  const modal = document.getElementById('galleryModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeGallery();
      }
    });
  }
});