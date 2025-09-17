const carouselElement = document.querySelector('#carouselImagens');
const carousel = new bootstrap.Carousel(carouselElement, {
  // interval: 3000, // muda slide a cada 3 segundos
  ride: 'carousel', // inicia automaticamente
  pause: 'hover', // pausa no hover
  wrap: true, // volta ao primeiro slide depois do último
});

document.addEventListener('DOMContentLoaded', function() {
  const imagensComentario = document.querySelector('.imagens_comentario');
  const imgs = imagensComentario.querySelectorAll('img');
  const verImagensDiv = imagensComentario.querySelector('.ver_imagens');

  function verificarResolucao() {
      if (window.innerWidth < 1500) {
          // Se a resolução for menor que 1500px
          imgs.forEach(img => {
              img.style.display = 'none'; // Esconde as imagens
          });
          verImagensDiv.style.display = 'flex'; // Mostra a div "ver_imagens"
      } else {
          // Se a resolução for 1500px ou maior
          imgs.forEach(img => {
              img.style.display = 'block'; // Mostra as imagens
          });
          verImagensDiv.style.display = 'none'; // Esconde a div "ver_imagens"
      }
  }

  // Executa a função na carga da página
  verificarResolucao();

  // Adiciona um listener para quando a janela for redimensionada
  window.addEventListener('resize', verificarResolucao);
});