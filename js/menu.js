(function () {
  'use strict';

  var botao = document.getElementById('menu-toggle');
  var painel = document.getElementById('menu-painel');
  if (!botao || !painel) return;

  function estaAberto() {
    return !painel.hasAttribute('hidden');
  }

  function abrir() {
    painel.removeAttribute('hidden');
    painel.classList.add('menu--aberto');
    botao.setAttribute('aria-expanded', 'true');
    botao.setAttribute('aria-label', 'Fechar menu');
  }

  function fechar(devolverFoco) {
    painel.setAttribute('hidden', '');
    painel.classList.remove('menu--aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener('click', function () {
    if (estaAberto()) {
      fechar(false);
    } else {
      abrir();
    }
  });

  document.addEventListener('keydown', function (evento) {
    if ((evento.key === 'Escape' || evento.key === 'Esc') && estaAberto()) {
      fechar(true);
    }
  });

  document.addEventListener('click', function (evento) {
    if (!estaAberto()) return;
    var alvo = evento.target;
    if (painel.contains(alvo) || botao.contains(alvo)) return;
    fechar(false);
  });
})();
