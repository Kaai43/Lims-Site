(function () {
  'use strict';

  var abas = document.querySelectorAll('.projeto-aba[data-projeto-alvo]');
  var paineis = document.querySelectorAll('.projeto-painel');
  if (!abas.length) return;

  function fecharTodos() {
    for (var i = 0; i < paineis.length; i++) {
      paineis[i].hidden = true;
    }
    for (var j = 0; j < abas.length; j++) {
      abas[j].classList.remove('projeto-aba--ativa');
      abas[j].setAttribute('aria-expanded', 'false');
    }
  }

  for (var k = 0; k < abas.length; k++) {
    abas[k].addEventListener('click', function (evento) {
      var aba = evento.currentTarget;
      var idAlvo = aba.getAttribute('data-projeto-alvo');
      var painel = idAlvo ? document.getElementById(idAlvo) : null;
      if (!painel) return;

      var jaAberto = !painel.hidden;
      fecharTodos();

      if (!jaAberto) {
        painel.hidden = false;
        aba.classList.add('projeto-aba--ativa');
        aba.setAttribute('aria-expanded', 'true');
      }
    });
  }
})();
