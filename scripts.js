document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Configuración de la galería de imágenes
    const pageGalleryImages = [
        "assets/recibidor.png", 
        "assets/cocina.jpg",   
        "assets/sala.webp", 
        "assets/dormitorio.webp", 
        "assets/bano.webp", 
        "assets/exterior.webp"  
    ];

    // 2. Inicializar Glide.js
    // Usamos 'slider' si quieres que tenga fin o 'carousel' para infinito
    const glide = new Glide('.glide', {
        type: 'carousel',
        startAt: 0,
        perView: 1, // En el detalle de propiedad, solemos querer ver 1 imagen grande
        gap: 10,
        autoplay: 4000,
        hoverpause: true,
        animationDuration: 800
    });

    glide.mount();

    // 3. (Opcional) Si quieres que al hacer clic en una foto se abra el modal
    // Solo si decides mantener el modal de pantalla completa que tenías antes
    const slides = document.querySelectorAll('.glide__slide img');
    slides.forEach((img, index) => {
        img.addEventListener('click', () => {
            console.log("Abrir modal en la foto index:", index);
            // Aquí llamarías a tu función openGallery(index) si la mantienes
        });
    });

});