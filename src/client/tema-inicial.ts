// Executado sincronamente no <head> para evitar flash de tema (FOUC) sem precisar de script inline (que violaria a CSP).
(function () {
  try {
    const salvo = localStorage.getItem('lims-theme');
    if (salvo === 'dark' || salvo === 'light') {
      document.documentElement.setAttribute('data-theme', salvo);
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch {
    // Ignorar se localStorage estiver bloqueado
  }
})();
