const carouselElement = document.querySelector('#carouselImagens');
const carousel = new bootstrap.Carousel(carouselElement, {
  interval: 3000, // muda slide a cada 3 segundos
  ride: 'carousel', // inicia automaticamente
  pause: 'hover', // pausa no hover
  wrap: true, // volta ao primeiro slide depois do último
});
