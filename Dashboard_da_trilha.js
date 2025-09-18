(function () {
  'use strict';

  // Aguarda o carregamento completo da página (inclui scripts externos como bootstrap)
  window.addEventListener('load', function () {

    // Remove onclick inline potencialmente quebrado (opcional, evita erros)
    document.querySelectorAll('#carouselImagens .carousel-item[onclick]').forEach(el => el.removeAttribute('onclick'));

    // --- Inicializa o carousel (só se o bootstrap estiver disponível) ---
    const carouselEl = document.querySelector('#carouselImagens');
    if (carouselEl && window.bootstrap && typeof window.bootstrap.Carousel === 'function') {
      try {
        new bootstrap.Carousel(carouselEl, {
          ride: false, // não iniciar automaticamente (ajuste se quiser)
          pause: 'hover',
          wrap: true,
        });
      } catch (err) {
        console.warn('Erro ao iniciar bootstrap carousel:', err);
      }
    }

    // --- Modal e helpers ---
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementById('closeModalBtn');

    function openModalWithSrc(src, alt = '') {
      if (!modal || !modalImage) return;
      modalImage.src = src || '';
      modalImage.alt = alt || 'Imagem ampliada';
      // Exibir como flex (seu CSS usa display:flex)
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal || !modalImage) return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modalImage.src = '';
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Clique fora do conteúdo fecha
    if (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal) closeModal();
      });
    }

    // Fechar com Escape
    window.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && modal && modal.style.display === 'flex') closeModal();
    });

    // --- Anexa listeners nas imagens do carrossel (e outras miniaturas) ---
    // Seletores cobrem:
    //  - imagens dentro do carrossel (#carouselImagens .carousel-item img)
    //  - imagens em comentários (.imagens_comentario img)
    //  - previews de outras trilhas (.preview_OT)
    const selectors = [
      '#carouselImagens .carousel-item img',
      '.imagens_comentario img',
      '.preview_OT'
    ];
    const allImgs = Array.from(document.querySelectorAll(selectors.join(',')));

    allImgs.forEach(img => {
      // cursor visual
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function (e) {
        e.preventDefault();
        // se existir data-large-src use ela (para versões em maior resolução), senão usa src
        const src = img.getAttribute('data-large-src') || img.src;
        openModalWithSrc(src, img.alt || '');
      });
    });

    // Também captura clique em .carousel-item (caso clique fora da img)
    document.querySelectorAll('#carouselImagens .carousel-item').forEach(item => {
      item.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() !== 'img') {
          const img = item.querySelector('img');
          if (img) {
            const src = img.getAttribute('data-large-src') || img.src;
            openModalWithSrc(src, img.alt || '');
          }
        }
      });
    });

    // Compatibilidade: expõe uma função global openModal() que abre a imagem ativa do carousel
    // Isso evita erro caso ainda exista onclick="openModal()" no HTML.
    window.openModal = function () {
      const activeItem = document.querySelector('#carouselImagens .carousel-item.active') ||
                         document.querySelector('#carouselImagens .carousel-item');
      if (!activeItem) return;
      const img = activeItem.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('data-large-src') || img.src;
      openModalWithSrc(src, img.alt || '');
    };

  }); // window.load
})();

// ---------- MENU HAMBURGER (toggle) ----------
(function () {
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  // Toggle visual + acessibilidade
  hamburger.addEventListener('click', function (e) {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);

    // ARIA
    hamburger.setAttribute('aria-expanded', String(isActive));
    navLinks.setAttribute('aria-hidden', String(!isActive));

    // Opcional: bloquear scroll do body quando menu aberto (útil em mobile)
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Fecha o menu ao clicar em qualquer botão/ link dentro dele (UX comum)
  navLinks.addEventListener('click', function (e) {
    const target = e.target;
    if (target && target.tagName.toLowerCase() === 'button') {
      // Se for necessário navegar, aqui você pode colocar lógica (ex: window.location.href = ...)
      // Fecha o menu:
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Fecha o menu ao redimensionar para largura grande (evita ficar aberto por engano)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1000) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'false'); // visível em desktop
      document.body.style.overflow = '';
    }
  });
})();
