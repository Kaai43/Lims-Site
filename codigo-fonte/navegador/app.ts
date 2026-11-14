declare global {
  interface Window {
    htmx?: {
      config: {
        selfRequestsOnly: boolean;
        allowEval: boolean;
        allowScriptTags: boolean;
      };
    };
  }
}

function configurarHtmx(): void {
  if (window.htmx?.config) {
    window.htmx.config.selfRequestsOnly = true;
    window.htmx.config.allowEval = false;
    window.htmx.config.allowScriptTags = false;
  }
}

function configurarTema(): void {
  const botao = document.getElementById('tema-toggle');
  if (!botao) return;

  function sincronizarAtributos(): void {
    const atual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const escuro = atual === 'dark';
    botao?.setAttribute('aria-pressed', escuro ? 'true' : 'false');
    botao?.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  sincronizarAtributos();

  botao.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const proximo = atual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', proximo);
    try {
      localStorage.setItem('lims-theme', proximo);
    } catch {
      // Ignorar erro de storage
    }
    sincronizarAtributos();
  });
}

function configurarMenuMovel(): void {
  const botao = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-movel');
  if (!botao || !menu) return;

  function definirEstado(aberto: boolean): void {
    menu!.hidden = !aberto;
    botao!.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    botao!.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    definirEstado(!aberto);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      definirEstado(false);
      botao.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  configurarHtmx();
  configurarTema();
  configurarMenuMovel();
});

export {};
