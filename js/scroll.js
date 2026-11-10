(function () {
  'use strict';

  var cabecalho = document.getElementById('cabecalho');
  if (!cabecalho) return;

  var LIMIAR = 4;
  var ultimoY = Math.max(0, window.scrollY || 0);
  var agendado = false;

  function atualizar() {
    agendado = false;
    var y = Math.max(0, window.scrollY || 0);

    if (y <= 0 && cabecalho.hasAttribute('data-topo-visivel')) {
      cabecalho.classList.remove('cabecalho--oculto');
      ultimoY = 0;
      return;
    }

    var delta = y - ultimoY;
    if (Math.abs(delta) < LIMIAR) return;

    if (delta > 0) {
      cabecalho.classList.remove('cabecalho--oculto');
    } else {
      cabecalho.classList.add('cabecalho--oculto');
    }
    ultimoY = y;
  }

  window.addEventListener('scroll', function () {
    if (!agendado) {
      agendado = true;
      window.requestAnimationFrame(atualizar);
    }
  }, { passive: true });
})();
